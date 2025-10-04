import { type Ref } from 'vue'
import { useUrlSync } from './useUrlSync'

// ===== TYPES =====

interface PaginationState {
  currentPage: number
  perPage?: number
  [key: string]: any
}

interface FiltersState {
  [key: string]: any
}

interface SortState {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface SyncQueryPaginationOptions {
  filterKeys?: string[]
  sortKeys?: string[]
  paginationKeys?: string[]
  debounceMs?: number
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
  resetOnRouteChange?: boolean
}

interface SyncQueryPaginationResult {
  onPageChange: (page: number) => void
  onUpdateFilters: (newFilters: FiltersState) => void
  onUpdateSort: (sort: SortState) => void
  onUpdatePerPage: (perPage: number) => void
  onResetFilters: () => void
  onResetAll: () => void
  getCurrentQuery: () => Record<string, any>
}

// ===== COMPOSABLE =====

export default function useUrlState(
  filters: Ref<FiltersState>, 
  pagination: Ref<PaginationState>, 
  sort: Ref<SortState>,
  fetchData: () => void, 
  options: SyncQueryPaginationOptions = {}
): SyncQueryPaginationResult {
  const {
    filterKeys = ['search', 'category', 'status', 'date_from', 'date_to'],
    sortKeys = ['sort_by', 'sort_order'],
    paginationKeys = ['page', 'per_page'],
    debounceMs = 300,
    resetPageOnFilter = true,
    resetPageOnSort = false,
    resetOnRouteChange = true
  } = options

  // Use the new useUrlSync composable
  return useUrlSync(filters, pagination, sort, fetchData, {
    filterKeys,
    sortKeys,
    paginationKeys,
    debounceMs,
    resetPageOnFilter,
    resetPageOnSort,
    resetOnRouteChange
  })
}
