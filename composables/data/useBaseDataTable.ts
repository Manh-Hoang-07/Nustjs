import { ref, reactive, computed, onMounted, watch, toRef, type Ref, type ComputedRef } from 'vue'
import { useApiClient } from '../api/useApiClient'
import useUrlState from '../utils/useUrlState'

// ===== TYPES =====

export interface PaginationMeta {
  current_page: number
  from: number
  to: number
  total: number
  per_page: number
  last_page: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
}

export interface BaseDataTableOptions {
  defaultFilters?: Record<string, any>
  defaultSort?: string
  cacheEnabled?: boolean
  debounceTime?: number
  pageSize?: number
  // URL sync options
  enableUrlSync?: boolean
  filterKeys?: string[]
  sortKeys?: string[]
  paginationKeys?: string[]
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
  resetOnRouteChange?: boolean
  // Transform functions
  transformItem?: (item: any) => any
  beforeSubmit?: (data: any) => any
  afterFetch?: (data: any) => any
}

export interface CacheItem {
  data: any
  meta: PaginationMeta
  timestamp: number
  ttl: number
}

export interface BaseDataTableState<T = any> {
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  pagination: Ref<PaginationMeta>
  filters: Ref<Record<string, any>>
}

export interface BaseDataTableComputed {
  hasData: ComputedRef<boolean>
  isEmpty: ComputedRef<boolean>
  isFirstPage: ComputedRef<boolean>
  isLastPage: ComputedRef<boolean>
}

export interface BaseDataTableResult<T = any> extends BaseDataTableComputed {
  // State as refs
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  pagination: Ref<PaginationMeta>
  filters: Ref<Record<string, any>>
  // Core methods
  fetchData: (params?: Record<string, any>) => Promise<{ data: T[]; meta: PaginationMeta }>
  debouncedFetch: (params?: Record<string, any>) => void
  refresh: () => Promise<{ data: T[]; meta: PaginationMeta }>
  
  // Filter methods
  updateFilters: (newFilters: Record<string, any>) => void
  resetFilters: () => void
  
  // Pagination methods
  changePage: (page: number) => void
  changePageSize: (size: number) => void
  
  // Utility methods
  clearCache: () => void
  getCurrentQuery?: () => Record<string, any>
}

// ===== COMPOSABLE =====

/**
 * Base composable cho data table với các chức năng cơ bản
 * Có thể được kế thừa để thêm các chức năng chuyên biệt
 */
export function useBaseDataTable<T = any>(
  endpoint: string,
  options: BaseDataTableOptions = {}
): BaseDataTableResult<T> {
  const { apiClient } = useApiClient()
  
  const {
    defaultFilters = {},
    defaultSort = 'created_at_desc',
    cacheEnabled = false,
    debounceTime = 300,
    pageSize = 10,
    // URL sync options
    enableUrlSync = false,
    filterKeys = [],
    sortKeys = [],
    paginationKeys = ['page', 'per_page'],
    resetPageOnFilter = true,
    resetPageOnSort = false,
    resetOnRouteChange = true,
    // Transform functions
    transformItem = (item: any) => item,
    beforeSubmit = (data: any) => data,
    afterFetch = (data: any) => data
  } = options

  // State
  const items = ref([]) as Ref<T[]>
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: pageSize,
    last_page: 1,
    links: []
  })
  const filters = ref<Record<string, any>>({ ...defaultFilters })

  const cache = new Map<string, CacheItem>()
  let debounceTimer: NodeJS.Timeout | null = null

  // URL sync setup (if enabled) - sẽ được setup sau khi fetchData được định nghĩa
  let urlState: any = null

  // Computed properties
  const computedProps: BaseDataTableComputed = {
    hasData: computed(() => items.value.length > 0),
    isEmpty: computed(() => !loading.value && items.value.length === 0),
    isFirstPage: computed(() => pagination.value.current_page === 1),
    isLastPage: computed(() => pagination.value.current_page === pagination.value.last_page)
  }

  // Cache key generator
  const getCacheKey = (params: Record<string, any>): string => {
    return JSON.stringify({ ...filters.value, ...params })
  }

  // Cache với TTL (Time To Live)
  const setCacheWithTTL = (key: string, data: { data: T[]; meta: PaginationMeta }, ttl: number = 5 * 60 * 1000): void => {
    cache.set(key, {
      data,
      meta: data.meta,
      timestamp: Date.now(),
      ttl
    })
  }

  const getCacheWithTTL = (key: string): { data: T[]; meta: PaginationMeta } | null => {
    const cached = cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      cache.delete(key)
      return null
    }
    
    return { data: cached.data, meta: cached.meta }
  }

  // Debounced fetch function
  const debouncedFetch = (params: Record<string, any> = {}): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      fetchData(params)
    }, debounceTime)
  }

  // Main fetch function
  const fetchData = async (params: Record<string, any> = {}): Promise<{ data: T[]; meta: PaginationMeta }> => {
    console.log('useBaseDataTable fetchData called with params:', params)
    console.log('endpoint:', endpoint)
    
    // Prevent multiple simultaneous API calls
    if (loading.value) {
      console.log('Already loading, returning current data')
      return { data: items.value, meta: pagination.value }
    }
    
    console.log('Starting fetch...')
    loading.value = true
    error.value = null
    
    try {
      // Use URL state params if URL sync is enabled
      let requestParams = { 
        ...filters.value, 
        ...params,
        per_page: pagination.value.per_page
      }
      
      if (enableUrlSync && urlState) {
        const urlQuery = urlState.getCurrentQuery()
        // Merge URL query with local filters and params
        requestParams = {
          ...filters.value,        // Local filters as base
          ...urlQuery,             // URL query overrides
          ...params,               // Direct params override everything
          per_page: pagination.value.per_page
        }
      }
      
      const cacheKey = getCacheKey(requestParams)
      
      // Check cache first
      if (cacheEnabled) {
        const cachedData = getCacheWithTTL(cacheKey)
        if (cachedData) {
          items.value = cachedData.data
          Object.assign(pagination.value, cachedData.meta)
          loading.value = false
          return cachedData
        }
      }
      
      // Fetch from server
      console.log('Making API call to:', endpoint, 'with params:', requestParams)
      const response = await apiClient.get(endpoint, { params: requestParams })
      console.log('API response:', response)
      
      const { data, meta } = response.data
      console.log('Response data:', data)
      console.log('Response meta:', meta)
      
      // Transform items
      const transformedData = data.map(transformItem)
      console.log('Transformed data:', transformedData)
      
      // Update state
      items.value = transformedData
      Object.assign(pagination.value, meta)
      console.log('State updated. items:', items.value)
      
      // Cache result
      if (cacheEnabled) {
        setCacheWithTTL(cacheKey, { data: transformedData, meta })
      }
      
      // After fetch hook
      afterFetch(response.data)
      
      return { data: transformedData, meta }
    } catch (err: any) {
      error.value = err.userMessage || 'Lỗi tải dữ liệu'
      items.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter functions
  const updateFilters = (newFilters: Record<string, any>): void => {
    // Prevent infinite loops by checking if filters actually changed
    const hasChanged = Object.keys(newFilters).some(key => filters.value[key] !== newFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters.value, newFilters)
    
    // Use URL state if enabled
    if (enableUrlSync && urlState) {
      urlState.onUpdateFilters(newFilters)
      // Also call fetchData directly to ensure immediate update
      fetchData()
    } else {
      fetchData()
    }
  }

  const resetFilters = (): void => {
    // Prevent infinite loops by checking if filters actually changed
    const hasChanged = Object.keys(defaultFilters).some(key => filters.value[key] !== defaultFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters.value, defaultFilters)
    
    // Use URL state if enabled
    if (enableUrlSync && urlState) {
      urlState.onResetFilters()
      // Also call fetchData directly to ensure immediate update
      fetchData()
    } else {
      fetchData()
    }
  }

  // Pagination functions
  const changePage = (page: number): void => {
    if (enableUrlSync && urlState) {
      urlState.onPageChange(page)
      // Also call fetchData directly to ensure immediate update
      fetchData({ page, per_page: pagination.value.per_page })
    } else {
      fetchData({ page, per_page: pagination.value.per_page })
    }
  }

  const changePageSize = (size: number): void => {
    pagination.value.per_page = size
    if (enableUrlSync && urlState) {
      urlState.onUpdatePerPage(size)
      // Also call fetchData directly to ensure immediate update
      fetchData({ page: 1, per_page: size })
    } else {
      fetchData({ page: 1, per_page: size })
    }
  }

  // Utility functions
  const clearCache = (): void => {
    cache.clear()
  }

  const refresh = (): Promise<{ data: T[]; meta: PaginationMeta }> => {
    return fetchData()
  }

  // Setup URL sync sau khi fetchData đã được định nghĩa
  if (enableUrlSync) {
    const urlFilters = ref({ ...filters.value })
    const urlPagination = ref({ currentPage: 1, perPage: pageSize })
    const urlSort = ref({})
    
    urlState = useUrlState(
      urlFilters,
      urlPagination,
      urlSort,
      fetchData, // Pass fetchData function to useUrlState
      {
        filterKeys: filterKeys || [],
        sortKeys: sortKeys || [],
        paginationKeys,
        resetPageOnFilter,
        resetPageOnSort,
        resetOnRouteChange
      }
    )
  }

  // Watch URL state changes (if enabled)
  if (enableUrlSync && urlState) {
    watch(() => urlState.getCurrentQuery(), (newQuery) => {
      // Sync URL query to local filters
      Object.assign(filters.value, newQuery)
    }, { deep: true })
  }

  // Initialize - fetchData sẽ được gọi bởi useUrlState nếu enableUrlSync = true
  // hoặc có thể gọi thủ công nếu cần
  if (!enableUrlSync) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    // State - return refs directly
    items,
    loading,
    error,
    pagination,
    filters,
    
    // Computed
    ...computedProps,
    
    // Core methods
    fetchData,
    debouncedFetch,
    refresh,
    
    // Filter methods
    updateFilters,
    resetFilters,
    
    // Pagination methods
    changePage,
    changePageSize,
    
    // Utility methods
    clearCache,
    
    // URL sync methods (if enabled)
    ...(enableUrlSync && urlState ? {
      getCurrentQuery: urlState.getCurrentQuery
    } : {})
  }
}