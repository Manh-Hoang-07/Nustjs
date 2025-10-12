export default defineNuxtRouteMiddleware(async (to) => {
  // Chỉ chạy trên client side
  if (process.client) {
    try {
      const { systemInfo, loading, error } = useGlobalSystemConfig()
      
      // Nếu đang loading, đợi một chút
      if (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Nếu có lỗi khi load system config, log warning nhưng không block navigation
      if (error.value) {
        console.warn('System config load failed:', error.value)
      }
      
      // Log system info để debug
      if (systemInfo.value.name) {
        console.log(`🌐 Navigating to: ${to.path} | System: ${systemInfo.value.name} v${systemInfo.value.version}`)
      }
      
    } catch (err) {
      console.warn('System config middleware error:', err)
      // Không throw error để không block navigation
    }
  }
})

