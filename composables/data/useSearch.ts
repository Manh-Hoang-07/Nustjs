import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { debounce } from '@/utils/optimization'

// ===== TYPES =====

interface SearchOptions {
  searchFn: (query: string) => Promise<any[]>
  debounceMs?: number
  minLength?: number
  cacheResults?: boolean
  cacheTimeout?: number
}

interface CacheItem {
  data: any[]
  timestamp: number
}

interface SearchResult<T = any> {
  // State
  query: Ref<string>
  results: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  
  // Computed
  hasQuery: ComputedRef<boolean>
  isEmpty: ComputedRef<boolean>
  
  // Methods
  search: (newQuery: string) => void
  clear: () => void
  clearCache: () => void
  debouncedSearch: (searchQuery: string) => Promise<void>
}

// ===== COMPOSABLE =====

/**
 * Composable để quản lý search với debouncing và caching
 */
export function useSearch<T = any>(options: SearchOptions): SearchResult<T> {
  const {
    searchFn,
    debounceMs = 300,
    minLength = 2,
    cacheResults = true,
    cacheTimeout = 5 * 60 * 1000 // 5 phút
  } = options

  // State
  const query: Ref<string> = ref('')
  const results: Ref<T[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const cache = new Map<string, CacheItem>()

  // Computed
  const hasQuery: ComputedRef<boolean> = computed(() => query.value.length >= minLength)
  const isEmpty: ComputedRef<boolean> = computed(() => results.value.length === 0 && !loading.value)

  // Debounced search function
  const debouncedSearch = debounce(async (searchQuery: string): Promise<void> => {
    if (!searchQuery || searchQuery.length < minLength) {
      results.value = []
      return
    }

    // Check cache first
    if (cacheResults && cache.has(searchQuery)) {
      const cached = cache.get(searchQuery)!
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
    } catch (err: any) {
      error.value = err.message || 'Có lỗi xảy ra khi tìm kiếm'
      results.value = []
    } finally {
      loading.value = false
    }
  }, debounceMs)

  // Search function
  const search = (newQuery: string): void => {
    query.value = newQuery
    debouncedSearch(newQuery)
  }

  // Clear search
  const clear = (): void => {
    query.value = ''
    results.value = []
    error.value = null
    debouncedSearch.cancel()
  }

  // Clear cache
  const clearCache = (): void => {
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
