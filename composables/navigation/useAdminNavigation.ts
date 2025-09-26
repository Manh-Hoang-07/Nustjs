import { ref, computed, type Ref, type ComputedRef } from 'vue'

// ===== TYPES =====

interface MenuItem {
  name: string
  path?: string
  icon: string
  status: 'active' | 'inactive'
  children?: MenuItem[]
}

interface AdminNavigationResult {
  menuItems: ComputedRef<MenuItem[]>
  currentPath: Ref<string>
}

// ===== COMPOSABLE =====

export function useAdminNavigation(): AdminNavigationResult {
  const currentPath: Ref<string> = ref('')
  
  // Menu items - đơn giản hóa, không cần lazy loading
  const menuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '📊',
      status: 'active'
    },
    {
      name: 'Quản lý chung',
      icon: '⚙️',
      status: 'active',
      children: [
        {
          name: 'Tài khoản',
          path: '/admin/users',
          icon: '👤',
          status: 'active'
        },
        {
          name: 'Quyền',
          path: '/admin/permissions',
          icon: '🔑',
          status: 'active'
        },
        {
          name: 'Vai trò',
          path: '/admin/roles',
          icon: '👑',
          status: 'active'
        }
      ]
    },
    {
      name: 'Tin tức',
      icon: '📰',
      status: 'active',
      children: [
        {
          name: 'Danh sách bài viết',
          path: '/admin/posts',
          icon: '📄',
          status: 'active'
        },
        {
          name: 'Danh mục bài viết',
          path: '/admin/post-categories',
          icon: '📁',
          status: 'active'
        },
        {
          name: 'Thẻ bài viết',
          path: '/admin/post-tags',
          icon: '🏷️',
          status: 'active'
        }
      ]
    },
    {
      name: 'Liên hệ',
      path: '/admin/contacts',
      icon: '📞',
      status: 'active'
    }
  ])

  // Hàm filter menu items theo status (trả về mảng đã lọc và giữ lại children hợp lệ)
  const filterMenuItemsByStatus = (items: MenuItem[]): MenuItem[] => {
    return (items || [])
      .filter(item => item && item.status === 'active')
      .map(item => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          const filteredChildren = filterMenuItemsByStatus(item.children)
          if (filteredChildren.length === 0) return null
          return { ...item, children: filteredChildren }
        }
        return item
      })
      .filter((item): item is MenuItem => item !== null)
  }

  // Menu items đã được filter theo status
  const filteredMenuItems: ComputedRef<MenuItem[]> = computed(() => filterMenuItemsByStatus(menuItems.value))

  return {
    menuItems: filteredMenuItems,
    currentPath
  }
}
