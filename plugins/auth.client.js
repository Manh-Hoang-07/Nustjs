export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Kiểm tra authentication ngay khi app khởi động
  await authStore.checkAuth()
}) 