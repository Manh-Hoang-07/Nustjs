import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { Ref } from 'vue'

// ===== API CLIENT TYPES =====

export interface ApiClientOptions {
  retryAttempts?: number
  retryDelay?: number
  timeout?: number
  enableRetry?: boolean
  preventDuplicateCalls?: boolean
}

export interface EnhancedError extends AxiosError {
  method?: string
  url?: string
  timestamp?: string
  userMessage?: string
}

export interface ApiClientMethods {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>
  handleError: (error: AxiosError, method: string, url: string) => EnhancedError
  getUserFriendlyMessage: (error: AxiosError) => string
  clearActiveRequests: () => void
}

export interface EnhancedApiClient extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'>, ApiClientMethods {}

export interface ApiClientResult {
  apiClient: EnhancedApiClient
}

// ===== API FETCH TYPES =====

export interface ApiFetchOptions {
  immediate?: boolean
  params?: Ref<Record<string, any>>
}

export interface ApiFetchResult<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<any>
  fetchData: () => Promise<void>
}

// ===== REQUEST TYPES =====

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export interface RequestConfig extends AxiosRequestConfig {
  method: HttpMethod
  url: string
  data?: any
}

export interface RequestOptions {
  preventDuplicate?: boolean
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

// ===== ERROR TYPES =====

export interface ApiError extends Error {
  status?: number
  statusText?: string
  data?: any
  method?: string
  url?: string
  timestamp?: string
  userMessage?: string
}

export interface ErrorHandler {
  (error: AxiosError): EnhancedError
}

// ===== INTERCEPTOR TYPES =====

export interface RequestInterceptor {
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  onRejected?: (error: any) => any
}

export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  onRejected?: (error: any) => any
}

// ===== CACHE TYPES =====

export interface CacheOptions {
  enabled?: boolean
  ttl?: number
  maxSize?: number
}

export interface CacheItem<T = any> {
  data: T
  timestamp: number
  ttl: number
}

// ===== AUTH TYPES =====

export interface AuthConfig {
  tokenKey?: string
  tokenPrefix?: string
  autoAttach?: boolean
}

export interface TokenProvider {
  getToken: () => string | null
  setToken: (token: string) => void
  clearToken: () => void
}

// ===== RETRY TYPES =====

export interface RetryConfig {
  attempts: number
  delay: number
  backoff?: 'linear' | 'exponential'
  maxDelay?: number
  retryCondition?: (error: AxiosError) => boolean
}

// ===== GLOBAL API CLIENT TYPES =====

export interface GlobalApiClientResult {
  apiClient: EnhancedApiClient
}

// ===== UTILITY TYPES =====

export interface RequestKey {
  method: string
  url: string
  params?: string
}

export interface ActiveRequest {
  promise: Promise<AxiosResponse>
  timestamp: number
}

export interface RequestMap {
  [key: string]: ActiveRequest
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  timestamp: string
  errors?: Record<string, string[]>
}