import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigation } from '@/composables/navigation/useNavigation'

// ===== TYPES =====

interface PaginationState {
  currentPage: number
  perPage?: number
  [key: string]: any
}

interface UrlPaginationOptions {
  paginationKeys?: string[]
  debounceMs?: number
  defaultPageSize?: number
}

interface UrlPaginationResult {
  pagination: Ref<PaginationState>
  loadPaginationFromUrl: () => void
  updatePaginationInUrl: (pagination: PaginationState) => void
  resetPaginationInUrl: () => void
}

// ===== UTILITIES =====

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// ===== COMPOSABLE =====

/**
 * Composable xử lý việc đồng bộ pagination với URL
 */
export function useUrlPagination(
  options: UrlPaginationOptions = {}
): UrlPaginationResult {
  const route = useRoute()
  const { updateQuery } = useNavigation()

  const {
    paginationKeys = ['page', 'per_page'],
    debounceMs = 300,
    defaultPageSize = 10
  } = options

  // State
  const pagination = ref<PaginationState>({
    currentPage: 1,
    perPage: defaultPageSize
  })

  // Load pagination from URL
  const loadPaginationFromUrl = (): void => {
    // Load page
    if (route.query.page) {
      const page = parseInt(route.query.page as string)
      if (page > 0) {
        pagination.value.currentPage = page
      }
    }
    
    // Load per_page
    if (route.query.per_page) {
      const perPage = parseInt(route.query.per_page as string)
      if (perPage > 0) {
        pagination.value.perPage = perPage
      }
    }
  }

  // Update pagination in URL
  const updatePaginationInUrl = (newPagination: PaginationState): void => {
    const query: Record<string, any> = { ...route.query }
    
    // Update pagination
    query.page = newPagination.currentPage > 1 ? newPagination.currentPage : undefined
    if (newPagination.perPage && newPagination.perPage !== defaultPageSize) {
      query.per_page = newPagination.perPage
    } else {
      query.per_page = undefined
    }

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
  const debouncedUpdateUrl = debounce(updatePaginationInUrl, debounceMs)

  // Reset pagination in URL
  const resetPaginationInUrl = (): void => {
    const query: Record<string, any> = { ...route.query }
    
    // Remove pagination keys
    paginationKeys.forEach(key => {
      delete query[key]
    })

    // Sử dụng updateQuery để giữ nguyên path gốc
    updateQuery(query)
  }

  return {
    pagination,
    loadPaginationFromUrl,
    updatePaginationInUrl: debouncedUpdateUrl,
    resetPaginationInUrl
  }
}
