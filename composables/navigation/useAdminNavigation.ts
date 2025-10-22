import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem, AdminNavigationResult } from './navigation.types'
import { filterByStatus, sortByOrder } from './navigation.utils'

// ===== COMPOSABLE =====

export function useAdminNavigation(): AdminNavigationResult {
  const route = useRoute()

  // Current path từ route
  const currentPath = computed(() => route.path)

  // Function để lấy icon cho từng nhóm
  const getGroupIcon = (groupName: string): string => {
    const iconMap: Record<string, string> = {
      'general': '⚙️',
      'email': '📧',
      'security': '🔒',
      'api': '🔌',
      'custom': '🎨'
    }
    return iconMap[groupName] || '⚙️'
  }

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
      name: 'Quản lý sản phẩm',
      path: '/admin/products',
      api: 'api/admin/products',
      icon: '📦',
      status: 'active',
      children: [
        {
          name: 'Sản phẩm',
          path: '/admin/products',
          api: 'api/admin/products',
          icon: '📦',
          status: 'active'
        },
        {
          name: 'Biến thể sản phẩm',
          path: '/admin/product-variants',
          api: 'api/admin/product-variants',
          icon: '🔀',
          status: 'active'
        },
        {
          name: 'Danh mục sản phẩm',
          path: '/admin/product-categories',
          api: 'api/admin/product-categories',
          icon: '🗂️',
          status: 'active'
        },
        {
          name: 'Thuộc tính sản phẩm',
          path: '/admin/product-attributes',
          api: 'api/admin/product-attributes',
          icon: '🧩',
          status: 'active'
        }
      ]
    },
    {
      name: 'Quản lý nội dung',
      path: '/admin/posts',
      api: 'api/admin/posts',
      icon: '📰',
      status: 'active',
      children: [
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
        }
      ]
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
    },
    // Menu cấu hình hệ thống với 10 menu con
    {
      name: 'Cấu hình hệ thống',
      path: '/admin/system-configs',
      api: 'api/admin/system-configs',
      icon: '⚙️',
      status: 'active',
      children: [
        {
          name: 'Tất cả cấu hình',
          path: '/admin/system-configs',
          api: 'api/admin/system-configs',
          icon: '📋',
          status: 'active'
        },
        // Menu con cho từng nhóm cấu hình (tĩnh)
        {
          name: 'Cài đặt chung',
          path: '/admin/system-configs/general',
          api: 'api/admin/system-configs/group?group=general',
          icon: '⚙️',
          status: 'active'
        },
        {
          name: 'Cấu hình Email',
          path: '/admin/system-configs/email',
          api: 'api/admin/system-configs/group?group=email',
          icon: '📧',
          status: 'active'
        },
        {
          name: 'Cài đặt bảo mật',
          path: '/admin/system-configs/security',
          api: 'api/admin/system-configs/group?group=security',
          icon: '🔒',
          status: 'active'
        },
        {
          name: 'Cài đặt API',
          path: '/admin/system-configs/api',
          api: 'api/admin/system-configs/group?group=api',
          icon: '🔌',
          status: 'active'
        },
        {
          name: 'Cài đặt tùy chỉnh',
          path: '/admin/system-configs/custom',
          api: 'api/admin/system-configs/group?group=custom',
          icon: '🎨',
          status: 'active'
        }
      ]
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
