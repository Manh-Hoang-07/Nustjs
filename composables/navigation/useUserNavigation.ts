import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem, UserNavigationResult, MenuType } from './types'

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
      icon: '🏠',
      status: 'active'
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


  // Menu items đã được filter - đơn giản chỉ filter theo status
  const filteredMenuItems: ComputedRef<MenuItem[]> = computed(() => {
    return menuItems.value.filter(item => item.status === 'active')
  })

  // Hàm để lấy menu items theo loại
  const getMenuItemsByType = (type: MenuType): MenuItem[] => {
    switch (type) {
      case 'user':
        return userMenuItems.value.filter(item => item.status === 'active')
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

  return {
    menuItems: filteredMenuItems,
    userMenuItems,
    currentPath,
    getMenuItemsByType,
    isActiveMenuItem
  }
}
