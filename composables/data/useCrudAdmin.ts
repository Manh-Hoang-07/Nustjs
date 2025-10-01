import { ref, reactive, onMounted, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useApiClient } from '../api/useApiClient'
import useUrlState from '../utils/useUrlState'

// ===== TYPES =====

interface CrudEndpoints {
  list: string
  create: string
  update: (id: number) => string
  delete: (id: number) => string
}

interface PaginationMeta {
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

interface CrudFilters {
  search: string
  page: number
  [key: string]: any
}

interface CrudModals {
  create: boolean
  edit: boolean
  delete: boolean
  view: boolean
}

interface CrudState<T = any> {
  items: T[]
  selectedItems: T[]
  selectedItem: T | null
  loading: boolean
  apiErrors: Record<string, string>
  pagination: PaginationMeta
  filters: CrudFilters
  modals: CrudModals
}

interface CrudOptions<T = any> {
  endpoints: CrudEndpoints
  resourceName?: string
  transformItem?: (item: any) => T
  beforeSubmit?: (data: any) => any
  afterFetch?: (data: any) => any
  defaultFilters?: Partial<CrudFilters>
  debounceTime?: number
}

interface CrudComputedProps {
  hasItems: ComputedRef<boolean>
  isEmpty: ComputedRef<boolean>
  hasSelection: ComputedRef<boolean>
  isAllSelected: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
}

interface CrudResult<T = any> extends CrudState<T>, CrudComputedProps {
  // CRUD operations
  fetchItems: (page?: number) => Promise<any>
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
  
  // Pagination handlers
  changePage: (url: string) => void
  applyFilters: () => void
  resetFilters: () => void
  
  // Error handlers
  handleApiError: (error: any) => void
  clearApiErrors: () => void
}

// ===== COMPOSABLE =====

/**
 * Composable để quản lý các thao tác CRUD chung cho tất cả các menu admin
 */
export function useCrudAdmin<T = any>(options: CrudOptions<T>): CrudResult<T> {
  const { apiClient } = useApiClient()
  
  // Destructure options với defaults
  const { 
    endpoints, 
    resourceName = 'dữ liệu',
    transformItem = (item: any) => item,
    beforeSubmit = (data: any) => data,
    afterFetch = (data: any) => data,
    defaultFilters = {},
    debounceTime = 300
  } = options

  // State management
  const state: CrudState<T> = reactive({
    items: [],
    selectedItems: [],
    selectedItem: null,
    loading: false,
    apiErrors: {},
    pagination: {
      current_page: 1,
      from: 0,
      to: 0,
      total: 0,
      per_page: 10,
      last_page: 1,
      links: []
    },
    filters: {
      search: '',
      page: 1,
      ...defaultFilters
    },
    modals: {
      create: false,
      edit: false,
      delete: false,
      view: false
    }
  })

  // URL state management
  const urlFilters = ref({ ...state.filters })
  const urlPagination = ref({
    currentPage: state.pagination.current_page,
    perPage: state.pagination.per_page
  })
  const urlSort = ref({})
  
  const urlState = useUrlState(
    urlFilters,
    urlPagination,
    urlSort,
    () => {}, // No auto fetch
    {
      filterKeys: ['search', 'status', 'date_from', 'date_to', ...Object.keys(defaultFilters)],
      debounceMs: debounceTime,
      resetPageOnFilter: true,
      resetPageOnSort: false
    }
  )

  // Computed properties
  const computedProps: CrudComputedProps = {
    hasItems: computed(() => state.items.length > 0),
    isEmpty: computed(() => !state.loading && state.items.length === 0),
    hasSelection: computed(() => state.selectedItems.length > 0),
    isAllSelected: computed(() => 
      state.items.length > 0 && state.selectedItems.length === state.items.length
    ),
    selectedCount: computed(() => state.selectedItems.length)
  }

  // Debounced search
  let searchTimeout: NodeJS.Timeout | null = null
  const debouncedSearch = (callback: () => void) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(callback, debounceTime)
  }

  // API error handling
  const errorHandlers = {
    handleApiError(error: any): void {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors
        
        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            state.apiErrors[field] = errors[field][0]
          } else {
            state.apiErrors[field] = errors[field]
          }
        }
      }
    },

    clearApiErrors(): void {
      Object.keys(state.apiErrors).forEach(key => delete state.apiErrors[key])
    }
  }

  // Modal handlers
  const modalHandlers = {
    openCreateModal(): void {
      state.modals.create = true
    },

    closeCreateModal(): void {
      state.modals.create = false
      errorHandlers.clearApiErrors()
    },

    openEditModal(item: T): void {
      state.selectedItem = item
      state.modals.edit = true
    },

    closeEditModal(): void {
      state.modals.edit = false
      state.selectedItem = null
      errorHandlers.clearApiErrors()
    },

    openDeleteModal(item: T): void {
      state.selectedItem = item
      state.modals.delete = true
    },

    closeDeleteModal(): void {
      state.modals.delete = false
      state.selectedItem = null
    },

    openViewModal(item: T): void {
      state.selectedItem = item
      state.modals.view = true
    },

    closeViewModal(): void {
      state.modals.view = false
      state.selectedItem = null
    }
  }

  // CRUD operations
  const crudOperations = {
    async fetchItems(page: number = 1): Promise<any> {
      state.loading = true
      try {
        const params = { ...state.filters, page }
        const response = await apiClient.get(endpoints.list, { params })
        
        // Transform items
        if (response.data.data) {
          state.items = response.data.data.map(transformItem)
        }
        
        // Update pagination
        if (response.data.meta) {
          Object.assign(state.pagination, response.data.meta)
        }
        
        // After fetch hook
        afterFetch(response.data)
        
        return response.data
      } catch (error) {
        console.error(`Error fetching ${resourceName}:`, error)
        return null
      } finally {
        state.loading = false
      }
    },

    async createItem(data: any): Promise<any> {
      state.loading = true
      errorHandlers.clearApiErrors()
      
      try {
        const transformedData = beforeSubmit(data)
        const response = await apiClient.post(endpoints.create, transformedData)
        
        await this.fetchItems(state.pagination.current_page)
        modalHandlers.closeCreateModal()
        
        return response.data
      } catch (error) {
        console.error(`Error creating ${resourceName}:`, error)
        errorHandlers.handleApiError(error)
        return null
      } finally {
        state.loading = false
      }
    },

    async updateItem(data: any): Promise<any> {
      if (!state.selectedItem) return null
      
      state.loading = true
      errorHandlers.clearApiErrors()
      
      try {
        const transformedData = beforeSubmit(data)
        const response = await apiClient.post(
          endpoints.update((state.selectedItem as any).id), 
          transformedData
        )
        
        await this.fetchItems(state.pagination.current_page)
        modalHandlers.closeEditModal()
        
        return response.data
      } catch (error) {
        console.error(`Error updating ${resourceName}:`, error)
        errorHandlers.handleApiError(error)
        return null
      } finally {
        state.loading = false
      }
    },

    async deleteItem(): Promise<boolean> {
      if (!state.selectedItem) return false
      
      state.loading = true
      
      try {
        await apiClient.delete(endpoints.delete((state.selectedItem as any).id))
        await this.fetchItems(state.pagination.current_page)
        modalHandlers.closeDeleteModal()
        return true
      } catch (error) {
        console.error(`Error deleting ${resourceName}:`, error)
        return false
      } finally {
        state.loading = false
      }
    },

    async deleteSelectedItems(): Promise<boolean> {
      if (!state.selectedItems.length) return false
      
      state.loading = true
      
      try {
        await Promise.all(
          state.selectedItems.map(item => 
            apiClient.delete(endpoints.delete((item as any).id))
          )
        )
        
        await this.fetchItems(state.pagination.current_page)
        state.selectedItems = []
        
        return true
      } catch (error) {
        console.error(`Error deleting ${resourceName}:`, error)
        return false
      } finally {
        state.loading = false
      }
    }
  }

  // Selection handlers
  const selectionHandlers = {
    toggleSelectAll(): void {
      if (state.selectedItems.length === state.items.length) {
        state.selectedItems = []
      } else {
        state.selectedItems = [...state.items]
      }
    },

    toggleSelectItem(item: T): void {
      const index = state.selectedItems.findIndex(i => (i as any).id === (item as any).id)
      if (index === -1) {
        state.selectedItems.push(item)
      } else {
        state.selectedItems.splice(index, 1)
      }
    }
  }

  // Pagination and filter handlers
  const paginationHandlers = {
    changePage(url: string): void {
      if (!url) return
      
      const urlObj = new URL(url)
      const page = urlObj.searchParams.get('page')
      const pageNum = parseInt(page || '1')
      
      // Update URL state
      urlPagination.value.currentPage = pageNum
      
      // Update local state
      state.filters.page = pageNum
      state.pagination.current_page = pageNum
      
      crudOperations.fetchItems(pageNum)
    },

    applyFilters(): void {
      debouncedSearch(() => {
        // Update URL state with current filters
        urlFilters.value = { ...state.filters, page: 1 }
        urlPagination.value.currentPage = 1
        
        // Update local state
        state.filters.page = 1
        state.pagination.current_page = 1
        crudOperations.fetchItems(1)
      })
    },

    resetFilters(): void {
      const resetFilters = {
        search: '',
        page: 1,
        ...defaultFilters
      }
      
      // Update URL state
      urlFilters.value = resetFilters
      urlPagination.value.currentPage = 1
      
      // Update local state
      Object.assign(state.filters, resetFilters)
      state.pagination.current_page = 1
      
      crudOperations.fetchItems(1)
    }
  }

  // Watch URL state changes
  watch(() => urlFilters.value, (newFilters) => {
    // Sync URL filters to local state
    Object.assign(state.filters, newFilters)
  }, { deep: true })

  watch(() => urlPagination.value, (newPagination) => {
    // Sync URL pagination to local state
    state.pagination.current_page = newPagination.currentPage
    state.pagination.per_page = newPagination.perPage
    state.filters.page = newPagination.currentPage
  }, { deep: true })

  watch(() => state.filters, (newFilters) => {
    // Sync local filters to URL state
    urlFilters.value = { ...newFilters }
  }, { deep: true })

  watch(() => state.pagination, (newPagination) => {
    // Sync local pagination to URL state
    urlPagination.value.currentPage = newPagination.current_page
    urlPagination.value.perPage = newPagination.per_page
  }, { deep: true })

  // Initialize
  onMounted(() => {
    crudOperations.fetchItems()
  })

  return {
    // State
    ...state,
    
    // Computed
    ...computedProps,
    
    // CRUD operations
    ...crudOperations,
    
    // Selection handlers
    ...selectionHandlers,
    
    // Modal handlers
    ...modalHandlers,
    
    // Pagination handlers
    ...paginationHandlers,
    
    // Error handlers
    ...errorHandlers
  }
}
