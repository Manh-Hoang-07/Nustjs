import { ref, computed, type Ref, type ComputedRef } from 'vue'

// ===== TYPES =====

interface TableSelectionOptions<T = any> {
  keyField?: string
  multiSelect?: boolean
  onSelectionChange?: (selectedItems: T[]) => void
}

interface TableSelectionResult<T = any> {
  // State
  selectedItems: Ref<T[]>
  selectedKeys: Ref<Set<string | number>>
  
  // Computed
  hasSelection: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
  isAllSelected: ComputedRef<boolean>
  isIndeterminate: ComputedRef<boolean>
  
  // Methods
  selectItem: (item: T) => void
  selectAll: () => void
  clearSelection: () => void
  isSelected: (item: T) => boolean
  getSelectedKeys: () => (string | number)[]
  selectByKeys: (keys: (string | number)[]) => void
  removeFromSelection: (item: T) => void
}

// ===== COMPOSABLE =====

/**
 * Composable để quản lý selection trong table
 */
export default function useTableSelection<T = any>(
  items: Ref<T[]> = ref([]), 
  options: TableSelectionOptions<T> = {}
): TableSelectionResult<T> {
  const {
    keyField = 'id',
    multiSelect = true,
    onSelectionChange = null
  } = options

  // State
  const selectedItems: Ref<T[]> = ref([])
  const selectedKeys: Ref<Set<string | number>> = ref(new Set())

  // Computed
  const hasSelection: ComputedRef<boolean> = computed(() => selectedItems.value.length > 0)
  const selectedCount: ComputedRef<number> = computed(() => selectedItems.value.length)
  const isAllSelected: ComputedRef<boolean> = computed(() => {
    if (!items.value || items.value.length === 0) return false
    return selectedItems.value.length === items.value.length
  })
  const isIndeterminate: ComputedRef<boolean> = computed(() => {
    return selectedItems.value.length > 0 && selectedItems.value.length < items.value.length
  })

  // Methods
  const selectItem = (item: T): void => {
    const key = (item as any)[keyField]
    
    if (!multiSelect) {
      // Single select mode
      selectedItems.value = [item]
      selectedKeys.value = new Set([key])
    } else {
      // Multi select mode
      if (selectedKeys.value.has(key)) {
        // Deselect
        selectedItems.value = selectedItems.value.filter(i => (i as any)[keyField] !== key)
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

  const selectAll = (): void => {
    if (isAllSelected.value) {
      // Deselect all
      selectedItems.value = []
      selectedKeys.value.clear()
    } else {
      // Select all
      selectedItems.value = [...items.value]
      selectedKeys.value = new Set(items.value.map(item => (item as any)[keyField]))
    }

    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const clearSelection = (): void => {
    selectedItems.value = []
    selectedKeys.value.clear()
    
    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const isSelected = (item: T): boolean => {
    return selectedKeys.value.has((item as any)[keyField])
  }

  const getSelectedKeys = (): (string | number)[] => {
    return Array.from(selectedKeys.value)
  }

  const selectByKeys = (keys: (string | number)[]): void => {
    const itemsToSelect = items.value.filter(item => keys.includes((item as any)[keyField]))
    selectedItems.value = itemsToSelect
    selectedKeys.value = new Set(keys)
    
    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const removeFromSelection = (item: T): void => {
    const key = (item as any)[keyField]
    selectedItems.value = selectedItems.value.filter(i => (i as any)[keyField] !== key)
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
