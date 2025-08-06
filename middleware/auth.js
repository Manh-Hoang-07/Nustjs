import { useAuthStore } from '../stores/auth.js';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // Kiểm tra xem route có yêu cầu authentication không
  if (to.meta.requiresAuth) {
    // Đảm bảo thông tin user được load
    await authStore.checkAuth()
    
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
    
    // Kiểm tra xem route có yêu cầu admin không
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return navigateTo('/')
    }
  }
  
  // Kiểm tra xem route có yêu cầu guest (chưa đăng nhập) không
  if (to.meta.requiresGuest) {
    await authStore.checkAuth()
    
    if (authStore.isAuthenticated) {
      // Redirect dựa trên role
      if (authStore.isAdmin) {
        return navigateTo('/admin')
      } else {
        return navigateTo('/user')
      }
    }
  }
}) 