import { ref, computed } from 'vue'

export function useAdminNavigation() {
  const currentPath = ref('')
  
  // Menu items - đơn giản hóa, không cần lazy loading
  const menuItems = computed(() => [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '📊'
    },
    {
      name: 'Quản lý chung',
      icon: '⚙️',
      children: [
        {
          name: 'Tài khoản',
          path: '/admin/users',
          icon: '👤'
        },
        {
          name: 'Quyền',
          path: '/admin/permissions',
          icon: '🔑'
        },
        {
          name: 'Vai trò',
          path: '/admin/roles',
          icon: '👑'
        }
      ]
    },
    {
      name: 'Khai báo chung',
      icon: '📋',
      children: [
        {
          name: 'Danh mục',
          path: '/admin/categories',
          icon: '📁'
        },
        {
          name: 'Thương hiệu',
          path: '/admin/brands',
          icon: '🏷️'
        },
        {
          name: 'Thuộc tính',
          path: '/admin/attributes',
          icon: '⚙️'
        },
        {
          name: 'Giá trị thuộc tính',
          path: '/admin/attribute-values',
          icon: '🔧'
        }
      ]
    },
    {
      name: 'Sản phẩm',
      path: '/admin/products',
      icon: '📦'
    },
    {
      name: 'Đơn hàng',
      path: '/admin/orders',
      icon: '📋'
    },
    {
      name: 'Kho hàng',
      path: '/admin/warehouses',
      icon: '🏪'
    },
    {
      name: 'Quản lý Tồn kho',
      path: '/admin/inventory',
      icon: '📦'
    },
    {
      name: 'Tin tức',
      icon: '📰',
      children: [
        {
          name: 'Danh sách bài viết',
          path: '/admin/posts',
          icon: '📄'
        },
        {
          name: 'Danh mục bài viết',
          path: '/admin/post-categories',
          icon: '📁'
        },
        {
          name: 'Thẻ bài viết',
          path: '/admin/post-tags',
          icon: '🏷️'
        }
      ]
    },
    {
      name: 'Vận chuyển',
      icon: '🚚',
      children: [
        {
          name: 'Tích hợp api',
          path: '/admin/shipping/api',
          icon: '🔌'
        },
        {
          name: 'Dịch vụ vận chuyển',
          path: '/admin/shipping/services',
          icon: '🚛'
        },
        {
          name: 'Zone Mapping',
          path: '/admin/shipping/zones',
          icon: '🗺️'
        },
        {
          name: 'Quy tắc giá',
          path: '/admin/shipping/pricing',
          icon: '💰'
        },
        {
          name: 'Khuyến mãi',
          path: '/admin/shipping/promotions',
          icon: '🎉'
        },
        {
          name: 'Giao hàng',
          path: '/admin/shipping/delivery',
          icon: '📮'
        },
        {
          name: 'Nâng cao',
          path: '/admin/shipping/advanced',
          icon: '⚡'
        }
      ]
    },
    {
      name: 'Báo cáo',
      path: '/admin/reports',
      icon: '📈'
    },
    {
      name: 'Cài đặt',
      path: '/admin/settings',
      icon: '⚙️'
    }
  ])

  // Menu items đã được filter (luôn bao gồm tất cả)
  const filteredMenuItems = computed(() => menuItems.value)

  return {
    menuItems: filteredMenuItems,
    currentPath
  }
} 