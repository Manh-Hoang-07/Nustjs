import { useRouter } from 'vue-router'

// ===== COMPOSABLE =====

/**
 * Composable để xử lý navigation một cách thống nhất
 * Tự động xóa query parameters khi navigate
 */
export function useNavigation() {
  const router = useRouter()

  /**
   * Navigate đến một path và xóa tất cả query parameters
   */
  const navigateTo = (path: string) => {
    router.push({ path, query: {} })
  }

  /**
   * Navigate đến một path với query parameters cụ thể
   */
  const navigateToWithQuery = (path: string, query: Record<string, any> = {}) => {
    router.push({ path, query })
  }

  /**
   * Navigate và giữ lại query parameters hiện tại
   */
  const navigateToKeepQuery = (path: string) => {
    const currentQuery = router.currentRoute.value.query
    router.push({ path, query: currentQuery })
  }

  /**
   * Navigate và merge query parameters
   */
  const navigateToMergeQuery = (path: string, newQuery: Record<string, any> = {}) => {
    const currentQuery = router.currentRoute.value.query
    router.push({ 
      path, 
      query: { ...currentQuery, ...newQuery }
    })
  }

  /**
   * Cập nhật query parameters mà không thay đổi path
   */
  const updateQuery = (newQuery: Record<string, any> = {}) => {
    const currentPath = router.currentRoute.value.path
    const currentQuery = router.currentRoute.value.query
    router.replace({ 
      path: currentPath, // Giữ nguyên path gốc
      query: { ...currentQuery, ...newQuery }
    })
  }

  return {
    navigateTo,
    navigateToWithQuery,
    navigateToKeepQuery,
    navigateToMergeQuery,
    updateQuery
  }
}
