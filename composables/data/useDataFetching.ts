import { ref, type Ref } from 'vue'
import { useGlobalApiClient } from '../api/useApiClient'

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

export interface DataFetchingOptions {
  transformItem?: (item: any) => any
  beforeSubmit?: (data: any) => any
  afterFetch?: (data: any) => any
}

export interface DataFetchingResult<T = any> {
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  pagination: Ref<PaginationMeta>
  fetchData: (params?: Record<string, any>) => Promise<{ data: T[]; meta: PaginationMeta }>
  refresh: () => Promise<{ data: T[]; meta: PaginationMeta }>
}

// ===== COMPOSABLE =====

/**
 * Composable xử lý việc fetch dữ liệu từ API
 */
export function useDataFetching<T = any>(
  endpoint: string,
  options: DataFetchingOptions = {}
): DataFetchingResult<T> {
  const { apiClient } = useGlobalApiClient()
  
  const {
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
    per_page: 10,
    last_page: 1,
    links: []
  })
  
  // Flag to prevent duplicate calls
  const isFetching = ref(false)

  // Main fetch function
  const fetchData = async (params: Record<string, any> = {}): Promise<{ data: T[]; meta: PaginationMeta }> => {
    console.log('useDataFetching fetchData called with params:', params)
    console.log('endpoint:', endpoint)
    
    // Prevent multiple simultaneous API calls
    if (isFetching.value || loading.value) {
      console.log('Already fetching, returning current data')
      return { data: items.value, meta: pagination.value }
    }
    
    console.log('Starting fetch...')
    isFetching.value = true
    loading.value = true
    error.value = null
    
    try {
      // Transform params before sending
      const transformedParams = beforeSubmit(params)
      console.log('Original params:', params)
      console.log('Transformed params:', transformedParams)
      console.log('beforeSubmit function:', beforeSubmit)
      
      // Fetch from server
      console.log('Making API call to:', endpoint, 'with params:', transformedParams)
      console.log('API call config object:', { params: transformedParams })
      
      // Try different approaches to debug
      console.log('Trying direct URL params approach...')
      const urlParams = new URLSearchParams()
      Object.keys(transformedParams).forEach(key => {
        if (transformedParams[key] !== undefined && transformedParams[key] !== null && transformedParams[key] !== '') {
          urlParams.append(key, transformedParams[key])
        }
      })
      const queryString = urlParams.toString()
      console.log('Query string:', queryString)
      
      // Try using URL directly instead of params
      const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint
      console.log('Full URL:', fullUrl)
      const response = await apiClient.get(fullUrl)
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
      
      // After fetch hook
      afterFetch(response.data)
      
      return { data: transformedData, meta }
    } catch (err: any) {
      error.value = err.userMessage || 'Lỗi tải dữ liệu'
      items.value = []
      throw err
    } finally {
      isFetching.value = false
      loading.value = false
    }
  }

  const refresh = (): Promise<{ data: T[]; meta: PaginationMeta }> => {
    // Reset fetching flag to allow refresh
    isFetching.value = false
    return fetchData()
  }

  return {
    items,
    loading,
    error,
    pagination,
    fetchData,
    refresh
  }
}
