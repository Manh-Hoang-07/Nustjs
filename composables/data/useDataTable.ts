import { ref, reactive, computed, type Ref, type ComputedRef } from 'vue'
import { useApiClient } from '../api/useApiClient'
import useUrlState from '@/composables/utils/useUrlState'

// ===== TYPES =====

interface DataTableOptions {
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
}

interface PaginationMeta {
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

interface CacheItem {
  data: any
  meta: PaginationMeta
  timestamp: number
  ttl: number
}

interface DataTableResult<T = any> {
  // State
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  pagination: PaginationMeta
  filters: Record<string, any>
  
  // Computed
  hasData: ComputedRef<boolean>
  isEmpty: ComputedRef<boolean>
  isFirstPage: ComputedRef<boolean>
  isLastPage: ComputedRef<boolean>
  
  // Methods
  fetchData: (params?: Record<string, any>) => Promise<{ data: T[]; meta: PaginationMeta }>
  debouncedFetch: (params?: Record<string, any>) => void
  updateFilters: (newFilters: Record<string, any>) => void
  resetFilters: () => void
  changePage: (page: number) => void
  changePageSize: (size: number) => void
  createItem: (itemData: any) => Promise<any>
  updateItem: (id: number, itemData: any) => Promise<any>
  deleteItem: (id: number) => Promise<void>
  clearCache: () => void
  refresh: () => Promise<{ data: T[]; meta: PaginationMeta }>
  getCurrentQuery?: () => Record<string, any>
}

// ===== COMPOSABLE =====

export function useDataTable<T = any>(
  endpoint: string, 
  options: DataTableOptions = {}
): DataTableResult<T> {
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
    resetOnRouteChange = true
  } = options

  // State
  const items: Ref<T[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const pagination: PaginationMeta = reactive({
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: pageSize,
    last_page: 1,
    links: []
  })
  
  const filters = reactive({ ...defaultFilters })
  const cache = new Map<string, CacheItem>()
  let debounceTimer: NodeJS.Timeout | null = null

  // URL sync setup (if enabled)
  let urlState: any = null
  if (enableUrlSync) {
    // Use the same filters object for URL sync
    const urlFilters = ref(filters)
    const urlPagination = ref({ currentPage: 1, perPage: pageSize })
    const urlSort = ref({})
    
    urlState = useUrlState(
      urlFilters,
      urlPagination,
      urlSort,
      () => {}, // No auto fetch, we'll handle it manually
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

  // Computed
  const hasData: ComputedRef<boolean> = computed(() => items.value.length > 0)
  const isEmpty: ComputedRef<boolean> = computed(() => !loading.value && items.value.length === 0)
  const isFirstPage: ComputedRef<boolean> = computed(() => pagination.current_page === 1)
  const isLastPage: ComputedRef<boolean> = computed(() => pagination.current_page === pagination.last_page)

  // Cache key generator
  const getCacheKey = (params: Record<string, any>): string => {
    return JSON.stringify({ ...filters, ...params })
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
    // Prevent multiple simultaneous API calls
    if (loading.value) {
      return { data: items.value, meta: pagination }
    }
    
    loading.value = true
    error.value = null
    
    try {
      // Use URL state params if URL sync is enabled
      let requestParams = { 
        ...filters, 
        ...params,
        per_page: pageSize
      }
      
      if (enableUrlSync && urlState) {
        const urlQuery = urlState.getCurrentQuery()
        // Merge URL query with local filters and params
        requestParams = {
          ...filters,        // Local filters as base
          ...urlQuery,       // URL query overrides
          ...params,         // Direct params override everything
          per_page: pageSize
        }
      }
      
      const cacheKey = getCacheKey(requestParams)
      
      // Check cache first
      if (cacheEnabled) {
        const cachedData = getCacheWithTTL(cacheKey)
        if (cachedData) {
          items.value = cachedData.data
          Object.assign(pagination, cachedData.meta)
          loading.value = false
          return cachedData
        }
      }
      
      // Fetch from server (no retry logic)
      const response = await apiClient.get(endpoint, { params: requestParams })
      const { data, meta } = response.data
      
      // Update state
      items.value = data
      Object.assign(pagination, meta)
      
      // Cache result
      if (cacheEnabled) {
        setCacheWithTTL(cacheKey, { data, meta })
      }
      
      return { data, meta }
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
    const hasChanged = Object.keys(newFilters).some(key => filters[key] !== newFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters, newFilters)
    
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
    const hasChanged = Object.keys(defaultFilters).some(key => filters[key] !== defaultFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters, defaultFilters)
    
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
      fetchData({ page, per_page: pageSize })
    } else {
      fetchData({ page, per_page: pageSize })
    }
  }

  const changePageSize = (size: number): void => {
    pagination.per_page = size
    if (enableUrlSync && urlState) {
      urlState.onUpdatePerPage(size)
      // Also call fetchData directly to ensure immediate update
      fetchData({ page: 1, per_page: size })
    } else {
      fetchData({ page: 1, per_page: size })
    }
  }

  // CRUD functions
  const createItem = async (itemData: any): Promise<any> => {
    try {
      const response = await apiClient.post(endpoint, itemData)
      await fetchData() // Refresh data
      return response.data
    } catch (err: any) {
      error.value = err.userMessage || 'Lỗi tạo dữ liệu'
      throw err
    }
  }

  const updateItem = async (id: number, itemData: any): Promise<any> => {
    try {
      const response = await apiClient.put(`${endpoint}/${id}`, itemData)
      await fetchData() // Refresh data
      return response.data
    } catch (err: any) {
      error.value = err.userMessage || 'Lỗi cập nhật dữ liệu'
      throw err
    }
  }

  const deleteItem = async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`${endpoint}/${id}`)
      await fetchData() // Refresh data
    } catch (err: any) {
      error.value = err.userMessage || 'Lỗi xóa dữ liệu'
      throw err
    }
  }

  // Utility functions
  const clearCache = (): void => {
    cache.clear()
  }

  const refresh = (): Promise<{ data: T[]; meta: PaginationMeta }> => {
    return fetchData()
  }

  return {
    // State
    items,
    loading,
    error,
    pagination,
    filters,
    
    // Computed
    hasData,
    isEmpty,
    isFirstPage,
    isLastPage,
    
    // Methods
    fetchData,
    debouncedFetch,
    updateFilters,
    resetFilters,
    changePage,
    changePageSize,
    createItem,
    updateItem,
    deleteItem,
    clearCache,
    refresh,
    
    // URL sync methods (if enabled)
    ...(enableUrlSync && urlState ? {
      getCurrentQuery: urlState.getCurrentQuery
    } : {})
  }
}
