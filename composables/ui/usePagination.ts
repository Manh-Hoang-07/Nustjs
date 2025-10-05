import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { PaginationInit, PaginationResult } from './ui.types'
import { createPaginationOptions, calculatePaginationInfo } from './ui.utils'

// ===== COMPOSABLE =====

export default function usePagination(init: PaginationInit = { current: 1, perPage: 10, total: 0 }): PaginationResult {
  const currentPage: Ref<number> = ref(init.current)
  const perPage: Ref<number> = ref(init.perPage)
  const total: Ref<number> = ref(init.total)

  // Computed properties
  const canGoNext: ComputedRef<boolean> = computed(() => {
    const info = calculatePaginationInfo(currentPage.value, perPage.value, total.value)
    return info.hasNext
  })

  const canGoPrev: ComputedRef<boolean> = computed(() => {
    const info = calculatePaginationInfo(currentPage.value, perPage.value, total.value)
    return info.hasPrev
  })

  const totalPages: ComputedRef<number> = computed(() => {
    const info = calculatePaginationInfo(currentPage.value, perPage.value, total.value)
    return info.totalPages
  })

  function setPage(page: number): void {
    currentPage.value = page
  }

  function setTotal(val: number): void {
    total.value = val
  }

  function setPerPage(size: number): void {
    perPage.value = size
    currentPage.value = 1 // Reset to first page
  }

  function nextPage(): void {
    if (canGoNext.value) {
      currentPage.value++
    }
  }

  function prevPage(): void {
    if (canGoPrev.value) {
      currentPage.value--
    }
  }

  function firstPage(): void {
    currentPage.value = 1
  }

  function lastPage(): void {
    currentPage.value = totalPages.value
  }

  return {
    currentPage,
    perPage,
    total,
    setPage,
    setTotal,
    setPerPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canGoNext,
    canGoPrev,
    totalPages
  }
}
