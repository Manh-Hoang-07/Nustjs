import { ref, computed } from 'vue'

// Dynamic cache để lưu enum từ API
const dynamicCache = new Map()

// Cache timeout - 24 giờ
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000

export function useFastEnums() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Lấy enum data với hybrid approach
   * @param {string} type - Loại enum (user_status, gender, etc.)
   * @param {boolean} useStatic - Có sử dụng static enum không (mặc định: true)
   * @param {boolean} forceRefresh - Bắt buộc refresh từ API (mặc định: false)
   * @returns {Promise<Array>} Enum data
   */
  const getEnum = async (type, useStatic = true, forceRefresh = false) => {
    // Reset error
    error.value = null

    // Static enums removed; always prefer cache or API
    
    // 2. Check dynamic cache - nếu không force refresh
    if (!forceRefresh && dynamicCache.has(type)) {
      const cached = dynamicCache.get(type)
      if (Date.now() - cached.timestamp < CACHE_TIMEOUT) {
        return cached.data
      } else {
        // Cache expired, remove it
        dynamicCache.delete(type)
      }
    }
    
    // 3. Fetch from API
    loading.value = true
    try {
      const response = await fetch(`/api/enums/${type}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load enum')
      }
      
      const enumData = result.data
      
      // Cache the result
      dynamicCache.set(type, {
        data: enumData,
        timestamp: Date.now()
      })
      
      return enumData
    } catch (err) {
      error.value = err.message
      console.error(`Failed to load enum ${type}:`, err)
      
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Lấy enum ngay lập tức từ static data (không async)
   * @param {string} type - Loại enum
   * @returns {Array} Enum data hoặc empty array
   */
  const getEnumSync = (type) => {
    // No static enums; return empty array synchronously
    return []
  }

  /**
   * Clear cache cho enum type cụ thể
   * @param {string} type - Loại enum
   */
  const clearCache = (type) => {
    if (type) {
      dynamicCache.delete(type)
    } else {
      dynamicCache.clear()
    }
  }

  /**
   * Refresh enum từ API
   * @param {string} type - Loại enum
   * @returns {Promise<Array>} Enum data
   */
  const refreshEnum = (type) => {
    return getEnum(type, false, true)
  }

  /**
   * Load tất cả enum types
   * @param {Array} types - Danh sách enum types
   * @param {boolean} useStatic - Có sử dụng static enum không
   * @returns {Promise<Object>} Object chứa tất cả enum data
   */
  const loadAllEnums = async (types = null, useStatic = true) => {
    const enumTypes = types || ['user_status', 'gender', 'basic_status', 'role_status', 'product_status', 'order_status', 'variant_status']
    const results = {}
    
    await Promise.all(
      enumTypes.map(async (type) => {
        try {
          results[type] = await getEnum(type, useStatic)
        } catch (err) {
          console.error(`Failed to load enum ${type}:`, err)
          results[type] = []
        }
      })
    )
    
    return results
  }

  /**
   * Kiểm tra enum có trong cache không
   * @param {string} type - Loại enum
   * @returns {boolean}
   */
  const hasCache = (type) => {
    return dynamicCache.has(type)
  }

  /**
   * Lấy thông tin cache
   * @returns {Object} Cache info
   */
  const getCacheInfo = () => {
    const info = {}
    for (const [type, cached] of dynamicCache.entries()) {
      info[type] = {
        timestamp: cached.timestamp,
        age: Date.now() - cached.timestamp,
        expired: Date.now() - cached.timestamp > CACHE_TIMEOUT
      }
    }
    return info
  }

  return {
    // State
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Methods
    getEnum,
    getEnumSync,
    clearCache,
    refreshEnum,
    loadAllEnums,
    hasCache,
    getCacheInfo,
    
    // Static enums removed
  }
} 