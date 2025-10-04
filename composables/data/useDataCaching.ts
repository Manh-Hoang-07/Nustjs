import type { PaginationMeta } from './useDataFetching'

// ===== TYPES =====

export interface CacheItem {
  data: any
  meta: PaginationMeta
  timestamp: number
  ttl: number
}

export interface DataCachingOptions {
  cacheEnabled?: boolean
  defaultTTL?: number
}

export interface DataCachingResult<T = any> {
  getCache: (key: string) => { data: T[]; meta: PaginationMeta } | null
  setCache: (key: string, data: { data: T[]; meta: PaginationMeta }, ttl?: number) => void
  clearCache: () => void
  generateCacheKey: (params: Record<string, any>) => string
}

// ===== COMPOSABLE =====

/**
 * Composable xử lý việc cache dữ liệu
 */
export function useDataCaching<T = any>(
  options: DataCachingOptions = {}
): DataCachingResult<T> {
  const {
    cacheEnabled = false,
    defaultTTL = 5 * 60 * 1000 // 5 minutes
  } = options

  const cache = new Map<string, CacheItem>()

  // Cache key generator
  const generateCacheKey = (params: Record<string, any>): string => {
    return JSON.stringify(params)
  }

  // Cache với TTL (Time To Live)
  const setCache = (key: string, data: { data: T[]; meta: PaginationMeta }, ttl: number = defaultTTL): void => {
    if (!cacheEnabled) return
    
    cache.set(key, {
      data: data.data,
      meta: data.meta,
      timestamp: Date.now(),
      ttl
    })
  }

  const getCache = (key: string): { data: T[]; meta: PaginationMeta } | null => {
    if (!cacheEnabled) return null
    
    const cached = cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      cache.delete(key)
      return null
    }
    
    return { data: cached.data, meta: cached.meta }
  }

  const clearCache = (): void => {
    cache.clear()
  }

  return {
    getCache,
    setCache,
    clearCache,
    generateCacheKey
  }
}
