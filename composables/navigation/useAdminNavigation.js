import { ref, computed } from 'vue'

export function useAdminNavigation() {
  const currentPath = ref('')
  
  // Menu items - đơn giản hóa, không cần lazy loading
  const menuItems = computed(() => [
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
  const filterMenuItemsByStatus = (items) => {
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
      .filter(Boolean)
  }

  // Menu items đã được filter theo status
  const filteredMenuItems = computed(() => filterMenuItemsByStatus(menuItems.value))

  return {
    menuItems: filteredMenuItems,
    currentPath
  }
} 