import { type Ref } from 'vue'
import { useUrlSync } from './useUrlSync'
import type { 
  PaginationState, 
  FiltersState, 
  SortState, 
  SyncQueryPaginationOptions, 
  SyncQueryPaginationResult 
} from './utils.types'

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
