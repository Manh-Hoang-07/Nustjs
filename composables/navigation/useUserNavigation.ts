import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem, UserNavigationResult, MenuType } from './navigation.types'
import { filterByStatus, isMenuItemActive } from './navigation.utils'

// ===== COMPOSABLE =====

export function useUserNavigation(): UserNavigationResult {
  const route = useRoute()

  // Current path từ route
  const currentPath = computed(() => route.path)

  // Menu items cho người dùng
  const menuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Trang chủ',
      path: '/home',
      api: 'api/home',
      icon: '🏠',
      status: 'active'
    },
    {
      name: 'Sản phẩm',
      path: '/home/products',
      api: 'api/products',
      icon: '📦',
      status: 'active',
      children: [
        {
          name: 'Tất cả sản phẩm',
          path: '/home/products',
          api: 'api/products',
          icon: '📦',
          status: 'active'
        },
        {
          name: 'Danh mục sản phẩm',
          path: '/home/categories',
          api: 'api/product-categories',
          icon: '🗂️',
          status: 'active'
        }
      ]
    },
    {
      name: 'Tin tức',
      path: '/home/posts',
      api: 'api/posts',
      icon: '📰',
      status: 'active',
      children: [
        {
          name: 'Tất cả tin tức',
          path: '/home/posts',
          api: 'api/posts',
          icon: '📰',
          status: 'active'
        },
        {
          name: 'Danh mục tin tức',
          path: '/home/posts/categories',
          api: 'api/post-categories',
          icon: '📁',
          status: 'active'
        },
        {
          name: 'Thẻ tin tức',
          path: '/home/posts/tags',
          api: 'api/post-tags',
          icon: '🏷️',
          status: 'active'
        }
      ]
    },
    {
      name: 'Giới thiệu',
      path: '/home/about',
      api: 'api/about',
      icon: 'ℹ️',
      status: 'active'
    },
    {
      name: 'Liên hệ',
      path: '/home/contact',
      api: 'api/contact',
      icon: '📞',
      status: 'active'
    }
  ])

  // Menu items cho người dùng đã đăng nhập
  const userMenuItems: ComputedRef<MenuItem[]> = computed(() => [
    {
      name: 'Tài khoản của tôi',
      path: '/user/profile',
      api: 'api/user/profile',
      icon: '👤',
      status: 'active'
    },
    {
      name: 'Đơn hàng',
      path: '/user/orders',
      api: 'api/user/orders',
      icon: '📋',
      status: 'active'
    },
    {
      name: 'Yêu thích',
      path: '/user/wishlist',
      api: 'api/user/wishlist',
      icon: '❤️',
      status: 'active'
    },
    {
      name: 'Đánh giá',
      path: '/user/reviews',
      api: 'api/user/reviews',
      icon: '⭐',
      status: 'active'
    },
    {
      name: 'Địa chỉ',
      path: '/user/addresses',
      api: 'api/user/addresses',
      icon: '📍',
      status: 'active'
    },
    {
      name: 'Cài đặt',
      path: '/user/settings',
      api: 'api/user/settings',
      icon: '⚙️',
      status: 'active'
    }
  ])


  // Menu items đã được filter - đơn giản chỉ filter theo status
  const filteredMenuItems: ComputedRef<MenuItem[]> = computed(() => {
    return filterByStatus(menuItems.value, 'active')
  })

  // Hàm để lấy menu items theo loại
  const getMenuItemsByType = (type: MenuType): MenuItem[] => {
    switch (type) {
      case 'user':
        return filterByStatus(userMenuItems.value, 'active')
      default:
        return filteredMenuItems.value
    }
  }

  // Hàm để kiểm tra menu item có active không
  const isActiveMenuItem = (item: MenuItem): boolean => {
    return isMenuItemActive(item, currentPath.value)
  }

  return {
    menuItems: filteredMenuItems,
    userMenuItems,
    currentPath,
    getMenuItemsByType,
    isActiveMenuItem
  }
}
