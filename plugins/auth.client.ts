// plugins/auth.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Chờ cho tới khi app đã mount xong mới gọi store
    nuxtApp.hooks.hook('app:mounted', async () => {
      try {
        const authStore = useAuthStore()
        await authStore.checkAuth()
      } catch (error) {
        console.error('Auth init failed:', error)
      }
    })
  }
})
