import { useGlobalSystemConfig } from '~/composables/system-config'

export default defineNuxtPlugin(async () => {
  // Chỉ chạy trên client side
  if (process.client) {
    try {
      // Tự động load system config khi app khởi động
      // getData sẽ tự động kiểm tra cache trước khi fetch API
      const { getData } = useGlobalSystemConfig()
      await getData()
      
      console.log('✅ System config plugin initialized')
    } catch (error) {
      console.error('❌ Failed to load system config:', error)
    }
  }
})
