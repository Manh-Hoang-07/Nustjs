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
      name: 'Khai báo chung',
      icon: '📋',
      status: 'active',
      children: [
        {
          name: 'Danh mục',
          path: '/admin/categories',
          icon: '📁',
          status: 'active'
        },
        {
          name: 'Thương hiệu',
          path: '/admin/brands',
          icon: '🏷️',
          status: 'active'
        },
        {
          name: 'Thuộc tính',
          path: '/admin/attributes',
          icon: '⚙️',
          status: 'active'
        },
        {
          name: 'Giá trị thuộc tính',
          path: '/admin/attribute-values',
          icon: '🔧',
          status: 'active'
        }
      ]
    },
    {
      name: 'Sản phẩm',
      path: '/admin/products',
      icon: '📦',
      status: 'active'
    },
    {
      name: 'Đơn hàng',
      path: '/admin/orders',
      icon: '📋',
      status: 'active'
    },
    {
      name: 'Quản lý Kho',
      icon: '🏪',
      status: 'active',
      children: [
        {
          name: 'Kho hàng',
          path: '/admin/warehouses',
          icon: '🏪',
          status: 'active'
        },
        {
          name: 'Quản lý Tồn kho',
          path: '/admin/inventory',
          icon: '📦',
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
      name: 'Vận chuyển',
      icon: '🚚',
      status: 'active',
      children: [
        {
          name: 'Tích hợp api',
          path: '/admin/shipping/api',
          icon: '🔌',
          status: 'active'
        },
        {
          name: 'Dịch vụ vận chuyển',
          path: '/admin/shipping/services',
          icon: '🚛',
          status: 'active'
        },
        {
          name: 'Zone Mapping',
          path: '/admin/shipping/zones',
          icon: '🗺️',
          status: 'active'
        },
        {
          name: 'Quy tắc giá',
          path: '/admin/shipping/pricing',
          icon: '💰',
          status: 'active'
        },
        {
          name: 'Khuyến mãi',
          path: '/admin/shipping/promotions',
          icon: '🎉',
          status: 'active'
        },
        {
          name: 'Giao hàng',
          path: '/admin/shipping/delivery',
          icon: '📮',
          status: 'active'
        },
        {
          name: 'Nâng cao',
          path: '/admin/shipping/advanced',
          icon: '⚡',
          status: 'active'
        }
      ]
    },
    {
      name: 'Liên hệ',
      path: '/admin/contacts',
      icon: '📞',
      status: 'active'
    },
    {
      name: 'Báo cáo',
      path: '/admin/reports',
      icon: '📈',
      status: 'active'
    },
    {
      name: 'Cấu hình hệ thống',
      icon: '⚙️',
      status: 'inactive',
      children: [
        {
          name: 'Cài đặt chung',
          path: '/admin/system-configs/general',
          icon: '🌐',
          status: 'active'
        },
        {
          name: 'Cài đặt email',
          path: '/admin/system-configs/email',
          icon: '📧',
          status: 'active'
        },
        {
          name: 'Cài đặt bảo mật',
          path: '/admin/system-configs/security',
          icon: '🔒',
          status: 'active'
        },
        {
          name: 'Tất cả cấu hình',
          path: '/admin/system-configs',
          icon: '📋',
          status: 'active'
        }
      ]
    },
    {
      name: 'Cấu hình hệ thống',
      icon: '🔧',
      status: 'active',
      children: [
        {
          name: 'Cài đặt chung',
          path: '/admin/system-configs-v2/general',
          icon: '🌐',
          status: 'active'
        },
        {
          name: 'Cài đặt email',
          path: '/admin/system-configs-v2/email',
          icon: '📧',
          status: 'active'
        },
        {
          name: 'Cấu hình theo Key',
          path: '/admin/system-configs-v2/key',
          icon: '🔑',
          status: 'active'
        }
      ]
    }
  ])

  // Hàm filter menu items theo status
  const filterMenuItemsByStatus = (items) => {
    return items.filter(item => {
      if (item.status !== 'active') return false
      
      if (item.children) {
        const filteredChildren = filterMenuItemsByStatus(item.children)
        if (filteredChildren.length === 0) return false
        return {
          ...item,
          children: filteredChildren
        }
      }
      return true
    })
  }

  // Menu items đã được filter theo status
  const filteredMenuItems = computed(() => filterMenuItemsByStatus(menuItems.value))

  return {
    menuItems: filteredMenuItems,
    currentPath
  }
} 