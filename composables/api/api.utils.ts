import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { 
  EnhancedError, 
  RequestKey, 
  HttpMethod, 
  RetryConfig, 
  CacheItem,
  ApiError 
} from './api.types'

// ===== TOKEN UTILITIES =====

/**
 * Get token from cookie
 */
export function getTokenFromCookie(tokenKey: string = 'auth_token'): string | null {
  if (process.client) {
    const cookies = document.cookie.split(';')
    
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === tokenKey) {
        const token = decodeURIComponent(value || '')
        return token
      }
    }
  }
  return null
}

/**
 * Set token to cookie
 */
export function setTokenToCookie(token: string, tokenKey: string = 'auth_token'): void {
  if (process.client) {
    document.cookie = `${tokenKey}=${encodeURIComponent(token)}; path=/; secure; samesite=strict`
  }
}

/**
 * Clear token from cookie
 */
export function clearTokenFromCookie(tokenKey: string = 'auth_token'): void {
  if (process.client) {
    document.cookie = `${tokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

// ===== REQUEST UTILITIES =====

/**
 * Create request key for duplicate prevention
 */
export function createRequestKey(
  method: string, 
  url: string, 
  config?: AxiosRequestConfig
): string {
  const params = config?.params ? JSON.stringify(config.params) : ''
  return `${method}:${url}${params ? `?${params}` : ''}`
}

/**
 * Check if request should be retried
 */
export function shouldRetryRequest(
  error: AxiosError, 
  retryConfig: RetryConfig
): boolean {
  if (!retryConfig.retryCondition) {
    // Default retry condition
    return error.response?.status ? 
      [408, 429, 500, 502, 503, 504].includes(error.response.status) : 
      false
  }
  
  return retryConfig.retryCondition(error)
}

/**
 * Calculate retry delay
 */
export function calculateRetryDelay(
  attempt: number, 
  retryConfig: RetryConfig
): number {
  const { delay, backoff = 'linear', maxDelay = 30000 } = retryConfig
  
  let calculatedDelay = delay
  
  if (backoff === 'exponential') {
    calculatedDelay = delay * Math.pow(2, attempt - 1)
  } else if (backoff === 'linear') {
    calculatedDelay = delay * attempt
  }
  
  return Math.min(calculatedDelay, maxDelay)
}

// ===== ERROR UTILITIES =====

/**
 * Create enhanced error object
 */
export function createEnhancedError(
  error: AxiosError, 
  method: string, 
  url: string
): EnhancedError {
  return {
    ...error,
    method,
    url,
    timestamp: new Date().toISOString(),
    userMessage: getUserFriendlyMessage(error)
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AxiosError): string {
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

/**
 * Check if error is network error
 */
export function isNetworkError(error: AxiosError): boolean {
  return !error.response && error.request
}

/**
 * Check if error is timeout
 */
export function isTimeoutError(error: AxiosError): boolean {
  return error.code === 'ECONNABORTED'
}

/**
 * Check if error is server error (5xx)
 */
export function isServerError(error: AxiosError): boolean {
  const status = error.response?.status
  return status ? status >= 500 && status < 600 : false
}

/**
 * Check if error is client error (4xx)
 */
export function isClientError(error: AxiosError): boolean {
  const status = error.response?.status
  return status ? status >= 400 && status < 500 : false
}

// ===== CACHE UTILITIES =====

/**
 * Check if cache item is expired
 */
export function isApiCacheExpired<T>(item: CacheItem<T>): boolean {
  return Date.now() - item.timestamp > item.ttl
}

/**
 * Create cache item
 */
export function createApiCacheItem<T>(
  data: T, 
  ttl: number = 5 * 60 * 1000
): CacheItem<T> {
  return {
    data,
    timestamp: Date.now(),
    ttl
  }
}

/**
 * Generate cache key from request
 */
export function generateApiCacheKey(
  method: string,
  url: string,
  params?: Record<string, any>
): string {
  const paramString = params ? JSON.stringify(params) : ''
  return `${method}:${url}:${paramString}`
}

// ===== REQUEST INTERCEPTOR UTILITIES =====

/**
 * Create request interceptor for auth
 */
export function createAuthInterceptor(tokenKey: string = 'auth_token') {
  return {
    onFulfilled: (config: AxiosRequestConfig) => {
      const token = getTokenFromCookie(tokenKey)
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    onRejected: (error: any) => Promise.reject(error)
  }
}

/**
 * Create response interceptor for error handling
 */
export function createErrorInterceptor() {
  return {
    onFulfilled: (response: any) => response,
    onRejected: (error: any) => Promise.reject(error)
  }
}

// ===== CONFIG UTILITIES =====

/**
 * Create default axios config
 */
export function createDefaultConfig(baseURL: string): AxiosRequestConfig {
  return {
    baseURL,
    withCredentials: true,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
}

/**
 * Merge request configs
 */
export function mergeConfigs(
  baseConfig: AxiosRequestConfig,
  overrideConfig: AxiosRequestConfig = {}
): AxiosRequestConfig {
  return {
    ...baseConfig,
    ...overrideConfig,
    headers: {
      ...baseConfig.headers,
      ...overrideConfig.headers
    }
  }
}

// ===== VALIDATION UTILITIES =====

/**
 * Validate HTTP method
 */
export function isValidHttpMethod(method: string): method is HttpMethod {
  return ['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  return url.replace(/\/+/g, '/').replace(/\/$/, '')
}

// ===== RETRY UTILITIES =====

/**
 * Sleep utility for retry delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Execute retry logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retryConfig: RetryConfig
): Promise<T> {
  let lastError: any
  
  for (let attempt = 1; attempt <= retryConfig.attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === retryConfig.attempts) {
        break
      }
      
      if (!shouldRetryRequest(error as AxiosError, retryConfig)) {
        break
      }
      
      const delay = calculateRetryDelay(attempt, retryConfig)
      await sleep(delay)
    }
  }
  
  throw lastError
}

// ===== REQUEST TRACKING UTILITIES =====

/**
 * Create request tracker
 */
export function createRequestTracker() {
  const activeRequests = new Map<string, any>()
  
  return {
    has: (key: string) => activeRequests.has(key),
    get: (key: string) => activeRequests.get(key),
    set: (key: string, value: any) => activeRequests.set(key, value),
    delete: (key: string) => activeRequests.delete(key),
    clear: () => activeRequests.clear(),
    size: () => activeRequests.size
  }
}
