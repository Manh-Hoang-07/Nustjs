import { ref, reactive, onMounted, computed } from 'vue'
import { useApiClient } from '../api/useApiClient.js'

/**
 * Composable để quản lý các thao tác CRUD chung cho tất cả các menu admin
 * @param {Object} options - Các tùy chọn
 * @param {Object} options.endpoints - Các endpoint API
 * @param {String} options.resourceName - Tên resource (vd: 'người dùng', 'sản phẩm')
 * @param {Function} options.transformItem - Hàm biến đổi dữ liệu trước khi hiển thị
 * @param {Function} options.beforeSubmit - Hàm xử lý dữ liệu trước khi gửi lên server
 * @param {Function} options.afterFetch - Hàm xử lý dữ liệu sau khi lấy từ server
 * @param {Object} options.defaultFilters - Filters mặc định
 * @param {number} options.debounceTime - Thời gian debounce cho search (ms)
 * @returns {Object} - Các state và methods cho CRUD
 */
export default function useCrudAdmin(options) {
  const { apiClient: api } = useApiClient()
  
  // Destructure options với defaults
  const { 
    endpoints, 
    resourceName = 'dữ liệu',
    transformItem = (item) => item,
    beforeSubmit = (data) => data,
    afterFetch = (data) => data,
    defaultFilters = {},
    debounceTime = 300
  } = options

  // State management
  const state = reactive({
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

  // Computed properties
  const computedProps = {
    hasItems: computed(() => state.items.length > 0),
    isEmpty: computed(() => !state.loading && state.items.length === 0),
    hasSelection: computed(() => state.selectedItems.length > 0),
    isAllSelected: computed(() => 
      state.items.length > 0 && state.selectedItems.length === state.items.length
    ),
    selectedCount: computed(() => state.selectedItems.length)
  }

  // Debounced search
  let searchTimeout = null
  const debouncedSearch = (callback) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(callback, debounceTime)
  }

  // CRUD operations
  const crudOperations = {
    async fetchItems(page = 1) {
      state.loading = true
      try {
        const params = { ...state.filters, page }
        const response = await api.get(endpoints.list, { params })
        
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

    async createItem(data) {
      state.loading = true
      this.clearApiErrors()
      
      try {
        const transformedData = beforeSubmit(data)
        const response = await api.post(endpoints.create, transformedData)
        
        await this.fetchItems(state.pagination.current_page)
        this.closeCreateModal()
        
        return response.data
      } catch (error) {
        console.error(`Error creating ${resourceName}:`, error)
        this.handleApiError(error)
        return null
      } finally {
        state.loading = false
      }
    },

    async updateItem(data) {
      if (!state.selectedItem) return null
      
      state.loading = true
      this.clearApiErrors()
      
      try {
        const transformedData = beforeSubmit(data)
        const response = await api.post(
          endpoints.update(state.selectedItem.id), 
          transformedData
        )
        
        await this.fetchItems(state.pagination.current_page)
        this.closeEditModal()
        
        return response.data
      } catch (error) {
        console.error(`Error updating ${resourceName}:`, error)
        this.handleApiError(error)
        return null
      } finally {
        state.loading = false
      }
    },

    async deleteItem() {
      if (!state.selectedItem) return false
      
      state.loading = true
      
      try {
        await api.delete(endpoints.delete(state.selectedItem.id))
        await this.fetchItems(state.pagination.current_page)
        this.closeDeleteModal()
        return true
      } catch (error) {
        console.error(`Error deleting ${resourceName}:`, error)
        return false
      } finally {
        state.loading = false
      }
    },

    async deleteSelectedItems() {
      if (!state.selectedItems.length) return false
      
      state.loading = true
      
      try {
        await Promise.all(
          state.selectedItems.map(item => 
            api.delete(endpoints.delete(item.id))
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
    toggleSelectAll() {
      if (state.selectedItems.length === state.items.length) {
        state.selectedItems = []
      } else {
        state.selectedItems = [...state.items]
      }
    },

    toggleSelectItem(item) {
      const index = state.selectedItems.findIndex(i => i.id === item.id)
      if (index === -1) {
        state.selectedItems.push(item)
      } else {
        state.selectedItems.splice(index, 1)
      }
    }
  }

  // Modal handlers
  const modalHandlers = {
    openCreateModal() {
      state.modals.create = true
    },

    closeCreateModal() {
      state.modals.create = false
      this.clearApiErrors()
    },

    openEditModal(item) {
      state.selectedItem = item
      state.modals.edit = true
    },

    closeEditModal() {
      state.modals.edit = false
      state.selectedItem = null
      this.clearApiErrors()
    },

    openDeleteModal(item) {
      state.selectedItem = item
      state.modals.delete = true
    },

    closeDeleteModal() {
      state.modals.delete = false
      state.selectedItem = null
    },

    openViewModal(item) {
      state.selectedItem = item
      state.modals.view = true
    },

    closeViewModal() {
      state.modals.view = false
      state.selectedItem = null
    }
  }

  // API error handling
  const errorHandlers = {
    handleApiError(error) {
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

    clearApiErrors() {
      Object.keys(state.apiErrors).forEach(key => delete state.apiErrors[key])
    }
  }

  // Pagination and filter handlers
  const paginationHandlers = {
    changePage(url) {
      if (!url) return
      
      const urlObj = new URL(url)
      const page = urlObj.searchParams.get('page')
      crudOperations.fetchItems(page)
    },

    applyFilters() {
      debouncedSearch(() => {
        crudOperations.fetchItems(1)
      })
    },

    resetFilters() {
      Object.assign(state.filters, {
        search: '',
        page: 1,
        ...defaultFilters
      })
      crudOperations.fetchItems(1)
    }
  }

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