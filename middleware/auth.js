import { useAuthStore } from '../stores/auth.js';

// Hàm helper để lấy token từ cookie
function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      const token = decodeURIComponent(value);
      return token;
    }
  }
  return null;
}

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Kiểm tra xem route có yêu cầu authentication không
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Kiểm tra xem route có yêu cầu admin không
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return navigateTo('/')
  }
  
  // Kiểm tra xem route có yêu cầu guest (chưa đăng nhập) không
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return navigateTo('/')
  }
}) 