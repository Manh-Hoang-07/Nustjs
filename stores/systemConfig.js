import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

export const useSystemConfigStore = defineStore('systemConfig', () => {
  const { apiClient } = useApiClient()
  
  // State
  const config = ref({})
  const isLoading = ref(false)
  const isLoaded = ref(false)
  const lastFetchTime = ref(0)
  const cacheDuration = 600000 // Cache trong 10 phút
  const loadingPromise = ref(null) // Promise để tránh gọi API nhiều lần

  // Khởi tạo từ localStorage nếu có
  const initFromStorage = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('system_config_cache')
        if (stored) {
          const { config: storedConfig, lastFetchTime: storedTime } = JSON.parse(stored)
          const now = Date.now()
          
          // Kiểm tra cache còn hạn không
          if (now - storedTime < cacheDuration) {
            config.value = storedConfig
            isLoaded.value = true
            lastFetchTime.value = storedTime
            return true
          } else {
            // Cache hết hạn, xóa khỏi localStorage
            localStorage.removeItem('system_config_cache')
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        localStorage.removeItem('system_config_cache')
      }
    }
    return false
  }

  // Lưu vào localStorage
  const saveToStorage = (configData) => {
    if (process.client) {
      try {
        localStorage.setItem('system_config_cache', JSON.stringify({
          config: configData,
          lastFetchTime: Date.now()
        }))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  // Khởi tạo từ storage khi store được tạo
  initFromStorage()

  // Getters - Các thông tin cấu hình thường dùng
  const siteName = computed(() => config.value.site_name || 'Website')
  const siteEmail = computed(() => config.value.site_email || '')
  const sitePhone = computed(() => config.value.site_phone || '')
  const siteAddress = computed(() => config.value.site_address || '')
  const siteDescription = computed(() => config.value.site_description || '')
  const socialLinks = computed(() => config.value.social_links || {})
  const contactInfo = computed(() => ({
    email: siteEmail.value,
    phone: sitePhone.value,
    address: siteAddress.value
  }))

  // Actions
  const loadSystemConfig = async (force = false) => {
    // Kiểm tra cache
    if (!force && isLoaded.value && (Date.now() - lastFetchTime.value) < cacheDuration) {
      return config.value
    }

    // Nếu đang có request đang chạy, chờ nó hoàn thành
    if (loadingPromise.value) {
      return await loadingPromise.value
    }

    // Tạo promise mới
    loadingPromise.value = (async () => {
      try {
        isLoading.value = true
        
        const response = await apiClient.get('/api/config-v2/general')
      
        if (response.data.success) {
          config.value = response.data.data || {}
          isLoaded.value = true
          lastFetchTime.value = Date.now()
          
          // Lưu vào localStorage
          saveToStorage(config.value)
          
          // Cập nhật title và meta nếu có
          if (config.value.site_name) {
            document.title = config.value.site_name
          }
          
          return config.value
        } else {
          console.warn('Failed to load system config:', response.data.message)
          return {}
        }
      } catch (error) {
        console.error('Error loading system config:', error)
        
        // Fallback config nếu không load được
        config.value = {
          site_name: 'Website',
          site_email: '',
          site_phone: '',
          site_address: '',
          site_description: ''
        }
        isLoaded.value = true
        lastFetchTime.value = Date.now()
        
        return config.value
      } finally {
        isLoading.value = false
        loadingPromise.value = null // Reset promise
      }
    })()

    return await loadingPromise.value
  }

  const refreshConfig = async () => {
    return await loadSystemConfig(true)
  }

  const getConfigValue = (key, defaultValue = '') => {
    return config.value[key] || defaultValue
  }

  const updateConfig = (newConfig) => {
    config.value = { ...config.value, ...newConfig }
  }

  const clearCache = () => {
    config.value = {}
    isLoaded.value = false
    lastFetchTime.value = 0
    loadingPromise.value = null
    
    if (process.client) {
      localStorage.removeItem('system_config_cache')
    }
  }

  return {
    // State
    config,
    isLoading,
    isLoaded,
    lastFetchTime,
    cacheDuration,
    
    // Getters
    siteName,
    siteEmail,
    sitePhone,
    siteAddress,
    siteDescription,
    socialLinks,
    contactInfo,
    
    // Actions
    loadSystemConfig,
    refreshConfig,
    getConfigValue,
    updateConfig,
    clearCache
  }
})
