import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { useRuntimeConfig } from '#app'

// ===== TYPES =====

interface ApiClientOptions {
  retryAttempts?: number
  retryDelay?: number
  timeout?: number
  enableRetry?: boolean
}

interface EnhancedError extends AxiosError {
  method?: string
  url?: string
  timestamp?: string
  userMessage?: string
}

interface ApiClientMethods {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  handleError: (error: AxiosError, method: string, url: string) => EnhancedError
  getUserFriendlyMessage: (error: AxiosError) => string
}

interface EnhancedApiClient extends AxiosInstance, ApiClientMethods {}

// ===== COMPOSABLE =====

/**
 * Composable để tạo và quản lý API client với các tính năng cơ bản
 */
export function useApiClient(options: ApiClientOptions = {}) {
  const config = useRuntimeConfig()
  
  const {
    retryAttempts = 0, // Tắt retry hoàn toàn
    retryDelay = 1000,
    timeout = 10000, // Giảm timeout từ 30s xuống 10s
    enableRetry = false // Tắt retry mặc định
  } = options

  // Tạo API client với base URL từ runtime config
  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Helper function để lấy token từ cookie
  function getTokenFromCookie(): string | null {
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

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Tự động thêm token vào header nếu có trong cookie
      const token = getTokenFromCookie()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Không retry, chỉ throw error
      return Promise.reject(error)
    }
  )

  // Enhanced methods with better error handling
  const enhancedApi: EnhancedApiClient = {
    ...api,
    
    async get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await api.get<T>(url, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'GET', url)
      }
    },

    async post<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await api.post<T>(url, data, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'POST', url)
      }
    },

    async put<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await api.put<T>(url, data, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'PUT', url)
      }
    },

    async delete<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await api.delete<T>(url, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'DELETE', url)
      }
    },

    async patch<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await api.patch<T>(url, data, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'PATCH', url)
      }
    },

    handleError(error: AxiosError, method: string, url: string): EnhancedError {
      // Enhanced error object với thông tin chi tiết
      const enhancedError: EnhancedError = {
        ...error,
        method,
        url,
        timestamp: new Date().toISOString(),
        userMessage: this.getUserFriendlyMessage(error)
      }

      return enhancedError
    },

    getUserFriendlyMessage(error: AxiosError): string {
      const status = error.response?.status
      const data = error.response?.data as any

      // Custom error messages from API
      if (data?.message) {
        return data.message
      }

      // Default messages based on status
      const messages: Record<number, string> = {
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

      return messages[status || 0] || 'Có lỗi xảy ra, vui lòng thử lại'
    }
  } as EnhancedApiClient

  return {
    apiClient: enhancedApi
  }
}
