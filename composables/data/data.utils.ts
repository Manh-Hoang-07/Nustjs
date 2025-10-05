import type { PaginationMeta } from './data.types'

// ===== CACHE UTILITIES =====

/**
 * Generate cache key from parameters
 */
export function generateCacheKey(params: Record<string, any>): string {
  return JSON.stringify(params)
}

/**
 * Check if cache item is expired
 */
export function isCacheExpired(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp > ttl
}

// ===== PAGINATION UTILITIES =====

/**
 * Create default pagination meta
 */
export function createDefaultPaginationMeta(pageSize: number = 10): PaginationMeta {
  return {
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: pageSize,
    last_page: 1,
    links: []
  }
}

/**
 * Check if page is valid
 */
export function isValidPage(page: number, lastPage: number): boolean {
  return page > 0 && page <= lastPage
}

/**
 * Check if page size is valid
 */
export function isValidPageSize(size: number): boolean {
  return size > 0
}

// ===== FILTER UTILITIES =====

/**
 * Check if filters have changed
 */
export function hasFiltersChanged(
  currentFilters: Record<string, any>, 
  newFilters: Record<string, any>
): boolean {
  return Object.keys(newFilters).some(key => currentFilters[key] !== newFilters[key])
}

/**
 * Check if filters are different from default
 */
export function hasFiltersChangedFromDefault(
  currentFilters: Record<string, any>, 
  defaultFilters: Record<string, any>
): boolean {
  return Object.keys(defaultFilters).some(key => currentFilters[key] !== defaultFilters[key])
}

/**
 * Merge filters safely
 */
export function mergeFilters(
  currentFilters: Record<string, any>, 
  newFilters: Record<string, any>
): Record<string, any> {
  return { ...currentFilters, ...newFilters }
}

// ===== API UTILITIES =====

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const urlParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, String(value))
    }
  })
  
  return urlParams.toString()
}

/**
 * Build full URL with query string
 */
export function buildFullUrl(endpoint: string, params: Record<string, any>): string {
  const queryString = buildQueryString(params)
  return queryString ? `${endpoint}?${queryString}` : endpoint
}

// ===== DEBOUNCE UTILITIES =====

/**
 * Create debounced function
 */
export function createDebouncedFunction<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// ===== TRANSFORM UTILITIES =====

/**
 * Default transform item function
 */
export function defaultTransformItem(item: any): any {
  return item
}

/**
 * Default before submit function
 */
export function defaultBeforeSubmit(data: any): any {
  return data
}

/**
 * Default after fetch function
 */
export function defaultAfterFetch(data: any): any {
  return data
}

// ===== ERROR UTILITIES =====

/**
 * Extract error message from API error
 */
export function extractErrorMessage(error: any): string {
  if (error.userMessage) {
    return error.userMessage
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'Đã xảy ra lỗi không xác định'
}

/**
 * Extract validation errors from API error
 */
export function extractValidationErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (error.response?.status === 422 && error.response?.data?.errors) {
    const apiErrors = error.response.data.errors
    
    for (const field in apiErrors) {
      if (Array.isArray(apiErrors[field])) {
        errors[field] = apiErrors[field][0]
      } else {
        errors[field] = apiErrors[field]
      }
    }
  }
  
  return errors
}

// ===== SELECTION UTILITIES =====

/**
 * Check if all items are selected
 */
export function isAllSelected<T>(
  items: T[], 
  selectedItems: T[], 
  getId: (item: T) => any = (item: any) => item.id
): boolean {
  return items.length > 0 && selectedItems.length === items.length
}

/**
 * Toggle item selection
 */
export function toggleItemSelection<T>(
  item: T,
  selectedItems: T[],
  getId: (item: T) => any = (item: any) => item.id
): T[] {
  const index = selectedItems.findIndex(i => getId(i) === getId(item))
  
  if (index === -1) {
    return [...selectedItems, item]
  } else {
    return selectedItems.filter((_, i) => i !== index)
  }
}

/**
 * Toggle all items selection
 */
export function toggleAllSelection<T>(
  items: T[],
  selectedItems: T[],
  getId: (item: T) => any = (item: any) => item.id
): T[] {
  if (selectedItems.length === items.length) {
    return []
  } else {
    return [...items]
  }
}
