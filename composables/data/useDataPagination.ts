import { ref, type Ref } from 'vue'
import type { PaginationMeta, DataPaginationOptions, DataPaginationResult } from './data.types'
import { createDefaultPaginationMeta, isValidPage, isValidPageSize } from './data.utils'

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
  const pagination = ref<PaginationMeta>(createDefaultPaginationMeta(pageSize))

  // Pagination functions
  const changePage = (page: number): void => {
    if (isValidPage(page, pagination.value.last_page)) {
      pagination.value.current_page = page
    }
  }

  const changePageSize = (size: number): void => {
    if (isValidPageSize(size)) {
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
