import { ref, reactive, computed } from 'vue'
import { useApiClient } from '../api/useApiClient.js'

export function useDataTable(endpoint, options = {}) {
  const apiClient = useApiClient()
  const {
    defaultFilters = {},
    defaultSort = 'created_at_desc',
    cacheEnabled = true,
    debounceTime = 300,
    pageSize = 10
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
    last_page: 1,
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



  // Cache key generator
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

  // Debounced fetch function
  const debouncedFetch = (params = {}) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      fetchData(params)
    }, debounceTime)
  }

  // Main fetch function
  const fetchData = async (params = {}) => {
    // Prevent multiple simultaneous API calls
    if (loading.value) {
      return
    }
    
    console.log('useDataTable fetchData called with params:', params)
    console.log('Current filters:', filters)
    console.log('Endpoint:', endpoint)
    
    loading.value = true
    error.value = null
    
    try {
      const requestParams = { 
        ...filters, 
        ...params,
        per_page: pageSize
      }
      console.log('Request params with per_page:', requestParams)
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
      console.log('API response meta:', meta)
      Object.assign(pagination, meta)
      console.log('Updated pagination:', pagination)
      
      // Cache result
      if (cacheEnabled) {
        setCacheWithTTL(cacheKey, { data, meta })
      }
      
      return { data, meta }
    } catch (err) {
      error.value = err.userMessage || 'Lỗi tải dữ liệu'
      items.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter functions
  const updateFilters = (newFilters) => {
    // Prevent infinite loops by checking if filters actually changed
    const hasChanged = Object.keys(newFilters).some(key => filters[key] !== newFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters, newFilters)
    fetchData()
  }

  const resetFilters = () => {
    // Prevent infinite loops by checking if filters actually changed
    const hasChanged = Object.keys(defaultFilters).some(key => filters[key] !== defaultFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters, defaultFilters)
    fetchData()
  }

  // Pagination functions
  const changePage = (page) => {
    fetchData({ page, per_page: pageSize })
  }

  const changePageSize = (size) => {
    pagination.per_page = size
    fetchData({ page: 1, per_page: size })
  }

  // CRUD functions
  const createItem = async (itemData) => {
    try {
      const response = await apiClient.post(endpoint, itemData)
      await fetchData() // Refresh data
      return response.data
    } catch (err) {
      error.value = err.userMessage || 'Lỗi tạo dữ liệu'
      throw err
    }
  }

  const updateItem = async (id, itemData) => {
    try {
      const response = await apiClient.put(`${endpoint}/${id}`, itemData)
      await fetchData() // Refresh data
      return response.data
    } catch (err) {
      error.value = err.userMessage || 'Lỗi cập nhật dữ liệu'
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      await apiClient.delete(`${endpoint}/${id}`)
      await fetchData() // Refresh data
    } catch (err) {
      error.value = err.userMessage || 'Lỗi xóa dữ liệu'
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
    debouncedFetch,
    updateFilters,
    resetFilters,
    changePage,
    changePageSize,
    createItem,
    updateItem,
    deleteItem,
    clearCache,
    refresh
  }
} 