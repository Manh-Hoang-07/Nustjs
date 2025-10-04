import { useRouter } from 'vue-router'

// ===== COMPOSABLE =====

export function useNavigation() {
  const router = useRouter()

  const navigateTo = (path: string) => {
    router.push({ path, query: {} })
  }

  const navigateToWithQuery = (path: string, query: Record<string, any> = {}) => {
    router.push({ path, query })
  }

  const updateQuery = (newQuery: Record<string, any> = {}) => {
    const currentPath = router.currentRoute.value.path
    const currentQuery = router.currentRoute.value.query
    router.replace({ 
      path: currentPath,
      query: { ...currentQuery, ...newQuery }
    })
  }

  return {
    navigateTo,
    navigateToWithQuery,
    updateQuery
  }
}
