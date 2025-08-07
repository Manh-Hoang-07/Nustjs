import { ref, reactive, computed } from 'vue'
import { useApiClient } from '../api/useApiClient.js'

export function useDataTable(endpoint, options = {}) {
  const apiClient = useApiClient()
  const {
    defaultFilters = {},
    defaultSort = 'created_at_desc',
    cacheEnabled = true,
    debounceTime = 300,
    // Thêm options mới
    pageSize = 10,
    enableVirtualScroll = false
  } = options

  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = reactive({
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: pageSize,
    links: []
  })
  
  const filters = reactive({ ...defaultFilters })
  const cache = new Map()
  let debounceTimer = null

  // Computed
  const hasData = computed(() => items.value.length > 0)
  const isEmpty = computed(() => !loading.value && items.value.length === 0)
  const isFirstPage = computed(() => pagination.current_page === 1)
  const isLastPage = computed(() => pagination.current_page === pagination.last_page)

  // Cache key generator với TTL
  const getCacheKey = (params) => {
    return JSON.stringify({ ...filters, ...params })
  }

  // Cache với TTL (Time To Live)
  const setCacheWithTTL = (key, data, ttl = 5 * 60 * 1000) => { // 5 phút
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  const getCacheWithTTL = (key) => {
    const cached = cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      cache.delete(key)
      return null
    }
    
    return cached.data
  }

  // Debounced fetch function với improved debouncing
  const debouncedFetch = (params = {}) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      fetchData(params)
    }, debounceTime)
  }

  // Main fetch function với improved caching
  const fetchData = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const requestParams = { ...filters, ...params }
      const cacheKey = getCacheKey(requestParams)
      
      // Check cache first với TTL
      if (cacheEnabled) {
        const cachedData = getCacheWithTTL(cacheKey)
        if (cachedData) {
          items.value = cachedData.data
          Object.assign(pagination, cachedData.meta)
          loading.value = false
          return cachedData
        }
      }
      
      // Fetch from server using apiClient (with authentication)
      const response = await apiClient.get(endpoint, { params: requestParams })
      const { data, meta } = response.data
      
      // Update state
      items.value = data
      if (meta) {
        Object.assign(pagination, meta)
      }
      
      // Cache the result với TTL
      if (cacheEnabled) {
        setCacheWithTTL(cacheKey, { data, meta })
      }
      
      return { data, meta }
    } catch (err) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu'
      console.error('DataTable fetch error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter handlers
  const updateFilters = (newFilters) => {
    Object.assign(filters, newFilters)
    debouncedFetch({ page: 1 })
  }

  const resetFilters = () => {
    Object.assign(filters, defaultFilters)
    debouncedFetch({ page: 1 })
  }

  // Pagination handlers
  const changePage = (page) => {
    fetchData({ page })
  }

  const changePageSize = (size) => {
    pagination.per_page = size
    fetchData({ page: 1, per_page: size })
  }

  // CRUD operations
  const createItem = async (itemData) => {
    try {
      const response = await apiClient.post(endpoint, itemData)
      // Clear cache and refresh
      if (cacheEnabled) {
        cache.clear()
      }
      await fetchData()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra khi tạo mới'
      throw err
    }
  }

  const updateItem = async (id, itemData) => {
    try {
      const response = await apiClient.put(`${endpoint}/${id}`, itemData)
      // Clear cache and refresh
      if (cacheEnabled) {
        cache.clear()
      }
      await fetchData()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      await apiClient.delete(`${endpoint}/${id}`)
      // Clear cache and refresh
      if (cacheEnabled) {
        cache.clear()
      }
      await fetchData()
    } catch (err) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra khi xóa'
      throw err
    }
  }

  // Utility functions
  const clearCache = () => {
    cache.clear()
  }

  const refresh = () => {
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
    updateFilters,
    resetFilters,
    changePage,
    changePageSize,
    createItem,
    updateItem,
    deleteItem,
    clearCache,
    refresh,
    debouncedFetch
  }
} 