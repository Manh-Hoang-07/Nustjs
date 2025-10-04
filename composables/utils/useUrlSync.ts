import { onMounted, watch, nextTick, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUrlFilters } from './useUrlFilters'
import { useUrlPagination } from './useUrlPagination'
import { useNavigation } from '@/composables/navigation/useNavigation'

// ===== TYPES =====

interface FiltersState {
  [key: string]: any
}

interface PaginationState {
  currentPage: number
  perPage?: number
  [key: string]: any
}

interface SortState {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface UrlSyncOptions {
  filterKeys?: string[]
  sortKeys?: string[]
  paginationKeys?: string[]
  debounceMs?: number
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
  resetOnRouteChange?: boolean
  defaultPageSize?: number
}

interface UrlSyncResult {
  onPageChange: (page: number) => void
  onUpdateFilters: (newFilters: FiltersState) => void
  onUpdateSort: (sort: SortState) => void
  onUpdatePerPage: (perPage: number) => void
  onResetFilters: () => void
  onResetAll: () => void
  getCurrentQuery: () => Record<string, any>
}

// ===== COMPOSABLE =====

/**
 * Composable xử lý việc đồng bộ tổng thể với URL
 */
export function useUrlSync(
  filters: Ref<FiltersState>, 
  pagination: Ref<PaginationState>, 
  sort: Ref<SortState>,
  fetchData: () => void, 
  options: UrlSyncOptions = {}
): UrlSyncResult {
  const route = useRoute()
  const { updateQuery } = useNavigation()

  const {
    filterKeys = ['search', 'category', 'status', 'date_from', 'date_to'],
    sortKeys = ['sort_by', 'sort_order'],
    paginationKeys = ['page', 'per_page'],
    debounceMs = 300,
    resetPageOnFilter = true,
    resetPageOnSort = false,
    resetOnRouteChange = true,
    defaultPageSize = 10
  } = options

  // Initialize URL composables
  const urlFilters = useUrlFilters({
    filterKeys,
    debounceMs
  })

  const urlPagination = useUrlPagination({
    paginationKeys,
    debounceMs,
    defaultPageSize
  })

  // Đọc query khi vào trang
  onMounted(() => {
    loadStateFromUrl()
    // Không gọi fetchData ở đây để tránh trùng lặp
    // useBaseDataTable sẽ tự động gọi fetchData khi cần thiết
  })

  // Watch for route changes (back/forward navigation)
  watch(() => route.query, () => {
    loadStateFromUrl()
    // Không gọi fetchData ở đây để tránh trùng lặp với useBaseDataTable
    // useBaseDataTable sẽ tự động gọi fetchData khi cần thiết
  }, { deep: true })

  // Watch for route path changes (navigation between pages)
  if (resetOnRouteChange) {
    watch(() => route.path, (newPath, oldPath) => {
      if (newPath !== oldPath) {
        // Only reset if navigating to a completely different page
        // Don't reset if just changing query parameters on the same page
        const currentPage = newPath.split('?')[0]
        const previousPage = oldPath?.split('?')[0]
        
        if (currentPage !== previousPage) {
          // Reset to default state when navigating to a different page
          pagination.value.currentPage = 1
          pagination.value.perPage = defaultPageSize
          filters.value = {}
          sort.value = {}
          updateUrl()
        }
      }
    })
  }

  function loadStateFromUrl(): void {
    // Load pagination
    urlPagination.loadPaginationFromUrl()
    Object.assign(pagination.value, urlPagination.pagination.value)

    // Load filters
    urlFilters.loadFiltersFromUrl()
    Object.assign(filters.value, urlFilters.filters.value)

    // Load sort
    if (route.query.sort_by) {
      sort.value.sortBy = route.query.sort_by as string
    }
    if (route.query.sort_order && ['asc', 'desc'].includes(route.query.sort_order as string)) {
      sort.value.sortOrder = route.query.sort_order as 'asc' | 'desc'
    }
  }

  // Cập nhật URL với tất cả tham số
  function updateUrl(): void {
    const query: Record<string, any> = { ...route.query }
    
    // Update pagination
    query.page = pagination.value.currentPage > 1 ? pagination.value.currentPage : undefined
    if (pagination.value.perPage && pagination.value.perPage !== defaultPageSize) {
      query.per_page = pagination.value.perPage
    } else {
      query.per_page = undefined
    }

    // Update filters
    filterKeys.forEach(key => {
      const value = filters.value[key]
      // Giữ lại giá trị 0, false và các giá trị hợp lệ khác
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value
      } else {
        query[key] = undefined
      }
    })

    // Update sort
    query.sort_by = sort.value.sortBy || undefined
    query.sort_order = sort.value.sortOrder || undefined

    // Remove undefined values (but keep 0 and false values)
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === null || query[key] === '') {
        delete query[key]
      }
    })

    // Use navigation composable to update URL
    updateQuery(query)
  }

  function onPageChange(page: number): void {
    if (page !== pagination.value.currentPage && page > 0) {
      pagination.value.currentPage = page
      updateUrl()
      // State đã được cập nhật, watcher trong useBaseDataTable sẽ tự động gọi fetchData
    }
  }

  function onUpdateFilters(newFilters: FiltersState): void {
    filters.value = { ...filters.value, ...newFilters }
    
    if (resetPageOnFilter) {
      pagination.value.currentPage = 1
    }
    
    updateUrl()
    // State đã được cập nhật, watcher trong useBaseDataTable sẽ tự động gọi fetchData
  }

  function onUpdateSort(newSort: SortState): void {
    sort.value = { ...sort.value, ...newSort }
    
    if (resetPageOnSort) {
      pagination.value.currentPage = 1
    }
    
    updateUrl()
    // State đã được cập nhật, watcher trong useBaseDataTable sẽ tự động gọi fetchData
  }

  function onUpdatePerPage(perPage: number): void {
    if (perPage > 0 && perPage !== pagination.value.perPage) {
      pagination.value.perPage = perPage
      pagination.value.currentPage = 1 // Reset to first page when changing per page
      updateUrl()
      // State đã được cập nhật, watcher trong useBaseDataTable sẽ tự động gọi fetchData
    }
  }

  function onResetFilters(): void {
    // Reset filters to empty state
    filterKeys.forEach(key => {
      delete filters.value[key]
    })
    pagination.value.currentPage = 1
    updateUrl()
    // State đã được cập nhật, watcher trong useBaseDataTable sẽ tự động gọi fetchData
  }

  function onResetAll(): void {
    // Reset everything
    filterKeys.forEach(key => {
      delete filters.value[key]
    })
    sort.value = {}
    pagination.value.currentPage = 1
    pagination.value.perPage = defaultPageSize
    updateUrl()
    // State đã được cập nhật, watcher trong useBaseDataTable sẽ tự động gọi fetchData
  }

  function getCurrentQuery(): Record<string, any> {
    const query: Record<string, any> = {
      page: pagination.value.currentPage,
      per_page: pagination.value.perPage,
      ...filters.value,
      sort_by: sort.value.sortBy,
      sort_order: sort.value.sortOrder
    }
    
    // Loại bỏ các giá trị undefined nhưng giữ lại 0 và false
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === null || query[key] === '') {
        delete query[key]
      }
    })
    
    return query
  }

  return { 
    onPageChange, 
    onUpdateFilters, 
    onUpdateSort,
    onUpdatePerPage,
    onResetFilters,
    onResetAll,
    getCurrentQuery
  }
}
