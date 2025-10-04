import { ref, reactive, computed, onMounted, watch, toRef, type Ref, type ComputedRef } from 'vue'
import { useDataFetching } from './useDataFetching'
import { useDataFiltering } from './useDataFiltering'
import { useDataPagination } from './useDataPagination'
import { useDataCaching } from './useDataCaching'
import { useGlobalApiClient } from '../api/useApiClient'
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

  // Initialize composables
  const dataFetching = useDataFetching<T>(endpoint, {
    transformItem,
    beforeSubmit,
    afterFetch
  })

  // Flag to prevent duplicate fetchData calls
  const isFetching = ref(false)
  let debounceTimer: NodeJS.Timeout | null = null

  const dataFiltering = useDataFiltering({
    defaultFilters,
    debounceTime,
    resetPageOnFilter
  })

  const dataPagination = useDataPagination({
    pageSize,
    resetPageOnFilter,
    resetPageOnSort
  })

  const dataCaching = useDataCaching<T>({
    cacheEnabled,
    defaultTTL: 5 * 60 * 1000
  })

  // URL sync setup (if enabled) - khởi tạo sớm
  let urlState: any = null

  // Computed properties
  const computedProps: BaseDataTableComputed = {
    hasData: computed(() => dataFetching.items.value.length > 0),
    isEmpty: computed(() => !dataFetching.loading.value && dataFetching.items.value.length === 0),
    isFirstPage: computed(() => dataFetching.pagination.value.current_page === 1),
    isLastPage: computed(() => dataFetching.pagination.value.current_page === dataFetching.pagination.value.last_page)
  }

  // Main fetch function that combines all composables
  const fetchData = async (params: Record<string, any> = {}): Promise<{ data: T[]; meta: PaginationMeta }> => {
    // Prevent multiple simultaneous API calls
    if (isFetching.value || dataFetching.loading.value) {
      return { data: dataFetching.items.value, meta: dataFetching.pagination.value }
    }
    
    isFetching.value = true
    
    // Debounce rapid successive calls
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    return new Promise((resolve, reject) => {
      debounceTimer = setTimeout(async () => {
        try {
          const result = await performFetch(params)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, debounceTime)
    })
  }
  
  // Actual fetch logic separated to avoid duplication
  const performFetch = async (params: Record<string, any> = {}): Promise<{ data: T[]; meta: PaginationMeta }> => {
    
    try {
      // Use URL state params if URL sync is enabled
      let requestParams = { 
        ...dataFiltering.filters.value, 
        ...params,
        per_page: dataPagination.pagination.value.per_page
      }
      
      if (enableUrlSync && urlState) {
        const urlQuery = urlState.getCurrentQuery()
        
        // Merge URL query with local filters and params
        requestParams = {
          ...urlQuery,             // URL query as base (this is the main source)
          ...dataFiltering.filters.value,        // Local filters as fallback
          ...params,               // Direct params override everything
          // Don't override per_page from URL if it exists
          ...(urlQuery.per_page ? {} : { per_page: dataPagination.pagination.value.per_page })
        }
      }
      
      const cacheKey = dataCaching.generateCacheKey(requestParams)
      
      // Check cache first
      if (cacheEnabled) {
        const cachedData = dataCaching.getCache(cacheKey)
        if (cachedData) {
          dataFetching.items.value = cachedData.data
          Object.assign(dataFetching.pagination.value, cachedData.meta)
          return cachedData
        }
      }
      
      // Use dataFetching composable to make API call
      const result = await dataFetching.fetchData(requestParams)
      
      // Cache result
      if (cacheEnabled) {
        dataCaching.setCache(cacheKey, result)
      }
      
      return result
    } catch (err: any) {
      throw err
    } finally {
      isFetching.value = false
    }
  }

  // Debounced fetch function
  const debouncedFetch = (params: Record<string, any> = {}): void => {
    dataFiltering.debouncedUpdateFilters(params)
  }

  // Filter functions
  const updateFilters = (newFilters: Record<string, any>): void => {
    dataFiltering.updateFilters(newFilters)
    
    // Use URL state if enabled
    if (enableUrlSync && urlState) {
      urlState.onUpdateFilters(newFilters)
      // Không gọi fetchData ở đây vì watcher sẽ tự động gọi
    }
    // Không gọi fetchData() ở đây nữa vì watcher sẽ tự động gọi
  }

  const resetFilters = (): void => {
    dataFiltering.resetFilters()
    
    // Use URL state if enabled
    if (enableUrlSync && urlState) {
      urlState.onResetFilters()
      // Không gọi fetchData ở đây vì watcher sẽ tự động gọi
    }
    // Không gọi fetchData() ở đây nữa vì watcher sẽ tự động gọi
  }

  // Pagination functions
  const changePage = (page: number): void => {
    dataPagination.changePage(page)
    
    if (enableUrlSync && urlState) {
      urlState.onPageChange(page)
      // Không gọi fetchData ở đây vì watcher sẽ tự động gọi
    }
    // Không gọi fetchData() ở đây nữa vì watcher sẽ tự động gọi
  }

  const changePageSize = (size: number): void => {
    dataPagination.changePageSize(size)
    
    if (enableUrlSync && urlState) {
      urlState.onUpdatePerPage(size)
      // Không gọi fetchData ở đây vì watcher sẽ tự động gọi
    }
    // Không gọi fetchData() ở đây nữa vì watcher sẽ tự động gọi
  }

  // Utility functions
  const clearCache = (): void => {
    dataCaching.clearCache()
  }

  const refresh = (): Promise<{ data: T[]; meta: PaginationMeta }> => {
    return fetchData()
  }

  // Setup URL sync sau khi fetchData đã được định nghĩa
  if (enableUrlSync) {
    const urlFilters = ref({ ...dataFiltering.filters.value })
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
    // Watch URL query changes (from browser navigation)
    watch(() => urlState.getCurrentQuery(), (newQuery, oldQuery) => {
      // Sync URL query to local filters
      Object.assign(dataFiltering.filters.value, newQuery)
      // Gọi fetchData với tham số từ URL
      if (!isFetching.value && JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        fetchData()
      }
    }, { deep: true })
    
    // Watch local filters changes để gọi fetchData khi cần thiết
    watch(() => dataFiltering.filters.value, () => {
      if (!isFetching.value) {
        fetchData()
      }
    }, { deep: true })
    
    // Watch pagination changes để gọi fetchData khi cần thiết
    watch(() => dataPagination.pagination.value, () => {
      if (!isFetching.value) {
        fetchData()
      }
    }, { deep: true })
  }

  // Initialize - gọi fetchData để load dữ liệu ban đầu
  onMounted(() => {
    // Always call fetchData on mount to load initial data
    // URL sync will handle subsequent updates
    fetchData()
  })

  return {
    // State - return refs directly from composables
    items: dataFetching.items,
    loading: dataFetching.loading,
    error: dataFetching.error,
    pagination: dataFetching.pagination,
    filters: dataFiltering.filters,
    
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