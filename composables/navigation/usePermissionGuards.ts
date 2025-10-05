import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { PermissionGuardOptions, PermissionGuardResult, RouteGuardResult } from './navigation.types'

// ===== COMPOSABLE =====

export function usePermissionGuards(): PermissionGuardResult {
  const authStore = useAuthStore()
  const router = useRouter()

  const guardRoute = (options: PermissionGuardOptions): boolean => {
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

  const checkAccess = (options: PermissionGuardOptions): RouteGuardResult => {
    const {
      requiresAuth = false,
      roles = [],
      permissions = [],
      redirectTo = '/auth/login',
      fallbackPath = '/home'
    } = options

    // Kiểm tra authentication
    if (requiresAuth && !authStore.isAuthenticated) {
      return {
        hasAccess: false,
        redirectPath: redirectTo,
        reason: 'Authentication required'
      }
    }

    // Kiểm tra role
    if (roles.length > 0 && !roles.includes(authStore.userRole)) {
      return {
        hasAccess: false,
        redirectPath: fallbackPath,
        reason: 'Insufficient role'
      }
    }

    // Kiểm tra permissions
    if (permissions.length > 0 && !authStore.canAny(permissions)) {
      return {
        hasAccess: false,
        redirectPath: fallbackPath,
        reason: 'Insufficient permissions'
      }
    }

    return {
      hasAccess: true
    }
  }

  const hasRole = (role: string): boolean => {
    return authStore.userRole === role
  }

  const hasPermission = (permission: string): boolean => {
    return authStore.can(permission)
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(authStore.userRole)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return authStore.canAny(permissions)
  }

  return {
    guardRoute,
    checkAccess,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission
  }
}
