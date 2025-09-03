import { useAuthStore } from '../stores/auth.js';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Chỉ chạy trên client để tránh hydration mismatch
  if (process.server) {
    return
  }

  const authStore = useAuthStore()
  
  // Kiểm tra auth nếu chưa được khởi tạo
  if (!authStore.isInitialized) {
    console.log('Auth store not initialized, calling checkAuth...')
    await authStore.checkAuth()
  }

  console.log('Auth middleware - current state:', {
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    user: authStore.user,
    userRole: authStore.userRole,
    route: to.path,
    requiresAuth: to.meta.requiresAuth,
    requiresAdmin: to.meta.requiresAdmin
  })

  // Tự động áp dụng middleware cho tất cả các route /admin/**
  if (to.path.startsWith('/admin')) {
    console.log('Admin route detected, checking permissions...')
    
    // Kiểm tra authentication
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, redirecting to login')
      return navigateTo('/auth/login')
    }
    
    // Kiểm tra quyền admin
    if (!authStore.isAdmin) {
      console.log('User not admin, redirecting to home')
      return navigateTo('/home')
    }
    
    console.log('Admin access granted')
    return
  }

  // Nếu route yêu cầu auth nhưng user chưa đăng nhập
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Route requires auth but user not authenticated, redirecting to login')
    return navigateTo('/login')
  }

  // Nếu route yêu cầu admin nhưng user không phải admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('Route requires admin but user not admin, redirecting to home')
    return navigateTo('/home')
  }

  // Nếu user đã đăng nhập và truy cập login/register, redirect về trang chủ
  if (authStore.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    if (authStore.isAdmin) {
      console.log('Admin user accessing login/register, redirecting to admin')
      return navigateTo('/admin')
    } else {
      console.log('User accessing login/register, redirecting to user')
      return navigateTo('/user')
    }
  }
}) 