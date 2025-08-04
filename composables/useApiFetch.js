import { ref, watch, onMounted } from 'vue'

export default function useApiFetch(url, params = ref({}), immediate = true) {
  const api = useApiClient()
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(url, { params: params.value })
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