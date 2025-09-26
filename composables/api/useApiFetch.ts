import { ref, watch, onMounted, type Ref } from 'vue'
import { useApiClient } from './useApiClient'

// ===== TYPES =====

interface ApiFetchOptions {
  immediate?: boolean
  params?: Ref<Record<string, any>>
}

interface ApiFetchResult<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<any>
  fetchData: () => Promise<void>
}

// ===== COMPOSABLE =====

/**
 * Composable để fetch dữ liệu từ API một cách đơn giản, không cache
 */
export default function useApiFetch<T = any>(
  url: string, 
  params: Ref<Record<string, any>> = ref({}), 
  immediate: boolean = true
): ApiFetchResult<T> {
  const { apiClient } = useApiClient()
  const data: Ref<T | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<any> = ref(null)

  const fetchData = async (): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const res = await apiClient.get<T>(url, { params: params.value })
      data.value = res.data
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    onMounted(fetchData)
    watch(params, fetchData, { deep: true })
  }

  return { data, loading, error, fetchData }
}
