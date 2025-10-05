import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem, AdminNavigationResult } from './navigation.types'
import { filterByStatus, sortByOrder } from './navigation.utils'

// ===== COMPOSABLE =====

export function useAdminNavigation(): AdminNavigationResult {
  const route = useRoute()
  
  // Current path từ route
  const currentPath = computed(() => route.path)
  
  // Menu items đơn giản - luôn hiển thị
  const menuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Dashboard',
      path: '/admin',
      api: 'api/admin/dashboard',
      icon: '📊',
      status: 'active'
    },
    {
      name: 'Tài khoản',
      path: '/admin/users',
      api: 'api/admin/users',
      icon: '👤',
      status: 'active'
    },
    {
      name: 'Quyền',
      path: '/admin/permissions',
      api: 'api/admin/permissions',
      icon: '🔑',
      status: 'active'
    },
    {
      name: 'Vai trò',
      path: '/admin/roles',
      api: 'api/admin/roles',
      icon: '👑',
      status: 'active'
    },
    {
      name: 'Tin tức',
      path: '/admin/posts',
      api: 'api/admin/posts',
      icon: '📰',
      status: 'active'
    },
    {
      name: 'Danh mục bài viết',
      path: '/admin/post-categories',
      api: 'api/admin/post-categories',
      icon: '📁',
      status: 'active'
    },
    {
      name: 'Thẻ bài viết',
      path: '/admin/post-tags',
      api: 'api/admin/post-tags',
      icon: '🏷️',
      status: 'active'
    },
    {
      name: 'Liên hệ',
      path: '/admin/contacts',
      api: 'api/admin/contacts',
      icon: '📞',
      status: 'active'
    }
  ])

  // Menu items đã được filter - đơn giản chỉ filter theo status
  const filteredMenuItems: ComputedRef<MenuItem[]> = computed(() => {
    return filterByStatus(menuItems.value, 'active')
  })

  // Hàm kiểm tra menu item có active không
  const isActiveMenuItem = (item: MenuItem): boolean => {
    if (!currentPath.value) return false
    return currentPath.value === item.path
  }

  return {
    menuItems: filteredMenuItems,
    currentPath,
    isActiveMenuItem
  }
}
