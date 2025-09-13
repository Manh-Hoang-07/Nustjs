import { useAuthStore } from '../stores/auth.js';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Chỉ chạy trên client để tránh hydration mismatch
  if (process.server) {
    return
  }

  const authStore = useAuthStore()
  
  // Chỉ kiểm tra auth nếu chưa được khởi tạo và có token
  if (!authStore.isInitialized) {
    const token = authStore.getTokenFromCookie()
    if (token) {
      await authStore.checkAuth()
    } else {
      authStore.isInitialized.value = true
    }
  }

  // Tự động áp dụng middleware cho tất cả các route /admin/**
  if (to.path.startsWith('/admin')) {
    // Kiểm tra authentication
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login')
    }
    
    // Kiểm tra quyền admin
    if (!authStore.isAdmin) {
      return navigateTo('/home')
    }
    return
  }

  // Nếu route yêu cầu auth nhưng user chưa đăng nhập
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Nếu route yêu cầu admin nhưng user không phải admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return navigateTo('/home')
  }

  // Nếu user đã đăng nhập và truy cập login/register, redirect về trang chủ
  if (authStore.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    if (authStore.isAdmin) {
      return navigateTo('/admin')
    } else {
      return navigateTo('/user')
    }
  }
}) 