import { ref, reactive, computed, type Ref, type ComputedRef } from 'vue'
import { useGlobalApiClient } from '../api/useApiClient'
import { useBaseDataTable } from './useBaseDataTable'
import type { 
  BaseDataTableOptions, 
  CrudEndpoints, 
  CrudModals, 
  CrudState, 
  CrudComputedProps, 
  CrudDataTableOptions, 
  CrudDataTableResult 
} from './data.types'
import { 
  extractValidationErrors, 
  isAllSelected, 
  toggleItemSelection, 
  toggleAllSelection 
} from './data.utils'

// ===== COMPOSABLE =====

/**
 * Composable kế thừa từ useBaseDataTable và thêm các chức năng CRUD
 * Dành cho các trang admin cần quản lý dữ liệu với các thao tác Create, Read, Update, Delete
 */
export function useCrudDataTable<T = any>(options: CrudDataTableOptions<T>): CrudDataTableResult<T> {
  const { apiClient } = useGlobalApiClient()
  
  const { 
    endpoints, 
    resourceName = 'dữ liệu',
    ...baseOptions 
  } = options

  // Thiết lập các giá trị mặc định cho base options
  // enableUrlSync luôn bật cho CRUD tables, không cần tham số
  const optimizedBaseOptions = {
    enableUrlSync: true, // Hard-coded: CRUD tables luôn cần URL sync
    defaultFilters: {
      search: '',
      status: '',
      date_from: '',
      date_to: '',
      sort_by: 'created_at:desc'
    },
    filterKeys: ['search', 'status', 'date_from', 'date_to', 'sort_by'],
    sortKeys: ['sort_by', 'sort_order'],
    ...baseOptions
  }

  // Sử dụng base data table với options đã tối ưu
  const baseDataTable = useBaseDataTable<T>(endpoints.list, optimizedBaseOptions)

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
      isAllSelected(baseDataTable.items.value, selectedItems.value)
    ),
    selectedCount: computed(() => selectedItems.value.length)
  }

  // API error handling
  const errorHandlers = {
    handleApiError(error: any): void {
      const validationErrors = extractValidationErrors(error)
      Object.assign(apiErrors.value, validationErrors)
    },

    clearApiErrors(): void {
      Object.keys(apiErrors.value).forEach(key => delete apiErrors.value[key])
    }
  }

  // Modal handlers
  const modalHandlers = {
    openCreateModal(): void {
      modals.value.create = true
    },

    closeCreateModal(): void {
      modals.value.create = false
      errorHandlers.clearApiErrors()
    },

    openEditModal(item: T): void {
      selectedItem.value = item
      modals.value.edit = true
    },

    closeEditModal(): void {
      modals.value.edit = false
      selectedItem.value = null
      errorHandlers.clearApiErrors()
    },

    openDeleteModal(item: T): void {
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
      selectedItems.value = toggleAllSelection(baseDataTable.items.value, selectedItems.value)
    },

    toggleSelectItem(item: T): void {
      selectedItems.value = toggleItemSelection(item, selectedItems.value)
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