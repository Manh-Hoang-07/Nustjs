import { ref, computed, readonly, type Ref, type ComputedRef } from 'vue'
import { useGlobalApiClient } from '../api/useApiClient'
import { publicEndpoints } from '../../api/endpoints'
import type { 
  SystemConfigGeneral, 
  SystemConfigCache, 
  SystemConfigOptions, 
  SystemConfigResult 
} from './types'

// ===== CACHE MANAGEMENT =====

// Cache TTL: 10 phút
const CACHE_TTL = 10 * 60 * 1000

// Cache key cho localStorage
const CACHE_KEY = 'system-config-cache'

// Helper function để kiểm tra cache có hết hạn không
const isCacheExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_TTL
}

// Helper function để lấy cache từ localStorage
const getCacheFromStorage = (): SystemConfigCache | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const parsedCache: SystemConfigCache = JSON.parse(cached)
    
    // Kiểm tra cache có hết hạn không
    if (isCacheExpired(parsedCache.timestamp)) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    
    return parsedCache
  } catch (error) {
    console.warn('Error reading cache from localStorage:', error)
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

// Helper function để lưu cache vào localStorage
const saveCacheToStorage = (cache: SystemConfigCache): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn('Error saving cache to localStorage:', error)
  }
}

// Helper function để xóa cache khỏi localStorage
const clearCacheFromStorage = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.warn('Error clearing cache from localStorage:', error)
  }
}

// Global cache store để chia sẻ dữ liệu giữa các component
const globalCache = ref<SystemConfigCache | null>(getCacheFromStorage())

// ===== COMPOSABLE =====

/**
 * Composable để lấy cấu hình hệ thống với cache 10 phút
 * @param group - Nhóm cấu hình (ví dụ: 'general')
 * @param options - Tùy chọn cache
 */
export function useSystemConfig(
  group: string = 'general',
  options: SystemConfigOptions = {}
): SystemConfigResult {
  const { forceRefresh = false, enableCache = true } = options
  
  const { apiClient } = useGlobalApiClient()
  
  // Reactive state
  const data = ref<SystemConfigGeneral | null>(null)
  const loading = ref(false)
  const error = ref<any>(null)
  
  // Computed để kiểm tra cache có hợp lệ không
  const isCacheValid = computed(() => {
    if (!enableCache || !globalCache.value) return false
    return !isCacheExpired(globalCache.value.timestamp)
  })
  
  // Function để fetch data từ API
  const fetchData = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      
      const endpoint = publicEndpoints.systemConfigs.getByGroup(group)
      const response = await apiClient.get<SystemConfigGeneral>(endpoint)
      
      // Transform data từ array thành object
      const configData = transformConfigData(response.data)
      
      // Update reactive data
      data.value = configData
      
      // Update global cache và lưu vào localStorage
      if (enableCache) {
        const cacheData: SystemConfigCache = {
          data: configData,
          timestamp: Date.now(),
          ttl: CACHE_TTL
        }
        
        globalCache.value = cacheData
        saveCacheToStorage(cacheData)
        
        console.log('✅ System config cached for 10 minutes')
      }
      
    } catch (err) {
      error.value = err
      console.error('Error fetching system config:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Function để transform data từ API response
  const transformConfigData = (apiData: any): SystemConfigGeneral => {
    // Nếu API trả về array của config items
    if (Array.isArray(apiData)) {
      const config: SystemConfigGeneral = {}
      apiData.forEach((item: any) => {
        if (item.key && item.value !== undefined) {
          config[item.key] = item.value
        }
      })
      return config
    }
    
    // Nếu API trả về object trực tiếp (format mới)
    return apiData || {}
  }
  
  // Function để lấy data (từ cache hoặc fetch mới)
  const getData = async (): Promise<SystemConfigGeneral | null> => {
    // Kiểm tra cache từ localStorage nếu chưa có trong memory
    if (!globalCache.value) {
      const cachedData = getCacheFromStorage()
      if (cachedData) {
        globalCache.value = cachedData
        data.value = cachedData.data
        console.log('📦 System config loaded from localStorage cache')
        return cachedData.data
      }
    }
    
    // Nếu có cache hợp lệ và không force refresh
    if (isCacheValid.value && !forceRefresh) {
      data.value = globalCache.value!.data
      console.log('⚡ System config loaded from memory cache')
      return globalCache.value!.data
    }
    
    // Fetch data mới
    console.log('🌐 Fetching system config from API...')
    await fetchData()
    return data.value
  }
  
  // Function để clear cache
  const clearCache = (): void => {
    globalCache.value = null
    data.value = null
    clearCacheFromStorage()
    console.log('🗑️ System config cache cleared')
  }
  
  // Function để refresh data (force fetch)
  const refresh = async (): Promise<void> => {
    await getData()
  }
  
  // Function để lấy một config value cụ thể
  const getConfigValue = (key: string, defaultValue: any = null): any => {
    if (!data.value) return defaultValue
    return data.value[key] ?? defaultValue
  }
  
  // Function để lấy system info
  const systemInfo = computed(() => ({
    name: getConfigValue('name', ''),
    version: getConfigValue('version', ''),
    timezone: getConfigValue('timezone', '')
  }))
  
  return {
    // State
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    isCacheValid,
    systemInfo,
    
    // Methods
    getData,
    fetchData,
    refresh,
    clearCache,
    getConfigValue
  }
}

// ===== GLOBAL SYSTEM CONFIG COMPOSABLE =====

/**
 * Global composable để lấy cấu hình general (sử dụng ở mọi trang)
 * Tự động cache và chia sẻ dữ liệu giữa các component
 */
export function useGlobalSystemConfig(): SystemConfigResult {
  return useSystemConfig('general', {
    enableCache: true,
    forceRefresh: false
  })
}
