import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { useRuntimeConfig } from '#app'
import type { 
  ApiClientOptions, 
  EnhancedError, 
  ApiClientMethods, 
  EnhancedApiClient, 
  ApiClientResult 
} from './api.types'
import { 
  getTokenFromCookie, 
  createRequestKey, 
  createEnhancedError, 
  getUserFriendlyMessage, 
  createDefaultConfig,
  createRequestTracker 
} from './api.utils'

// ===== COMPOSABLE =====

/**
 * Composable để tạo và quản lý API client với các tính năng cơ bản
 */
export function useApiClient(options: ApiClientOptions = {}): ApiClientResult {
  const config = useRuntimeConfig()
  
  const {
    retryAttempts = 0, // Tắt retry hoàn toàn
    retryDelay = 1000,
    timeout = 10000, // Giảm timeout từ 30s xuống 10s
    enableRetry = false, // Tắt retry mặc định
    preventDuplicateCalls = true // Bật tránh duplicate calls
  } = options

  // Track active requests to prevent duplicates
  const activeRequests = createRequestTracker()

  // Tạo API client với base URL từ runtime config
  const api: AxiosInstance = axios.create(createDefaultConfig(config.public.apiBase))

  // Helper function để lấy token từ cookie (using utility)
  const getToken = () => getTokenFromCookie()

  // Helper function để xử lý request với duplicate prevention
  async function handleRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const requestKey = createRequestKey(method, url, config)
    
    // Check if request is already in progress
    if (preventDuplicateCalls && activeRequests.has(requestKey)) {
      return activeRequests.get(requestKey) as Promise<AxiosResponse<T>>
    }

    // Create new request
    const requestPromise = (api as any)[method](url, data, config) as Promise<AxiosResponse<T>>
    
    // Store active request
    if (preventDuplicateCalls) {
      activeRequests.set(requestKey, requestPromise)
    }

    try {
      const response = await requestPromise
      return response
    } finally {
      // Remove from active requests when done
      if (preventDuplicateCalls) {
        activeRequests.delete(requestKey)
      }
    }
  }

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Tự động thêm token vào header nếu có trong cookie
      const token = getToken()
      if (token) {
        config.headers = config.headers || {}
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
        return await handleRequest<T>('get', url, undefined, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'GET', url)
      }
    },

    async post<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await handleRequest<T>('post', url, data, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'POST', url)
      }
    },

    async put<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await handleRequest<T>('put', url, data, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'PUT', url)
      }
    },

    async delete<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await handleRequest<T>('delete', url, undefined, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'DELETE', url)
      }
    },

    async patch<T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
      try {
        return await handleRequest<T>('patch', url, data, config)
      } catch (error) {
        throw this.handleError(error as AxiosError, 'PATCH', url)
      }
    },

    handleError(error: AxiosError, method: string, url: string): EnhancedError {
      return createEnhancedError(error, method, url)
    },

    getUserFriendlyMessage(error: AxiosError): string {
      return getUserFriendlyMessage(error)
    },

    clearActiveRequests(): void {
      activeRequests.clear()
    }
  } as EnhancedApiClient

  return {
    apiClient: enhancedApi
  }
}

// ===== SINGLETON INSTANCE =====

// Global API client instance để tránh duplicate calls across components
let globalApiClient: EnhancedApiClient | null = null

export function useGlobalApiClient(): { apiClient: EnhancedApiClient } {
  if (!globalApiClient) {
    const { apiClient } = useApiClient({ preventDuplicateCalls: true })
    globalApiClient = apiClient
  }
  return { apiClient: globalApiClient }
}
