import { ref, type Ref } from 'vue'
import { useGlobalApiClient } from '../api/useApiClient'
import type { 
  PaginationMeta, 
  DataFetchingOptions, 
  DataFetchingResult 
} from './data.types'
import { 
  buildDataFullUrl, 
  defaultTransformItem, 
  defaultBeforeSubmit, 
  defaultAfterFetch, 
  extractErrorMessage 
} from './data.utils'

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
    transformItem = defaultTransformItem,
    beforeSubmit = defaultBeforeSubmit,
    afterFetch = defaultAfterFetch
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
    // Prevent multiple simultaneous API calls
    if (isFetching.value || loading.value) {
      return { data: items.value, meta: pagination.value }
    }
    
    isFetching.value = true
    loading.value = true
    error.value = null
    
    try {
      // Transform params before sending
      const transformedParams = beforeSubmit(params)
      
      // Build full URL with query string
      const fullUrl = buildDataFullUrl(endpoint, transformedParams)
      const response = await apiClient.get(fullUrl)
      
      const { data, meta } = response.data
      
      // Transform items
      const transformedData = data.map(transformItem)
      
      // Update state
      items.value = transformedData
      Object.assign(pagination.value, meta)
      
      // After fetch hook
      afterFetch(response.data)
      
      return { data: transformedData, meta }
    } catch (err: any) {
      error.value = extractErrorMessage(err)
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
