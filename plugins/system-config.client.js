// plugins/system-config.client.js
export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    // Chờ cho tới khi app đã mount xong mới gọi store
    nuxtApp.hooks.hook('app:mounted', async () => {
      try {
        const systemConfigStore = useSystemConfigStore()
        
        // Chỉ gọi API nếu chưa có cache hoặc cache đã hết hạn
        if (!systemConfigStore.isLoaded || (Date.now() - systemConfigStore.lastFetchTime) >= systemConfigStore.cacheDuration) {
          console.log('Cache expired or not loaded, fetching system config...')
          await systemConfigStore.loadSystemConfig()
        } else {
          console.log('Using existing system config cache')
        }
      } catch (error) {
        console.error('System config init failed:', error)
      }
    })
  }
})
