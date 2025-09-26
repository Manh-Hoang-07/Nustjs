import { ref, type Ref } from 'vue'

// ===== TYPES =====

interface PaginationInit {
  current: number
  perPage: number
  total: number
}

interface PaginationResult {
  currentPage: Ref<number>
  perPage: Ref<number>
  total: Ref<number>
  setPage: (page: number) => void
  setTotal: (val: number) => void
}

// ===== COMPOSABLE =====

export default function usePagination(init: PaginationInit = { current: 1, perPage: 10, total: 0 }): PaginationResult {
  const currentPage: Ref<number> = ref(init.current)
  const perPage: Ref<number> = ref(init.perPage)
  const total: Ref<number> = ref(init.total)

  function setPage(page: number): void {
    currentPage.value = page
  }

  function setTotal(val: number): void {
    total.value = val
  }

  return {
    currentPage,
    perPage,
    total,
    setPage,
    setTotal
  }
}
