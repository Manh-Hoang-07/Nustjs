import { ref } from 'vue'

// Global cache store
const apiCache = new Map()
const cacheTimestamps = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 phút

export function useApiCache() {
  const isFetching = ref(new Map())

  // Kiểm tra cache có hợp lệ không
  const isCacheValid = (key) => {
    const timestamp = cacheTimestamps.get(key)
    if (!timestamp) return false
    
    const now = Date.now()
    return (now - timestamp) < CACHE_DURATION
  }

  // Lấy data từ cache
  const getFromCache = (key) => {
    if (isCacheValid(key)) {
      return apiCache.get(key)
    }
    return null
  }

  // Lưu data vào cache
  const setCache = (key, data) => {
    apiCache.set(key, data)
    cacheTimestamps.set(key, Date.now())
  }

  // Xóa cache
  const clearCache = (key) => {
    if (key) {
      apiCache.delete(key)
      cacheTimestamps.delete(key)
    } else {
      apiCache.clear()
      cacheTimestamps.clear()
    }
  }

  // Kiểm tra đang fetch
  const isCurrentlyFetching = (key) => {
    return isFetching.value.get(key) || false
  }

  // Set fetching state
  const setFetching = (key, fetching) => {
    if (fetching) {
      isFetching.value.set(key, true)
    } else {
      isFetching.value.delete(key)
    }
  }

  // Cached API call
  const cachedApiCall = async (key, apiCall, force = false) => {
    // Kiểm tra cache trước
    if (!force) {
      const cachedData = getFromCache(key)
      if (cachedData) {
        return cachedData
      }
    }

    // Kiểm tra đang fetch
    if (isCurrentlyFetching(key)) {
      // Đợi fetch hiện tại hoàn thành
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!isCurrentlyFetching(key)) {
            clearInterval(checkInterval)
            const cachedData = getFromCache(key)
            resolve(cachedData)
          }
        }, 100)
      })
    }

    // Thực hiện API call
    setFetching(key, true)
    try {
      const data = await apiCall()
      setCache(key, data)
      return data
    } finally {
      setFetching(key, false)
    }
  }

  return {
    cachedApiCall,
    getFromCache,
    setCache,
    clearCache,
    isCacheValid,
    isCurrentlyFetching
  }
} 