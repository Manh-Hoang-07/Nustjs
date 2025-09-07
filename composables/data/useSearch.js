import { ref, computed, watch } from 'vue'
import { debounce } from '../utils/optimization.js'

/**
 * Composable để quản lý search với debouncing và caching
 * @param {Object} options - Các tùy chọn
 * @param {Function} options.searchFn - Hàm search
 * @param {number} options.debounceMs - Thời gian debounce (ms)
 * @param {number} options.minLength - Độ dài tối thiểu để search
 * @param {boolean} options.cacheResults - Có cache kết quả không
 * @param {number} options.cacheTimeout - Thời gian cache (ms)
 * @returns {Object} - Các state và methods cho search
 */
export function useSearch(options = {}) {
  const {
    searchFn,
    debounceMs = 300,
    minLength = 2,
    cacheResults = true,
    cacheTimeout = 5 * 60 * 1000 // 5 phút
  } = options

  // State
  const query = ref('')
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)
  const cache = new Map()

  // Computed
  const hasQuery = computed(() => query.value.length >= minLength)
  const isEmpty = computed(() => results.value.length === 0 && !loading.value)

  // Debounced search function
  const debouncedSearch = debounce(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < minLength) {
      results.value = []
      return
    }

    // Check cache first
    if (cacheResults && cache.has(searchQuery)) {
      const cached = cache.get(searchQuery)
      if (Date.now() - cached.timestamp < cacheTimeout) {
        results.value = cached.data
        return
      } else {
        cache.delete(searchQuery)
      }
    }

    loading.value = true
    error.value = null

    try {
      const data = await searchFn(searchQuery)
      results.value = data

      // Cache results
      if (cacheResults) {
        cache.set(searchQuery, {
          data,
          timestamp: Date.now()
        })
      }
    } catch (err) {
      error.value = err.message || 'Có lỗi xảy ra khi tìm kiếm'
      results.value = []
    } finally {
      loading.value = false
    }
  }, debounceMs)

  // Search function
  const search = (newQuery) => {
    query.value = newQuery
    debouncedSearch(newQuery)
  }

  // Clear search
  const clear = () => {
    query.value = ''
    results.value = []
    error.value = null
    debouncedSearch.cancel()
  }

  // Clear cache
  const clearCache = () => {
    cache.clear()
  }

  // Watch for query changes
  watch(query, (newQuery) => {
    if (newQuery && newQuery.length >= minLength) {
      debouncedSearch(newQuery)
    } else {
      results.value = []
    }
  })

  return {
    // State
    query,
    results,
    loading,
    error,
    
    // Computed
    hasQuery,
    isEmpty,
    
    // Methods
    search,
    clear,
    clearCache,
    
    // Debounced function for manual control
    debouncedSearch
  }
} 