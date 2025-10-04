import { ref, type Ref } from 'vue'

// ===== TYPES =====

export interface DataFilteringOptions {
  defaultFilters?: Record<string, any>
  debounceTime?: number
  resetPageOnFilter?: boolean
}

export interface DataFilteringResult {
  filters: Ref<Record<string, any>>
  updateFilters: (newFilters: Record<string, any>) => void
  resetFilters: () => void
  debouncedUpdateFilters: (newFilters: Record<string, any>) => void
}

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

  let debounceTimer: NodeJS.Timeout | null = null

  // Debounced update filters function
  const debouncedUpdateFilters = (newFilters: Record<string, any>): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      updateFilters(newFilters)
    }, debounceTime)
  }

  // Filter functions
  const updateFilters = (newFilters: Record<string, any>): void => {
    // Prevent infinite loops by checking if filters actually changed
    const hasChanged = Object.keys(newFilters).some(key => filters.value[key] !== newFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters.value, newFilters)
  }

  const resetFilters = (): void => {
    // Prevent infinite loops by checking if filters actually changed
    const hasChanged = Object.keys(defaultFilters).some(key => filters.value[key] !== defaultFilters[key])
    if (!hasChanged) return
    
    Object.assign(filters.value, defaultFilters)
  }

  return {
    filters,
    updateFilters,
    resetFilters,
    debouncedUpdateFilters
  }
}
