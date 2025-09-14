import { computed } from 'vue'
import { useSystemConfigStore } from '@/stores/systemConfig'

/**
 * Composable để sử dụng thông tin cấu hình hệ thống
 * @returns {Object} - Các computed values và methods để sử dụng config
 */
export function useSystemConfigInfo() {
  const systemConfigStore = useSystemConfigStore()

  // Computed values cho các thông tin thường dùng
  const siteInfo = computed(() => ({
    name: systemConfigStore.siteName,
    email: systemConfigStore.siteEmail,
    phone: systemConfigStore.sitePhone,
    address: systemConfigStore.siteAddress,
    description: systemConfigStore.siteDescription
  }))

  const contactInfo = computed(() => systemConfigStore.contactInfo)
  const socialLinks = computed(() => systemConfigStore.socialLinks)
  const isConfigLoaded = computed(() => systemConfigStore.isLoaded)
  const isConfigLoading = computed(() => systemConfigStore.isLoading)

  // Methods
  const getConfigValue = (key, defaultValue = '') => {
    return systemConfigStore.getConfigValue(key, defaultValue)
  }

  const refreshConfig = async () => {
    return await systemConfigStore.refreshConfig()
  }

  const loadConfig = async (force = false) => {
    return await systemConfigStore.loadSystemConfig(force)
  }

  return {
    // Computed values
    siteInfo,
    contactInfo,
    socialLinks,
    isConfigLoaded,
    isConfigLoading,
    
    // Methods
    getConfigValue,
    refreshConfig,
    loadConfig
  }
}
