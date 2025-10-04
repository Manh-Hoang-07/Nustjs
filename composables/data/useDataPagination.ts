import { ref, type Ref } from 'vue'
import type { PaginationMeta } from './useDataFetching'

// ===== TYPES =====

export interface DataPaginationOptions {
  pageSize?: number
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
}

export interface DataPaginationResult {
  pagination: Ref<PaginationMeta>
  changePage: (page: number) => void
  changePageSize: (size: number) => void
  resetToFirstPage: () => void
}

// ===== COMPOSABLE =====

/**
 * Composable xử lý việc phân trang dữ liệu
 */
export function useDataPagination(
  options: DataPaginationOptions = {}
): DataPaginationResult {
  const {
    pageSize = 10,
    resetPageOnFilter = true,
    resetPageOnSort = false
  } = options

  // State
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: pageSize,
    last_page: 1,
    links: []
  })

  // Pagination functions
  const changePage = (page: number): void => {
    if (page > 0 && page <= pagination.value.last_page) {
      pagination.value.current_page = page
    }
  }

  const changePageSize = (size: number): void => {
    if (size > 0) {
      pagination.value.per_page = size
      // Reset to first page when changing page size
      pagination.value.current_page = 1
    }
  }

  const resetToFirstPage = (): void => {
    pagination.value.current_page = 1
  }

  return {
    pagination,
    changePage,
    changePageSize,
    resetToFirstPage
  }
}
