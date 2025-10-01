import { ref, reactive, computed, type Ref, type ComputedRef } from 'vue'
import { useApiClient } from '../api/useApiClient'
import { useBaseDataTable, type BaseDataTableOptions, type PaginationMeta } from './useBaseDataTable'

// ===== TYPES =====

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

export interface CrudDataTableOptions<T = any> extends BaseDataTableOptions {
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

// ===== COMPOSABLE =====

/**
 * Composable kế thừa từ useBaseDataTable và thêm các chức năng CRUD
 * Dành cho các trang admin cần quản lý dữ liệu với các thao tác Create, Read, Update, Delete
 */
export function useCrudDataTable<T = any>(options: CrudDataTableOptions<T>): CrudDataTableResult<T> {
  const { apiClient } = useApiClient()
  
  const { 
    endpoints, 
    resourceName = 'dữ liệu',
    ...baseOptions 
  } = options

  // Sử dụng base data table
  const baseDataTable = useBaseDataTable<T>(endpoints.list, baseOptions)

  // CRUD state
  const selectedItems = ref([]) as Ref<T[]>
  const selectedItem = ref(null) as Ref<T | null>
  const apiErrors = ref({}) as Ref<Record<string, string>>
  const modals = ref({
    create: false,
    edit: false,
    delete: false,
    view: false
  }) as Ref<CrudModals>

  // Computed properties cho CRUD
  const crudComputed: CrudComputedProps = {
    hasSelection: computed(() => selectedItems.value.length > 0),
    isAllSelected: computed(() => 
      baseDataTable.items.value.length > 0 && selectedItems.value.length === baseDataTable.items.value.length
    ),
    selectedCount: computed(() => selectedItems.value.length)
  }

  // API error handling
  const errorHandlers = {
    handleApiError(error: any): void {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors
        
        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            apiErrors.value[field] = errors[field][0]
          } else {
            apiErrors.value[field] = errors[field]
          }
        }
      }
    },

    clearApiErrors(): void {
      Object.keys(apiErrors.value).forEach(key => delete apiErrors.value[key])
    }
  }

  // Modal handlers
  const modalHandlers = {
    openCreateModal(): void {
      console.log('modalHandlers.openCreateModal called')
      modals.value.create = true
    },

    closeCreateModal(): void {
      modals.value.create = false
      errorHandlers.clearApiErrors()
    },

    openEditModal(item: T): void {
      console.log('modalHandlers.openEditModal called with item:', item)
      selectedItem.value = item
      modals.value.edit = true
    },

    closeEditModal(): void {
      modals.value.edit = false
      selectedItem.value = null
      errorHandlers.clearApiErrors()
    },

    openDeleteModal(item: T): void {
      console.log('modalHandlers.openDeleteModal called with item:', item)
      selectedItem.value = item
      modals.value.delete = true
    },

    closeDeleteModal(): void {
      modals.value.delete = false
      selectedItem.value = null
    },

    openViewModal(item: T): void {
      selectedItem.value = item
      modals.value.view = true
    },

    closeViewModal(): void {
      modals.value.view = false
      selectedItem.value = null
    }
  }

  // Selection handlers
  const selectionHandlers = {
    toggleSelectAll(): void {
      if (selectedItems.value.length === baseDataTable.items.value.length) {
        selectedItems.value = []
      } else {
        selectedItems.value = [...baseDataTable.items.value]
      }
    },

    toggleSelectItem(item: T): void {
      const index = selectedItems.value.findIndex(i => (i as any).id === (item as any).id)
      if (index === -1) {
        selectedItems.value.push(item)
      } else {
        selectedItems.value.splice(index, 1)
      }
    }
  }

  // CRUD operations
  const crudOperations = {
    async createItem(data: any): Promise<any> {
      baseDataTable.loading.value = true
      errorHandlers.clearApiErrors()
      
      try {
        const transformedData = baseOptions.beforeSubmit ? baseOptions.beforeSubmit(data) : data
        const response = await apiClient.post(endpoints.create, transformedData)
        
        await baseDataTable.fetchData({ page: baseDataTable.pagination.value.current_page })
        modalHandlers.closeCreateModal()
        
        return response.data
      } catch (error) {
        console.error(`Error creating ${resourceName}:`, error)
        errorHandlers.handleApiError(error)
        return null
      } finally {
        baseDataTable.loading.value = false
      }
    },

    async updateItem(data: any): Promise<any> {
      if (!selectedItem.value) return null
      
      baseDataTable.loading.value = true
      errorHandlers.clearApiErrors()
      
      try {
        const transformedData = baseOptions.beforeSubmit ? baseOptions.beforeSubmit(data) : data
        const response = await apiClient.put(
          endpoints.update((selectedItem.value as any).id), 
          transformedData
        )
        
        await baseDataTable.fetchData({ page: baseDataTable.pagination.value.current_page })
        modalHandlers.closeEditModal()
        
        return response.data
      } catch (error) {
        console.error(`Error updating ${resourceName}:`, error)
        errorHandlers.handleApiError(error)
        return null
      } finally {
        baseDataTable.loading.value = false
      }
    },

    async deleteItem(): Promise<boolean> {
      if (!selectedItem.value) return false
      
      baseDataTable.loading.value = true
      
      try {
        await apiClient.delete(endpoints.delete((selectedItem.value as any).id))
        await baseDataTable.fetchData({ page: baseDataTable.pagination.value.current_page })
        modalHandlers.closeDeleteModal()
        return true
      } catch (error) {
        console.error(`Error deleting ${resourceName}:`, error)
        return false
      } finally {
        baseDataTable.loading.value = false
      }
    },

    async deleteSelectedItems(): Promise<boolean> {
      if (!selectedItems.value.length) return false
      
      baseDataTable.loading.value = true
      
      try {
        await Promise.all(
          selectedItems.value.map(item => 
            apiClient.delete(endpoints.delete((item as any).id))
          )
        )
        
        await baseDataTable.fetchData({ page: baseDataTable.pagination.value.current_page })
        selectedItems.value = []
        
        return true
      } catch (error) {
        console.error(`Error deleting ${resourceName}:`, error)
        return false
      } finally {
        baseDataTable.loading.value = false
      }
    }
  }

  return {
    // Base data table functionality
    ...baseDataTable,
    
    // CRUD state - return refs directly
    selectedItems,
    selectedItem,
    apiErrors,
    modals,
    
    // CRUD computed
    ...crudComputed,
    
    // CRUD operations
    ...crudOperations,
    
    // Selection handlers
    ...selectionHandlers,
    
    // Modal handlers
    ...modalHandlers,
    
    // Error handlers
    ...errorHandlers
  }
}