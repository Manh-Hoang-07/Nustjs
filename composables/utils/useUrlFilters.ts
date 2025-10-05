import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigation } from '@/composables/navigation/useNavigation'
import type { FiltersState, UrlFiltersOptions, UrlFiltersResult } from './utils.types'
import { createDebouncedFunction } from './utils.utils'

// ===== COMPOSABLE =====

/**
 * Composable xử lý việc đồng bộ filters với URL
 */
export function useUrlFilters(
  options: UrlFiltersOptions = {}
): UrlFiltersResult {
  const route = useRoute()
  const { updateQuery } = useNavigation()

  const {
    filterKeys = ['search', 'category', 'status', 'date_from', 'date_to'],
    debounceMs = 300
  } = options

  // State
  const filters = ref<FiltersState>({})

  // Load filters from URL
  const loadFiltersFromUrl = (): void => {
    const newFilters: FiltersState = {}
    
    filterKeys.forEach(key => {
      const value = route.query[key]
      if (value !== undefined && value !== null && value !== '') {
        // Xử lý số 0 và các giá trị hợp lệ khác
        newFilters[key] = value
      }
    })
    
    filters.value = newFilters
  }

  // Update filters in URL
  const updateFiltersInUrl = (newFilters: FiltersState): void => {
    const query: Record<string, any> = { ...route.query }
    
    // Update filters
    filterKeys.forEach(key => {
      const value = newFilters[key]
      // Giữ lại giá trị 0, false và các giá trị hợp lệ khác
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value
      } else {
        query[key] = undefined
      }
    })

    // Remove undefined values (but keep 0 and false values)
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === null || query[key] === '') {
        delete query[key]
      }
    })

    // Sử dụng updateQuery để giữ nguyên path gốc
    updateQuery(query)
  }

  // Debounced update URL function
  const debouncedUpdateUrl = createDebouncedFunction(updateFiltersInUrl, { delay: debounceMs })

  // Reset filters in URL
  const resetFiltersInUrl = (): void => {
    const query: Record<string, any> = { ...route.query }
    
    // Remove all filter keys
    filterKeys.forEach(key => {
      delete query[key]
    })

    // Sử dụng updateQuery để giữ nguyên path gốc
    updateQuery(query)
  }

  return {
    filters,
    loadFiltersFromUrl,
    updateFiltersInUrl: debouncedUpdateUrl,
    resetFiltersInUrl
  }
}
