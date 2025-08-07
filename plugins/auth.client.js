export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  
  // Chỉ chạy trên client
  if (process.client) {
    // Khởi tạo auth state khi app mount
    await authStore.checkAuth()
  }
}) 