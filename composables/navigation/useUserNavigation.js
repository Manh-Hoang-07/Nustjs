import { ref, computed } from 'vue'

export function useUserNavigation() {
  const currentPath = ref('')
  
  // Menu items cho người dùng
  const menuItems = computed(() => [
    {
      name: 'Trang chủ',
      path: '/home',
      icon: '🏠'
    },
    {
      name: 'Sản phẩm',
      icon: '🛍️',
      children: [
        {
          name: 'Tất cả sản phẩm',
          path: '/home/products',
          icon: '📦'
        },
        {
          name: 'Sản phẩm mới',
          path: '/home/products?filter=new',
          icon: '✨'
        },
        {
          name: 'Sản phẩm bán chạy',
          path: '/home/products?filter=popular',
          icon: '🔥'
        },
        {
          name: 'Sản phẩm giảm giá',
          path: '/home/products?filter=sale',
          icon: '💰'
        }
      ]
    },
    {
      name: 'Danh mục',
      icon: '📂',
      children: [
        {
          name: 'Điện tử',
          path: '/home/categories/electronics',
          icon: '📱'
        },
        {
          name: 'Thời trang',
          path: '/home/categories/fashion',
          icon: '👗'
        },
        {
          name: 'Nhà cửa',
          path: '/home/categories/home',
          icon: '🏠'
        },
        {
          name: 'Sức khỏe',
          path: '/home/categories/health',
          icon: '💊'
        },
        {
          name: 'Thể thao',
          path: '/home/categories/sports',
          icon: '⚽'
        }
      ]
    },
    {
      name: 'Tin tức',
      path: '/home/posts',
      icon: '📰'
    },
    {
      name: 'Giới thiệu',
      path: '/home/about',
      icon: 'ℹ️'
    },
    {
      name: 'Liên hệ',
      path: '/home/contact',
      icon: '📞'
    }
  ])

  // Menu items cho người dùng đã đăng nhập
  const userMenuItems = computed(() => [
    {
      name: 'Tài khoản của tôi',
      path: '/user/profile',
      icon: '👤'
    },
    {
      name: 'Đơn hàng',
      path: '/user/orders',
      icon: '📋'
    },
    {
      name: 'Yêu thích',
      path: '/user/wishlist',
      icon: '❤️'
    },
    {
      name: 'Đánh giá',
      path: '/user/reviews',
      icon: '⭐'
    },
    {
      name: 'Địa chỉ',
      path: '/user/addresses',
      icon: '📍'
    },
    {
      name: 'Cài đặt',
      path: '/user/settings',
      icon: '⚙️'
    }
  ])

  // Menu items cho giỏ hàng
  const cartMenuItems = computed(() => [
    {
      name: 'Xem giỏ hàng',
      path: '/cart',
      icon: '🛒'
    },
    {
      name: 'Thanh toán',
      path: '/checkout',
      icon: '💳'
    }
  ])

  // Menu items cho tìm kiếm
  const searchMenuItems = computed(() => [
    {
      name: 'Tìm kiếm nâng cao',
      path: '/search/advanced',
      icon: '🔍'
    },
    {
      name: 'Lịch sử tìm kiếm',
      path: '/search/history',
      icon: '📜'
    },
    {
      name: 'Sản phẩm đã xem',
      path: '/user/recently-viewed',
      icon: '👁️'
    }
  ])

  // Menu items cho hỗ trợ
  const supportMenuItems = computed(() => [
    {
      name: 'Hướng dẫn mua hàng',
      path: '/help/shopping-guide',
      icon: '🛒'
    },
    {
      name: 'Chính sách đổi trả',
      path: '/help/return-policy',
      icon: '🔄'
    },
    {
      name: 'Vận chuyển',
      path: '/help/shipping',
      icon: '🚚'
    },
    {
      name: 'Thanh toán',
      path: '/help/payment',
      icon: '💳'
    },
    {
      name: 'Bảo hành',
      path: '/help/warranty',
      icon: '🛡️'
    },
    {
      name: 'FAQ',
      path: '/help/faq',
      icon: '❓'
    }
  ])

  // Menu items đã được filter
  const filteredMenuItems = computed(() => menuItems.value)

  // Hàm để lấy menu items theo loại
  const getMenuItemsByType = (type) => {
    switch (type) {
      case 'user':
        return userMenuItems.value
      case 'cart':
        return cartMenuItems.value
      case 'search':
        return searchMenuItems.value
      case 'support':
        return supportMenuItems.value
      default:
        return filteredMenuItems.value
    }
  }

  // Hàm để kiểm tra menu item có active không
  const isActiveMenuItem = (item) => {
    if (!currentPath.value) return false
    return currentPath.value === item.path || 
           (item.children && item.children.some(child => child.path === currentPath.value))
  }

  // Hàm để lấy breadcrumb
  const getBreadcrumb = () => {
    const breadcrumb = []
    const findPath = (items, targetPath) => {
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
  const searchInMenuItems = (query) => {
    if (!query) return []
    
    const results = []
    const searchInItems = (items) => {
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
