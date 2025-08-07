import axios from 'axios'

/**
 * Composable để tạo và quản lý API client với các tính năng nâng cao
 * @param {Object} options - Các tùy chọn cấu hình
 * @returns {Object} - API client instance
 */
export function useApiClient(options = {}) {
  const config = useRuntimeConfig()
  
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    timeout = 30000,
    enableRetry = true,
    enablePerformanceMonitoring = true
  } = options

  // Helper function để lấy thời gian hiện tại (tương thích SSR)
  const getNow = () => {
    if (process.client && typeof performance !== 'undefined' && performance.now) {
      return performance.now()
    }
    return Date.now()
  }

  // Tạo API client với base URL từ runtime config
  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Performance monitoring
  const performanceMetrics = {
    requestCount: 0,
    totalResponseTime: 0,
    slowRequests: []
  }

  // Helper function để lấy token từ cookie
  function getTokenFromCookie() {
    if (process.client) {
      const cookies = document.cookie.split(';')
      
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'auth_token') {
          const token = decodeURIComponent(value)
          return token
        }
      }
    }
    return null
  }

  // Retry logic với exponential backoff
  const retryRequest = async (error, retryCount = 0) => {
    if (!enableRetry || retryCount >= retryAttempts) {
      throw error
    }

    // Chỉ retry cho một số lỗi nhất định
    const shouldRetry = error.response?.status >= 500 || 
                       error.code === 'ECONNABORTED' ||
                       error.code === 'NETWORK_ERROR'

    if (!shouldRetry) {
      throw error
    }

    // Exponential backoff với jitter
    const delay = retryDelay * Math.pow(2, retryCount) + Math.random() * 1000
    await new Promise(resolve => setTimeout(resolve, delay))

    // Retry request
    try {
      return await api.request(error.config)
    } catch (retryError) {
      return retryRequest(retryError, retryCount + 1)
    }
  }

  // Request interceptor với performance monitoring
  api.interceptors.request.use(
    (config) => {
      // Tự động thêm token vào header nếu có trong cookie
      const token = getTokenFromCookie()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add request timestamp for performance monitoring
      config.metadata = { 
        startTime: getNow(),
        url: config.url 
      }
      
      // Increment request count
      if (enablePerformanceMonitoring) {
        performanceMetrics.requestCount++
      }
      
      return config
    },
    (error) => {
      console.error('API Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor với enhanced performance monitoring
  api.interceptors.response.use(
    (response) => {
      // Enhanced performance monitoring
      if (response.config.metadata?.startTime && enablePerformanceMonitoring) {
        const duration = getNow() - response.config.metadata.startTime
        performanceMetrics.totalResponseTime += duration
        
        // Track slow requests (>2s)
        if (duration > 2000) {
          performanceMetrics.slowRequests.push({
            url: response.config.url,
            duration: duration,
            timestamp: new Date().toISOString()
          })
          
          console.warn(`Slow API request: ${response.config.url} took ${duration.toFixed(2)}ms`)
        }
        
        // Log performance metrics every 10 requests
        if (performanceMetrics.requestCount % 10 === 0) {
          const avgResponseTime = performanceMetrics.totalResponseTime / performanceMetrics.requestCount
          console.log(`API Performance - Avg: ${avgResponseTime.toFixed(2)}ms, Total: ${performanceMetrics.requestCount}`)
        }
      }
      
      return response
    },
    (error) => {
      // Log error performance
      if (error.config?.metadata?.startTime && enablePerformanceMonitoring) {
        const duration = getNow() - error.config.metadata.startTime
        console.error(`API Error: ${error.config.url} failed after ${duration.toFixed(2)}ms`)
      }
      
      return retryRequest(error)
    }
  )

  // Enhanced methods with better error handling
  const enhancedApi = {
    ...api,
    
    async get(url, config = {}) {
      try {
        return await api.get(url, config)
      } catch (error) {
        throw this.handleError(error, 'GET', url)
      }
    },

    async post(url, data = {}, config = {}) {
      try {
        return await api.post(url, data, config)
      } catch (error) {
        throw this.handleError(error, 'POST', url)
      }
    },

    async put(url, data = {}, config = {}) {
      try {
        return await api.put(url, data, config)
      } catch (error) {
        throw this.handleError(error, 'PUT', url)
      }
    },

    async delete(url, config = {}) {
      try {
        return await api.delete(url, config)
      } catch (error) {
        throw this.handleError(error, 'DELETE', url)
      }
    },

    async patch(url, data = {}, config = {}) {
      try {
        return await api.patch(url, data, config)
      } catch (error) {
        throw this.handleError(error, 'PATCH', url)
      }
    },

    handleError(error, method, url) {
      // Enhanced error object với thông tin chi tiết
      const enhancedError = {
        ...error,
        method,
        url,
        timestamp: new Date().toISOString(),
        userMessage: this.getUserFriendlyMessage(error),
        // Thêm thông tin debug
        debug: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            timeout: error.config?.timeout,
            baseURL: error.config?.baseURL
          }
        }
      }

      // Log chi tiết cho debugging
      console.error('API Error Details:', {
        method,
        url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        timestamp: enhancedError.timestamp
      })

      return enhancedError
    },

    getUserFriendlyMessage(error) {
      const status = error.response?.status
      const data = error.response?.data

      // Custom error messages from API
      if (data?.message) {
        return data.message
      }

      // Default messages based on status
      const messages = {
        400: 'Dữ liệu không hợp lệ',
        401: 'Vui lòng đăng nhập lại',
        403: 'Bạn không có quyền thực hiện hành động này',
        404: 'Không tìm thấy dữ liệu',
        422: 'Dữ liệu không hợp lệ',
        429: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
        500: 'Lỗi server, vui lòng thử lại sau',
        502: 'Lỗi kết nối server',
        503: 'Server đang bảo trì',
        504: 'Hết thời gian chờ kết nối'
      }

      // Network errors
      if (error.code === 'ECONNABORTED') {
        return 'Kết nối bị timeout, vui lòng thử lại'
      }
      
      if (error.code === 'NETWORK_ERROR') {
        return 'Không thể kết nối đến server'
      }

      return messages[status] || 'Có lỗi xảy ra, vui lòng thử lại'
    }
  }

  return enhancedApi
} 