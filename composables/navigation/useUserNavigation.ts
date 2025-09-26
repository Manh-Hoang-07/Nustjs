import { ref, computed, type Ref, type ComputedRef } from 'vue'

// ===== TYPES =====

interface MenuItem {
  name: string
  path?: string
  icon: string
  status: 'active' | 'inactive'
  children?: MenuItem[]
}

type MenuType = 'user' | 'cart' | 'search' | 'support' | 'default'

interface UserNavigationResult {
  menuItems: ComputedRef<MenuItem[]>
  userMenuItems: ComputedRef<MenuItem[]>
  cartMenuItems: ComputedRef<MenuItem[]>
  searchMenuItems: ComputedRef<MenuItem[]>
  supportMenuItems: ComputedRef<MenuItem[]>
  currentPath: Ref<string>
  getMenuItemsByType: (type: MenuType) => MenuItem[]
  isActiveMenuItem: (item: MenuItem) => boolean
  getBreadcrumb: () => MenuItem[]
  searchInMenuItems: (query: string) => MenuItem[]
}

// ===== COMPOSABLE =====

export function useUserNavigation(): UserNavigationResult {
  const currentPath: Ref<string> = ref('')
  
  // Menu items cho người dùng
  const menuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Trang chủ',
      path: '/home',
      icon: '🏠',
      status: 'active'
    },
    {
      name: 'Sản phẩm',
      icon: '🛍️',
      status: 'active',
      children: [
        {
          name: 'Tất cả sản phẩm',
          path: '/home/products',
          icon: '📦',
          status: 'active'
        },
        {
          name: 'Sản phẩm mới',
          path: '/home/products?filter=new',
          icon: '✨',
          status: 'active'
        },
        {
          name: 'Sản phẩm bán chạy',
          path: '/home/products?filter=popular',
          icon: '🔥',
          status: 'active'
        },
        {
          name: 'Sản phẩm giảm giá',
          path: '/home/products?filter=sale',
          icon: '💰',
          status: 'active'
        }
      ]
    },
    {
      name: 'Danh mục',
      icon: '📂',
      status: 'active',
      children: [
        {
          name: 'Điện tử',
          path: '/home/categories/electronics',
          icon: '📱',
          status: 'active'
        },
        {
          name: 'Thời trang',
          path: '/home/categories/fashion',
          icon: '👗',
          status: 'active'
        },
        {
          name: 'Nhà cửa',
          path: '/home/categories/home',
          icon: '🏠',
          status: 'active'
        },
        {
          name: 'Sức khỏe',
          path: '/home/categories/health',
          icon: '💊',
          status: 'active'
        },
        {
          name: 'Thể thao',
          path: '/home/categories/sports',
          icon: '⚽',
          status: 'active'
        }
      ]
    },
    {
      name: 'Tin tức',
      path: '/home/posts',
      icon: '📰',
      status: 'active'
    },
    {
      name: 'Giới thiệu',
      path: '/home/about',
      icon: 'ℹ️',
      status: 'active'
    },
    {
      name: 'Liên hệ',
      path: '/home/contact',
      icon: '📞',
      status: 'active'
    }
  ])

  // Menu items cho người dùng đã đăng nhập
  const userMenuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Tài khoản của tôi',
      path: '/user/profile',
      icon: '👤',
      status: 'active'
    },
    {
      name: 'Đơn hàng',
      path: '/user/orders',
      icon: '📋',
      status: 'active'
    },
    {
      name: 'Yêu thích',
      path: '/user/wishlist',
      icon: '❤️',
      status: 'active'
    },
    {
      name: 'Đánh giá',
      path: '/user/reviews',
      icon: '⭐',
      status: 'active'
    },
    {
      name: 'Địa chỉ',
      path: '/user/addresses',
      icon: '📍',
      status: 'active'
    },
    {
      name: 'Cài đặt',
      path: '/user/settings',
      icon: '⚙️',
      status: 'active'
    }
  ])

  // Menu items cho giỏ hàng
  const cartMenuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Xem giỏ hàng',
      path: '/cart',
      icon: '🛒',
      status: 'active'
    },
    {
      name: 'Thanh toán',
      path: '/checkout',
      icon: '💳',
      status: 'active'
    }
  ])

  // Menu items cho tìm kiếm
  const searchMenuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Tìm kiếm nâng cao',
      path: '/search/advanced',
      icon: '🔍',
      status: 'active'
    },
    {
      name: 'Lịch sử tìm kiếm',
      path: '/search/history',
      icon: '📜',
      status: 'active'
    },
    {
      name: 'Sản phẩm đã xem',
      path: '/user/recently-viewed',
      icon: '👁️',
      status: 'active'
    }
  ])

  // Menu items cho hỗ trợ
  const supportMenuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Hướng dẫn mua hàng',
      path: '/help/shopping-guide',
      icon: '🛒',
      status: 'active'
    },
    {
      name: 'Chính sách đổi trả',
      path: '/help/return-policy',
      icon: '🔄',
      status: 'active'
    },
    {
      name: 'Vận chuyển',
      path: '/help/shipping',
      icon: '🚚',
      status: 'active'
    },
    {
      name: 'Thanh toán',
      path: '/help/payment',
      icon: '💳',
      status: 'active'
    },
    {
      name: 'Bảo hành',
      path: '/help/warranty',
      icon: '🛡️',
      status: 'active'
    },
    {
      name: 'FAQ',
      path: '/help/faq',
      icon: '❓',
      status: 'active'
    }
  ])

  // Hàm filter menu items theo status
  const filterMenuItemsByStatus = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      if (item.status !== 'active') return false
      
      if (item.children) {
        const filteredChildren = filterMenuItemsByStatus(item.children)
        if (filteredChildren.length === 0) return false
        return {
          ...item,
          children: filteredChildren
        } as MenuItem
      }
      return true
    })
  }

  // Menu items đã được filter theo status
  const filteredMenuItems: ComputedRef<MenuItem[]> = computed(() => filterMenuItemsByStatus(menuItems.value))

  // Hàm để lấy menu items theo loại
  const getMenuItemsByType = (type: MenuType): MenuItem[] => {
    switch (type) {
      case 'user':
        return filterMenuItemsByStatus(userMenuItems.value)
      case 'cart':
        return filterMenuItemsByStatus(cartMenuItems.value)
      case 'search':
        return filterMenuItemsByStatus(searchMenuItems.value)
      case 'support':
        return filterMenuItemsByStatus(supportMenuItems.value)
      default:
        return filteredMenuItems.value
    }
  }

  // Hàm để kiểm tra menu item có active không
  const isActiveMenuItem = (item: MenuItem): boolean => {
    if (!currentPath.value) return false
    return currentPath.value === item.path || 
           (item.children ? item.children.some(child => child.path === currentPath.value) : false)
  }

  // Hàm để lấy breadcrumb
  const getBreadcrumb = (): MenuItem[] => {
    const breadcrumb: MenuItem[] = []
    const findPath = (items: MenuItem[], targetPath: string): boolean => {
      for (const item of items) {
        if (item.path === targetPath) {
          breadcrumb.push(item)
          return true
        }
        if (item.children) {
          breadcrumb.push(item)
          if (findPath(item.children, targetPath)) {
            return true
          }
          breadcrumb.pop()
        }
      }
      return false
    }
    
    findPath(menuItems.value, currentPath.value)
    return breadcrumb
  }

  // Hàm để tìm kiếm menu items
  const searchInMenuItems = (query: string): MenuItem[] => {
    if (!query) return []
    
    const results: MenuItem[] = []
    const searchInItems = (items: MenuItem[]): void => {
      for (const item of items) {
        if (item.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(item)
        }
        if (item.children) {
          searchInItems(item.children)
        }
      }
    }
    
    searchInItems(menuItems.value)
    return results
  }

  return {
    menuItems: filteredMenuItems,
    userMenuItems,
    cartMenuItems,
    searchMenuItems,
    supportMenuItems,
    currentPath,
    getMenuItemsByType,
    isActiveMenuItem,
    getBreadcrumb,
    searchInMenuItems
  }
}
