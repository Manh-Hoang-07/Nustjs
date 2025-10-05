import type { Ref, ComputedRef } from 'vue'

// ===== PAGINATION TYPES =====

export interface PaginationMeta {
  current_page: number
  from: number
  to: number
  total: number
  per_page: number
  last_page: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
}

// ===== CACHE TYPES =====

export interface CacheItem {
  data: any
  meta: PaginationMeta
  timestamp: number
  ttl: number
}

// ===== BASE DATA TABLE TYPES =====

export interface BaseDataTableOptions {
  defaultFilters?: Record<string, any>
  defaultSort?: string
  cacheEnabled?: boolean
  debounceTime?: number
  pageSize?: number
  // URL sync options
  enableUrlSync?: boolean
  filterKeys?: string[]
  sortKeys?: string[]
  paginationKeys?: string[]
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
  resetOnRouteChange?: boolean
  // Transform functions
  transformItem?: (item: any) => any
  beforeSubmit?: (data: any) => any
  afterFetch?: (data: any) => any
}

export interface BaseDataTableState<T = any> {
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  pagination: Ref<PaginationMeta>
  filters: Ref<Record<string, any>>
}

export interface BaseDataTableComputed {
  hasData: ComputedRef<boolean>
  isEmpty: ComputedRef<boolean>
  isFirstPage: ComputedRef<boolean>
  isLastPage: ComputedRef<boolean>
}

export interface BaseDataTableResult<T = any> extends BaseDataTableComputed {
  // State as refs
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  pagination: Ref<PaginationMeta>
  filters: Ref<Record<string, any>>
  // Core methods
  fetchData: (params?: Record<string, any>) => Promise<{ data: T[]; meta: PaginationMeta }>
  debouncedFetch: (params?: Record<string, any>) => void
  refresh: () => Promise<{ data: T[]; meta: PaginationMeta }>
  
  // Filter methods
  updateFilters: (newFilters: Record<string, any>) => void
  resetFilters: () => void
  
  // Pagination methods
  changePage: (page: number) => void
  changePageSize: (size: number) => void
  
  // Utility methods
  clearCache: () => void
  getCurrentQuery?: () => Record<string, any>
}

// ===== DATA FETCHING TYPES =====

export interface DataFetchingOptions {
  transformItem?: (item: any) => any
  beforeSubmit?: (data: any) => any
  afterFetch?: (data: any) => any
}

export interface DataFetchingResult<T = any> {
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  pagination: Ref<PaginationMeta>
  fetchData: (params?: Record<string, any>) => Promise<{ data: T[]; meta: PaginationMeta }>
  refresh: () => Promise<{ data: T[]; meta: PaginationMeta }>
}

// ===== DATA FILTERING TYPES =====

export interface DataFilteringOptions {
  defaultFilters?: Record<string, any>
  debounceTime?: number
  resetPageOnFilter?: boolean
}

export interface DataFilteringResult {
  filters: Ref<Record<string, any>>
  updateFilters: (newFilters: Record<string, any>) => void
  resetFilters: () => void
  debouncedUpdateFilters: (newFilters: Record<string, any>) => void
}

// ===== DATA PAGINATION TYPES =====

export interface DataPaginationOptions {
  pageSize?: number
  resetPageOnFilter?: boolean
  resetPageOnSort?: boolean
}

export interface DataPaginationResult {
  pagination: Ref<PaginationMeta>
  changePage: (page: number) => void
  changePageSize: (size: number) => void
  resetToFirstPage: () => void
}

// ===== DATA CACHING TYPES =====

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

// ===== CRUD DATA TABLE TYPES =====

export interface CrudEndpoints {
  list: string
  create: string
  update: (id: number) => string
  delete: (id: number) => string
}

export interface CrudModals {
  create: boolean
  edit: boolean
  delete: boolean
  view: boolean
}

export interface CrudState<T = any> {
  selectedItems: Ref<T[]>
  selectedItem: Ref<T | null>
  apiErrors: Ref<Record<string, string>>
  modals: Ref<CrudModals>
}

export interface CrudComputedProps {
  hasSelection: ComputedRef<boolean>
  isAllSelected: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
}

export interface CrudDataTableOptions<T = any> extends Omit<BaseDataTableOptions, 'enableUrlSync'> {
  endpoints: CrudEndpoints
  resourceName?: string
}

export interface CrudDataTableResult<T = any> extends ReturnType<typeof useBaseDataTable<T>>, CrudComputedProps {
  // CRUD state as refs
  selectedItems: Ref<T[]>
  selectedItem: Ref<T | null>
  apiErrors: Ref<Record<string, string>>
  modals: Ref<CrudModals>
  // CRUD operations
  createItem: (data: any) => Promise<any>
  updateItem: (data: any) => Promise<any>
  deleteItem: () => Promise<boolean>
  deleteSelectedItems: () => Promise<boolean>
  
  // Selection handlers
  toggleSelectAll: () => void
  toggleSelectItem: (item: T) => void
  
  // Modal handlers
  openCreateModal: () => void
  closeCreateModal: () => void
  openEditModal: (item: T) => void
  closeEditModal: () => void
  openDeleteModal: (item: T) => void
  closeDeleteModal: () => void
  openViewModal: (item: T) => void
  closeViewModal: () => void
  
  // Error handlers
  handleApiError: (error: any) => void
  clearApiErrors: () => void
}

// Forward declaration for useBaseDataTable function
declare function useBaseDataTable<T = any>(endpoint: string, options?: BaseDataTableOptions): BaseDataTableResult<T>
