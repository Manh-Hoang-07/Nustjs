import type { PaginationMeta, CacheItem, DataCachingOptions, DataCachingResult } from './data.types'
import { generateCacheKey, isCacheExpired } from './data.utils'

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

  // Cache key generator (using utility function)
  const generateCacheKeyLocal = generateCacheKey

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
    
    if (isCacheExpired(cached.timestamp, cached.ttl)) {
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
    generateCacheKey: generateCacheKeyLocal
  }
}
