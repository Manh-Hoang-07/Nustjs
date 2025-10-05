import type { Ref, ComputedRef } from 'vue'

// ===== AUTH INIT TYPES =====

export interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  isUser: boolean
  user: any
}

export interface AuthInitResult {
  isClientReady: Ref<boolean>
  shouldRenderAuthContent: ComputedRef<boolean>
  safeAuthState: ComputedRef<AuthState>
}

// ===== URL FILTER TYPES =====

export interface FiltersState {
  [key: string]: any
}

export interface UrlFiltersOptions {
  filterKeys?: string[]
  debounceMs?: number
}

export interface UrlFiltersResult {
  filters: Ref<FiltersState>
  loadFiltersFromUrl: () => void
  updateFiltersInUrl: (filters: FiltersState) => void
  resetFiltersInUrl: () => void
}

// ===== URL PAGINATION TYPES =====

export interface PaginationState {
  currentPage: number
  perPage?: number
  [key: string]: any
}

export interface UrlPaginationOptions {
  paginationKeys?: string[]
  debounceMs?: number
  defaultPageSize?: number
}

export interface UrlPaginationResult {
  pagination: Ref<PaginationState>
  loadPaginationFromUrl: () => void
  updatePaginationInUrl: (pagination: PaginationState) => void
  resetPaginationInUrl: () => void
}

// ===== URL SORT TYPES =====

export interface SortState {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UrlSortOptions {
  sortKeys?: string[]
  debounceMs?: number
}

export interface UrlSortResult {
  sort: Ref<SortState>
  loadSortFromUrl: () => void
  updateSortInUrl: (sort: SortState) => void
  resetSortInUrl: () => void
}

// ===== URL SYNC TYPES =====

export interface UrlSyncOptions {
  filterKeys?: string[]
  sortKeys?: string[]
  paginationKeys?: string[]
  debounceMs?: number
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
  resetOnRouteChange?: boolean
  defaultPageSize?: number
}

export interface UrlSyncResult {
  onPageChange: (page: number) => void
  onUpdateFilters: (newFilters: FiltersState) => void
  onUpdateSort: (sort: SortState) => void
  onUpdatePerPage: (perPage: number) => void
  onResetFilters: () => void
  onResetAll: () => void
  getCurrentQuery: () => Record<string, any>
}

// ===== URL STATE TYPES =====

export interface SyncQueryPaginationOptions {
  filterKeys?: string[]
  sortKeys?: string[]
  paginationKeys?: string[]
  debounceMs?: number
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
  resetOnRouteChange?: boolean
}

export interface SyncQueryPaginationResult {
  onPageChange: (page: number) => void
  onUpdateFilters: (newFilters: FiltersState) => void
  onUpdateSort: (sort: SortState) => void
  onUpdatePerPage: (perPage: number) => void
  onResetFilters: () => void
  onResetAll: () => void
  getCurrentQuery: () => Record<string, any>
}

// ===== DEBOUNCE TYPES =====

export interface DebounceOptions {
  delay?: number
  immediate?: boolean
  maxWait?: number
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
}

// ===== URL UTILITIES TYPES =====

export interface UrlParseResult {
  protocol: string
  host: string
  pathname: string
  search: string
  hash: string
  query: Record<string, string>
}

export interface UrlBuildOptions {
  protocol?: string
  host?: string
  pathname?: string
  search?: string | Record<string, any>
  hash?: string
}

// ===== QUERY STRING TYPES =====

export interface QueryStringOptions {
  arrayFormat?: 'bracket' | 'index' | 'comma' | 'separator' | 'bracket-separator'
  arrayFormatSeparator?: string
  dateFormat?: 'iso' | 'timestamp'
  skipNull?: boolean
  skipEmptyString?: boolean
  encode?: boolean
  decode?: boolean
  sort?: boolean | ((a: string, b: string) => number)
}

export interface QueryStringResult {
  parse: (str: string, options?: QueryStringOptions) => Record<string, any>
  stringify: (obj: Record<string, any>, options?: QueryStringOptions) => string
}

// ===== ROUTE UTILITIES TYPES =====

export interface RouteInfo {
  path: string
  name?: string
  query?: Record<string, any>
  params?: Record<string, any>
  meta?: Record<string, any>
}

export interface RouteUtilsResult {
  getCurrentRoute: () => RouteInfo
  navigateTo: (path: string, options?: NavigationOptions) => void
  updateQuery: (query: Record<string, any>) => void
  updateParams: (params: Record<string, any>) => void
  goBack: () => void
  goForward: () => void
}

export interface NavigationOptions {
  replace?: boolean
  query?: Record<string, any>
  params?: Record<string, any>
  meta?: Record<string, any>
}

// ===== STORAGE UTILITIES TYPES =====

export interface StorageOptions {
  prefix?: string
  serializer?: {
    parse: (value: string) => any
    stringify: (value: any) => string
  }
  storage?: Storage
}

export interface StorageResult {
  get: <T = any>(key: string, defaultValue?: T) => T | null
  set: (key: string, value: any) => void
  remove: (key: string) => void
  clear: () => void
  has: (key: string) => boolean
  keys: () => string[]
  size: () => number
}

// ===== VALIDATION UTILITIES TYPES =====

export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  url?: boolean
  numeric?: boolean
  integer?: boolean
  custom?: (value: any) => boolean | string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  warnings: Record<string, string>
}

export interface ValidationOptions {
  stopOnFirstError?: boolean
  includeWarnings?: boolean
}

// ===== FORMAT UTILITIES TYPES =====

export interface FormatOptions {
  locale?: string
  currency?: string
  dateFormat?: string
  timeFormat?: string
  numberFormat?: Intl.NumberFormatOptions
}

export interface FormatResult {
  formatCurrency: (amount: number, options?: FormatOptions) => string
  formatDate: (date: Date | string, options?: FormatOptions) => string
  formatTime: (date: Date | string, options?: FormatOptions) => string
  formatNumber: (number: number, options?: FormatOptions) => string
  formatFileSize: (bytes: number) => string
  formatPhoneNumber: (phone: string) => string
}

// ===== ARRAY UTILITIES TYPES =====

export interface ArrayUtilsResult {
  unique: <T>(array: T[]) => T[]
  groupBy: <T>(array: T[], key: keyof T | ((item: T) => string)) => Record<string, T[]>
  sortBy: <T>(array: T[], key: keyof T | ((item: T) => any), order?: 'asc' | 'desc') => T[]
  chunk: <T>(array: T[], size: number) => T[][]
  flatten: <T>(array: T[][]) => T[]
  shuffle: <T>(array: T[]) => T[]
  sample: <T>(array: T[], count?: number) => T[]
  difference: <T>(array1: T[], array2: T[]) => T[]
  intersection: <T>(array1: T[], array2: T[]) => T[]
  union: <T>(array1: T[], array2: T[]) => T[]
}

// ===== OBJECT UTILITIES TYPES =====

export interface ObjectUtilsResult {
  pick: <T, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>
  omit: <T, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>
  deepClone: <T>(obj: T) => T
  deepMerge: <T>(target: T, ...sources: Partial<T>[]) => T
  isEmpty: (obj: any) => boolean
  isEqual: (obj1: any, obj2: any) => boolean
  keys: <T>(obj: T) => (keyof T)[]
  values: <T>(obj: T) => T[keyof T][]
  entries: <T>(obj: T) => [keyof T, T[keyof T]][]
}

// ===== STRING UTILITIES TYPES =====

export interface StringUtilsResult {
  capitalize: (str: string) => string
  camelCase: (str: string) => string
  kebabCase: (str: string) => string
  snakeCase: (str: string) => string
  pascalCase: (str: string) => string
  truncate: (str: string, length: number, suffix?: string) => string
  slugify: (str: string) => string
  escapeHtml: (str: string) => string
  unescapeHtml: (str: string) => string
  stripTags: (str: string) => string
}

// ===== DATE UTILITIES TYPES =====

export interface DateUtilsResult {
  format: (date: Date | string, format?: string) => string
  parse: (dateString: string, format?: string) => Date | null
  isValid: (date: Date | string) => boolean
  addDays: (date: Date, days: number) => Date
  addMonths: (date: Date, months: number) => Date
  addYears: (date: Date, years: number) => Date
  diffInDays: (date1: Date, date2: Date) => number
  diffInMonths: (date1: Date, date2: Date) => number
  diffInYears: (date1: Date, date2: Date) => number
  startOfDay: (date: Date) => Date
  endOfDay: (date: Date) => Date
  startOfMonth: (date: Date) => Date
  endOfMonth: (date: Date) => Date
  startOfYear: (date: Date) => Date
  endOfYear: (date: Date) => Date
  isToday: (date: Date) => boolean
  isYesterday: (date: Date) => boolean
  isTomorrow: (date: Date) => boolean
  isWeekend: (date: Date) => boolean
  isWeekday: (date: Date) => boolean
}

// ===== PERFORMANCE UTILITIES TYPES =====

export interface PerformanceOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
}

export interface PerformanceResult {
  measure: (name: string, fn: () => void) => number
  mark: (name: string) => void
  measureBetween: (startMark: string, endMark: string) => number
  getEntries: () => PerformanceEntry[]
  clearMarks: (name?: string) => void
  clearMeasures: (name?: string) => void
}

// ===== ERROR UTILITIES TYPES =====

export interface ErrorInfo {
  message: string
  stack?: string
  name: string
  cause?: any
  timestamp: number
  context?: Record<string, any>
}

export interface ErrorHandler {
  (error: Error, context?: Record<string, any>): void
}

export interface ErrorUtilsResult {
  captureError: (error: Error, context?: Record<string, any>) => void
  createError: (message: string, cause?: any, context?: Record<string, any>) => Error
  isError: (value: any) => value is Error
  getErrorInfo: (error: Error) => ErrorInfo
  formatError: (error: Error) => string
}
