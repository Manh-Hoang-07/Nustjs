import type { 
  DebounceOptions, 
  DebouncedFunction, 
  UrlParseResult, 
  UrlBuildOptions,
  QueryStringOptions,
  ValidationRule,
  ValidationResult,
  ValidationOptions,
  FormatOptions,
  ErrorInfo,
  ErrorHandler
} from './utils.types'

// ===== DEBOUNCE UTILITIES =====

/**
 * Create debounced function
 */
export function createDebouncedFunction<T extends (...args: any[]) => any>(
  func: T,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { delay = 300, immediate = false, maxWait } = options
  
  let timeoutId: NodeJS.Timeout | null = null
  let maxTimeoutId: NodeJS.Timeout | null = null
  let lastCallTime = 0
  let lastInvokeTime = 0
  let lastArgs: Parameters<T> | undefined
  let lastThis: any
  let result: any

  function invokeFunc(time: number): any {
    const args = lastArgs!
    const thisArg = lastThis

    lastArgs = undefined
    lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge(time: number): any {
    lastInvokeTime = time
    timeoutId = setTimeout(timerExpired, delay)
    return immediate ? invokeFunc(time) : result
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = delay - timeSinceLastCall

    return maxWait ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired(): any {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time: number): any {
    timeoutId = null

    if (lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = undefined
    lastThis = undefined
    return result
  }

  function cancel(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId)
    }
    lastInvokeTime = 0
    lastArgs = undefined
    lastThis = undefined
    lastCallTime = 0
    timeoutId = null
    maxTimeoutId = null
  }

  function flush(): any {
    return timeoutId === null ? result : trailingEdge(Date.now())
  }

  function debounced(this: any, ...args: Parameters<T>): any {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(lastCallTime)
      }
      if (maxWait) {
        timeoutId = setTimeout(timerExpired, delay)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, delay)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush

  return debounced as DebouncedFunction<T>
}

// ===== URL UTILITIES =====

/**
 * Parse URL into components
 */
export function parseUrl(url: string): UrlParseResult {
  try {
    const urlObj = new URL(url)
    const query: Record<string, string> = {}
    
    urlObj.searchParams.forEach((value, key) => {
      query[key] = value
    })

    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      query
    }
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`)
  }
}

/**
 * Build URL from components
 */
export function buildUrl(options: UrlBuildOptions): string {
  const {
    protocol = 'https:',
    host = '',
    pathname = '/',
    search = '',
    hash = ''
  } = options

  let url = `${protocol}//${host}${pathname}`

  if (search) {
    if (typeof search === 'string') {
      url += search.startsWith('?') ? search : `?${search}`
    } else {
      const queryString = buildQueryString(search)
      if (queryString) {
        url += `?${queryString}`
      }
    }
  }

  if (hash) {
    url += hash.startsWith('#') ? hash : `#${hash}`
  }

  return url
}

/**
 * Build query string from object
 */
export function buildQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams()
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, String(item)))
      } else {
        params.append(key, String(value))
      }
    }
  })
  
  return params.toString()
}

/**
 * Parse query string to object
 */
export function parseQueryString(str: string): Record<string, any> {
  const params = new URLSearchParams(str)
  const result: Record<string, any> = {}
  
  params.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value)
      } else {
        result[key] = [result[key], value]
      }
    } else {
      result[key] = value
    }
  })
  
  return result
}

// ===== VALIDATION UTILITIES =====

/**
 * Validate value against rules
 */
export function validateValue(
  value: any, 
  rules: ValidationRule, 
  options: ValidationOptions = {}
): ValidationResult {
  const errors: Record<string, string> = {}
  const warnings: Record<string, string> = {}
  
  const { stopOnFirstError = false, includeWarnings = true } = options

  // Required validation
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.required = 'This field is required'
    if (stopOnFirstError) return { isValid: false, errors, warnings }
  }

  // Skip other validations if value is empty and not required
  if (!rules.required && (value === undefined || value === null || value === '')) {
    return { isValid: true, errors, warnings }
  }

  // Min/Max validation for numbers
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      errors.min = `Value must be at least ${rules.min}`
      if (stopOnFirstError) return { isValid: false, errors, warnings }
    }
    if (rules.max !== undefined && value > rules.max) {
      errors.max = `Value must be at most ${rules.max}`
      if (stopOnFirstError) return { isValid: false, errors, warnings }
    }
  }

  // Min/Max length validation for strings
  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      errors.minLength = `Must be at least ${rules.minLength} characters`
      if (stopOnFirstError) return { isValid: false, errors, warnings }
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      errors.maxLength = `Must be at most ${rules.maxLength} characters`
      if (stopOnFirstError) return { isValid: false, errors, warnings }
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.pattern = 'Invalid format'
    if (stopOnFirstError) return { isValid: false, errors, warnings }
  }

  // Email validation
  if (rules.email && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errors.email = 'Invalid email format'
      if (stopOnFirstError) return { isValid: false, errors, warnings }
    }
  }

  // URL validation
  if (rules.url && typeof value === 'string') {
    try {
      new URL(value)
    } catch {
      errors.url = 'Invalid URL format'
      if (stopOnFirstError) return { isValid: false, errors, warnings }
    }
  }

  // Numeric validation
  if (rules.numeric && isNaN(Number(value))) {
    errors.numeric = 'Must be a number'
    if (stopOnFirstError) return { isValid: false, errors, warnings }
  }

  // Integer validation
  if (rules.integer && (!Number.isInteger(Number(value)) || isNaN(Number(value)))) {
    errors.integer = 'Must be an integer'
    if (stopOnFirstError) return { isValid: false, errors, warnings }
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value)
    if (result !== true) {
      if (typeof result === 'string') {
        errors.custom = result
      } else {
        errors.custom = 'Invalid value'
      }
      if (stopOnFirstError) return { isValid: false, errors, warnings }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  }
}

// ===== FORMAT UTILITIES =====
// Note: Formatting functions are available in utils/formatters.ts

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format Vietnamese phone numbers
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  
  return phone
}

// ===== ARRAY UTILITIES =====

/**
 * Get unique values from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Group array by key
 */
export function groupBy<T>(
  array: T[], 
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[], 
  key: keyof T | ((item: T) => any), 
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(array: T[][]): T[] {
  return array.flat()
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

/**
 * Get random sample from array
 */
export function sample<T>(array: T[], count: number = 1): T[] {
  const shuffled = shuffle(array)
  return shuffled.slice(0, count)
}

/**
 * Get difference between arrays
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => !array2.includes(item))
}

/**
 * Get intersection of arrays
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => array2.includes(item))
}

/**
 * Get union of arrays
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2])
}

// ===== OBJECT UTILITIES =====

/**
 * Pick specific keys from object
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (obj && typeof obj === 'object' && key in obj) {
      const value = obj[key]
      if (value !== undefined) {
        (result as any)[key] = value
      }
    }
  })
  return result
}

/**
 * Omit specific keys from object
 */
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (typeof obj === 'object') {
    const cloned = {} as T
    Object.keys(obj).forEach(key => {
      cloned[key as keyof T] = deepClone((obj as any)[key])
    })
    return cloned
  }
  return obj
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target
  const source = sources.shift()
  
  if (isObject(target) && source && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key as keyof T])) {
        if (!target[key as keyof T]) Object.assign(target, { [key]: {} })
        deepMerge(target[key as keyof T] as Record<string, any>, source[key as keyof T] as Record<string, any>)
      } else {
        Object.assign(target, { [key]: source[key as keyof T] })
      }
    })
  }
  
  return deepMerge(target, ...sources)
}

/**
 * Check if value is object
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

/**
 * Check if two objects are equal
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== typeof obj2) return false
  
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    
    if (keys1.length !== keys2.length) return false
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false
      if (!isEqual(obj1[key], obj2[key])) return false
    }
    
    return true
  }
  
  return false
}

// ===== STRING UTILITIES =====

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

/**
 * Convert to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * Convert to PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/\s+/g, '')
}

/**
 * Truncate string
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}

/**
 * Create URL slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Escape HTML
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return str.replace(/[&<>"']/g, m => map[m] || m)
}

/**
 * Unescape HTML
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  }
  return str.replace(/&(amp|lt|gt|quot|#39);/g, m => map[m] || m)
}

/**
 * Strip HTML tags
 */
export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

// ===== ERROR UTILITIES =====

/**
 * Create error with context
 */
export function createCustomError(
  message: string, 
  cause?: any, 
  context?: Record<string, any>
): Error {
  const error = new Error(message)
  if (cause) error.cause = cause
  if (context) (error as any).context = context
  return error
}

/**
 * Check if value is Error
 */
export function isError(value: any): value is Error {
  return value instanceof Error
}

/**
 * Get error information
 */
export function getErrorInfo(error: Error): ErrorInfo {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    cause: (error as any).cause,
    timestamp: Date.now(),
    context: (error as any).context
  }
}

/**
 * Format error for display
 */
export function formatError(error: Error): string {
  const info = getErrorInfo(error)
  let formatted = `${info.name}: ${info.message}`
  
  if (info.context) {
    formatted += `\nContext: ${JSON.stringify(info.context, null, 2)}`
  }
  
  if (info.stack) {
    formatted += `\nStack: ${info.stack}`
  }
  
  return formatted
}

/**
 * Capture error with handler
 */
export function captureError(
  error: Error, 
  context?: Record<string, any>,
  handler?: ErrorHandler
): void {
  if (handler) {
    handler(error, context)
  } else {
    console.error('Error captured:', formatError(error))
  }
}
