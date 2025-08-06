import { ref, computed } from 'vue'

/**
 * Composable để quản lý selection trong table
 * @param {Array} items - Danh sách items
 * @param {Object} options - Các tùy chọn
 * @param {string} options.keyField - Field dùng làm key (mặc định: 'id')
 * @param {boolean} options.multiSelect - Cho phép chọn nhiều (mặc định: true)
 * @param {Function} options.onSelectionChange - Callback khi selection thay đổi
 * @returns {Object} - Các state và methods cho table selection
 */
export default function useTableSelection(items = [], options = {}) {
  const {
    keyField = 'id',
    multiSelect = true,
    onSelectionChange = null
  } = options

  // State
  const selectedItems = ref([])
  const selectedKeys = ref(new Set())

  // Computed
  const hasSelection = computed(() => selectedItems.value.length > 0)
  const selectedCount = computed(() => selectedItems.value.length)
  const isAllSelected = computed(() => {
    if (!items.value || items.value.length === 0) return false
    return selectedItems.value.length === items.value.length
  })
  const isIndeterminate = computed(() => {
    return selectedItems.value.length > 0 && selectedItems.value.length < items.value.length
  })

  // Methods
  const selectItem = (item) => {
    const key = item[keyField]
    
    if (!multiSelect) {
      // Single select mode
      selectedItems.value = [item]
      selectedKeys.value = new Set([key])
    } else {
      // Multi select mode
      if (selectedKeys.value.has(key)) {
        // Deselect
        selectedItems.value = selectedItems.value.filter(i => i[keyField] !== key)
        selectedKeys.value.delete(key)
      } else {
        // Select
        selectedItems.value.push(item)
        selectedKeys.value.add(key)
      }
    }

    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const selectAll = () => {
    if (isAllSelected.value) {
      // Deselect all
      selectedItems.value = []
      selectedKeys.value.clear()
    } else {
      // Select all
      selectedItems.value = [...items.value]
      selectedKeys.value = new Set(items.value.map(item => item[keyField]))
    }

    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const clearSelection = () => {
    selectedItems.value = []
    selectedKeys.value.clear()
    
    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const isSelected = (item) => {
    return selectedKeys.value.has(item[keyField])
  }

  const getSelectedKeys = () => {
    return Array.from(selectedKeys.value)
  }

  const selectByKeys = (keys) => {
    const itemsToSelect = items.value.filter(item => keys.includes(item[keyField]))
    selectedItems.value = itemsToSelect
    selectedKeys.value = new Set(keys)
    
    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const removeFromSelection = (item) => {
    const key = item[keyField]
    selectedItems.value = selectedItems.value.filter(i => i[keyField] !== key)
    selectedKeys.value.delete(key)
    
    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  return {
    // State
    selectedItems,
    selectedKeys,
    
    // Computed
    hasSelection,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    
    // Methods
    selectItem,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedKeys,
    selectByKeys,
    removeFromSelection
  }
} 