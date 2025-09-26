import { onMounted, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ===== TYPES =====

interface PaginationState {
  currentPage: number
  [key: string]: any
}

interface FiltersState {
  [key: string]: any
}

interface SyncQueryPaginationResult {
  onPageChange: (page: number) => void
  onUpdateFilters: (newFilters: FiltersState) => void
}

// ===== COMPOSABLE =====

export default function useSyncQueryPagination(
  filters: Ref<FiltersState>, 
  pagination: Ref<PaginationState>, 
  fetchData: () => void, 
  filterKeys: string[] = ['search']
): SyncQueryPaginationResult {
  const route = useRoute()
  const router = useRouter()

  // Đọc query khi vào trang
  onMounted(() => {
    if (route.query.page) {
      pagination.value.currentPage = parseInt(route.query.page as string)
    }
    filterKeys.forEach(key => {
      if (route.query[key]) filters.value[key] = route.query[key]
    })
    fetchData()
  })

  // Cập nhật URL khi đổi trang hoặc filter
  function updateUrl(): void {
    const query = { ...route.query }
    query.page = pagination.value.currentPage !== 1 ? pagination.value.currentPage : undefined
    filterKeys.forEach(key => {
      query[key] = filters.value[key] || undefined
    })
    router.replace({ query })
  }

  function onPageChange(page: number): void {
    if (page !== pagination.value.currentPage) {
      pagination.value.currentPage = page
      updateUrl()
      fetchData()
    }
  }

  function onUpdateFilters(newFilters: FiltersState): void {
    filters.value = newFilters
    pagination.value.currentPage = 1
    updateUrl()
    fetchData()
  }

  return { onPageChange, onUpdateFilters }
}
