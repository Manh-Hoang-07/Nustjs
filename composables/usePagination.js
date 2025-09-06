import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const usePagination = (options = {}) => {
  // Default options
  const {
    // API configuration
    fetchFunction = null,
    autoLoad = true,
    
    // URL parameters
    searchParam = 'search',
    categoryParam = 'category', 
    sortParam = 'sort',
    pageParam = 'page',
    perPageParam = 'per_page',
    
    // Default values
    defaultSearch = '',
    defaultCategory = '',
    defaultSort = 'latest',
    defaultPage = 1,
    defaultPerPage = 10,
    
    // Admin mode
    isAdmin = false
  } = options

  // Router - Safe initialization
  let router = null
  let route = null
  try {
    router = useRouter()
    route = useRoute()
  } catch (error) {
    console.warn('Router not available:', error)
  }

  // State - Initialize from URL params if available
  const searchQuery = ref(defaultSearch)
  const selectedCategory = ref(defaultCategory)
  const sortBy = ref(defaultSort)
  const currentPage = ref(defaultPage)
  const perPage = ref(defaultPerPage)
  const totalPages = ref(1)
  const totalRecords = ref(0)
  const loading = ref(false)
  const error = ref(null)
  const data = ref([])

  // Computed values
  const hasFilters = computed(() => {
    return searchQuery.value || selectedCategory.value || sortBy.value !== defaultSort
  })

  const hasPagination = computed(() => {
    return totalPages.value > 1
  })

  const hasData = computed(() => {
    return data.value && data.value.length > 0
  })

  const showPagination = computed(() => {
    if (loading.value) return false
    if (totalPages.value > 1) return true
    return false
  })

  const currentUrl = computed(() => {
    if (!route) return { path: '', query: {} }
    return {
      path: route.path,
      query: getQueryParams()
    }
  })

  // Get current query parameters
  const getQueryParams = () => {
    const query = {}
    
    if (searchQuery.value) query[searchParam] = searchQuery.value
    if (selectedCategory.value) query[categoryParam] = selectedCategory.value
    if (sortBy.value !== defaultSort) query[sortParam] = sortBy.value
    if (currentPage.value > 1) query[pageParam] = currentPage.value.toString()
    if (perPage.value !== defaultPerPage) query[perPageParam] = perPage.value.toString()
    
    return query
  }

  // Update URL with current parameters
  const updateURL = (replace = false) => {
    if (!router || !route) return
    
    const query = getQueryParams()
    
    if (replace) {
      router.replace({ path: route.path, query })
    } else {
      router.push({ path: route.path, query })
    }
  }

  // Initialize from URL params
  const initializeFromURL = () => {
    if (route && route.query) {
      searchQuery.value = route.query[searchParam] || defaultSearch
      selectedCategory.value = route.query[categoryParam] || defaultCategory
      sortBy.value = route.query[sortParam] || defaultSort
      currentPage.value = parseInt(route.query[pageParam]) || defaultPage
      perPage.value = parseInt(route.query[perPageParam]) || defaultPerPage
    }
  }

  // Load data from API
  const loadData = async (customParams = {}) => {
    if (!fetchFunction) return

    loading.value = true
    error.value = null

    try {
      const params = {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        category_id: selectedCategory.value,
        sort: sortBy.value,
        ...customParams
      }

      const result = await fetchFunction(params)
      
      // Handle different response formats
      if (result && result.data) {
        data.value = result.data
        if (result.meta) {
          updatePagination(result.meta)
        }
      } else if (Array.isArray(result)) {
        data.value = result
      } else {
        data.value = result
      }

      return result
    } catch (err) {
      error.value = err.message || 'Có lỗi xảy ra khi tải dữ liệu'
      console.error('Error loading data:', err)
      data.value = []
      return null
    } finally {
      loading.value = false
    }
  }

  // Update pagination data
  const updatePagination = (meta) => {
    if (meta) {
      totalPages.value = meta.last_page || meta.total_pages || 1
      totalRecords.value = meta.total || meta.total_count || 0
    }
  }

  // Set data manually (for external data)
  const setData = (newData, meta = null) => {
    data.value = newData
    if (meta) {
      updatePagination(meta)
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page === '...') return
    
    currentPage.value = page
    updateURL()
    
    if (autoLoad && fetchFunction) {
      loadData()
    }
  }

  // Handle filter change (resets pagination)
  const handleFilterChange = () => {
    currentPage.value = defaultPage
    updateURL()
    
    if (autoLoad && fetchFunction) {
      loadData()
    }
  }

  // Reset all filters and pagination
  const resetFilters = () => {
    searchQuery.value = defaultSearch
    selectedCategory.value = defaultCategory
    sortBy.value = defaultSort
    currentPage.value = defaultPage
    perPage.value = defaultPerPage
    updateURL()
    
    if (autoLoad && fetchFunction) {
      loadData()
    }
  }

  // Reset pagination only
  const resetPagination = () => {
    currentPage.value = defaultPage
    updateURL()
    
    if (autoLoad && fetchFunction) {
      loadData()
    }
  }

  // Get API parameters
  const getApiParams = () => {
    return {
      page: currentPage.value,
      per_page: perPage.value,
      search: searchQuery.value,
      category_id: selectedCategory.value,
      sort: sortBy.value
    }
  }

  // Pagination navigation methods
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      handlePageChange(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      handlePageChange(currentPage.value - 1)
    }
  }

  const goToFirstPage = () => {
    handlePageChange(1)
  }

  const goToLastPage = () => {
    handlePageChange(totalPages.value)
  }

  // Set loading state
  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  // Watch for URL changes (browser back/forward)
  if (route) {
    watch(() => route.query, (newQuery) => {
      if (newQuery) {
        searchQuery.value = newQuery[searchParam] || defaultSearch
        selectedCategory.value = newQuery[categoryParam] || defaultCategory
        sortBy.value = newQuery[sortParam] || defaultSort
        currentPage.value = parseInt(newQuery[pageParam]) || defaultPage
        perPage.value = parseInt(newQuery[perPageParam]) || defaultPerPage
        
        if (autoLoad && fetchFunction) {
          loadData()
        }
      }
    }, { deep: true })
  }

  // Watch for filter changes
  watch([searchQuery, selectedCategory, sortBy], () => {
    handleFilterChange()
  }, { deep: true })

  // Initialize on mount
  onMounted(() => {
    if (autoLoad) {
      initializeFromURL()
      if (fetchFunction) {
        loadData()
      }
    }
  })

  return {
    // State
    searchQuery,
    selectedCategory,
    sortBy,
    currentPage,
    perPage,
    totalPages,
    totalRecords,
    loading,
    error,
    data,
    
    // Computed
    hasFilters,
    hasPagination,
    hasData,
    showPagination,
    currentUrl,
    
    // Methods
    updateURL,
    initializeFromURL,
    loadData,
    setData,
    updatePagination,
    handlePageChange,
    handleFilterChange,
    resetFilters,
    resetPagination,
    getApiParams,
    getQueryParams,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setLoading
  }
}
