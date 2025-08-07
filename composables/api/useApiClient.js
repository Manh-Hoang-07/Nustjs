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
    enableRetry = true
  } = options

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

  // Retry logic
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

    // Exponential backoff
    const delay = retryDelay * Math.pow(2, retryCount)
    await new Promise(resolve => setTimeout(resolve, delay))

    // Retry request
    try {
      return await api.request(error.config)
    } catch (retryError) {
      return retryRequest(retryError, retryCount + 1)
    }
  }

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Tự động thêm token vào header nếu có trong cookie
      const token = getTokenFromCookie()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() }
      
      return config
    },
    (error) => {
      console.error('API Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      // Log response time for performance monitoring - chỉ log khi thực sự chậm
      if (response.config.metadata?.startTime) {
        const duration = new Date() - response.config.metadata.startTime
        // Tăng ngưỡng từ 2s lên 5s để giảm cảnh báo không cần thiết
        if (duration > 5000) { // Chỉ log requests thực sự chậm (>5s)
          console.warn(`Slow API request: ${response.config.url} took ${duration}ms`)
        }
      }
      
      return response
    },
    async (error) => {
      // Log detailed error information - chỉ log lỗi thực sự quan trọng
      if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
        console.error('API Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
          message: error.message,
          duration: error.config?.metadata?.startTime ? 
            new Date() - error.config.metadata.startTime : null
        })
      }
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        // Redirect to login or refresh token
        console.warn('Authentication error - redirecting to login')
        // Có thể thêm logic redirect ở đây
      }
      
      if (error.response?.status === 403) {
        console.warn('Forbidden - insufficient permissions')
      }

      // Retry logic
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
      // Enhanced error object
      const enhancedError = {
        ...error,
        method,
        url,
        timestamp: new Date().toISOString(),
        userMessage: this.getUserFriendlyMessage(error)
      }

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
        500: 'Lỗi server, vui lòng thử lại sau',
        502: 'Lỗi kết nối server',
        503: 'Server đang bảo trì',
        504: 'Hết thời gian chờ kết nối'
      }

      return messages[status] || 'Có lỗi xảy ra, vui lòng thử lại'
    }
  }

  return enhancedApi
} 