import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// ===== COMPOSABLE =====

export function usePermissionGuards() {
  const authStore = useAuthStore()
  const router = useRouter()

  const guardRoute = (options: {
    requiresAuth?: boolean
    roles?: string[]
    permissions?: string[]
    redirectTo?: string
    fallbackPath?: string
  }): boolean => {
    const {
      requiresAuth = false,
      roles = [],
      permissions = [],
      redirectTo = '/auth/login',
      fallbackPath = '/home'
    } = options

    // Kiểm tra authentication
    if (requiresAuth && !authStore.isAuthenticated) {
      router.push(redirectTo)
      return false
    }

    // Kiểm tra role
    if (roles.length > 0 && !roles.includes(authStore.userRole)) {
      router.push(fallbackPath)
      return false
    }

    // Kiểm tra permissions
    if (permissions.length > 0 && !authStore.canAny(permissions)) {
      router.push(fallbackPath)
      return false
    }

    return true
  }

  return {
    guardRoute
  }
}
