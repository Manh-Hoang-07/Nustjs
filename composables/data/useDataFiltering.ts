import { ref, type Ref } from 'vue'
import type { DataFilteringOptions, DataFilteringResult } from './data.types'
import { 
  hasFiltersChanged, 
  hasFiltersChangedFromDefault, 
  mergeFilters, 
  createDataDebouncedFunction 
} from './data.utils'

// ===== COMPOSABLE =====

/**
 * Composable xử lý việc filter dữ liệu
 */
export function useDataFiltering(
  options: DataFilteringOptions = {}
): DataFilteringResult {
  const {
    defaultFilters = {},
    debounceTime = 300,
    resetPageOnFilter = true
  } = options

  // State
  const filters = ref<Record<string, any>>({ ...defaultFilters })

  // Filter functions
  const updateFilters = (newFilters: Record<string, any>): void => {
    // Prevent infinite loops by checking if filters actually changed
    if (!hasFiltersChanged(filters.value, newFilters)) return
    
    Object.assign(filters.value, newFilters)
  }

  const resetFilters = (): void => {
    // Prevent infinite loops by checking if filters actually changed
    if (!hasFiltersChangedFromDefault(filters.value, defaultFilters)) return
    
    Object.assign(filters.value, defaultFilters)
  }

  // Debounced update filters function (defined after updateFilters)
  const debouncedUpdateFilters = createDataDebouncedFunction(updateFilters, debounceTime)

  return {
    filters,
    updateFilters,
    resetFilters,
    debouncedUpdateFilters
  }
}
