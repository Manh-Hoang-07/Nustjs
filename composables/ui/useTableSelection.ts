import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { TableSelectionOptions, TableSelectionResult } from './ui.types'
import { 
  createTableSelectionOptions, 
  getItemKey, 
  isItemSelected, 
  toggleUiItemSelection, 
  selectAllItems 
} from './ui.utils'

// ===== COMPOSABLE =====

/**
 * Composable để quản lý selection trong table
 */
export default function useTableSelection<T = any>(
  items: Ref<T[]> = ref([]), 
  options: TableSelectionOptions<T> = {}
): TableSelectionResult<T> {
  const selectionOptions = createTableSelectionOptions(options)
  const {
    keyField,
    multiSelect,
    onSelectionChange
  } = selectionOptions

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
    const result = toggleUiItemSelection(
      item, 
      selectedItems.value, 
      selectedKeys.value, 
      keyField!, 
      multiSelect!
    )
    
    selectedItems.value = result.selectedItems
    selectedKeys.value = result.selectedKeys

    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const selectAll = (): void => {
    const result = selectAllItems(
      items.value, 
      selectedItems.value, 
      selectedKeys.value, 
      keyField!
    )
    
    selectedItems.value = result.selectedItems
    selectedKeys.value = result.selectedKeys

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
    return isItemSelected(item, selectedKeys.value, keyField!)
  }

  const getSelectedKeys = (): (string | number)[] => {
    return Array.from(selectedKeys.value)
  }

  const selectByKeys = (keys: (string | number)[]): void => {
    const itemsToSelect = items.value.filter(item => 
      keys.includes(getItemKey(item, keyField!))
    )
    selectedItems.value = itemsToSelect
    selectedKeys.value = new Set(keys)
    
    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(selectedItems.value)
    }
  }

  const removeFromSelection = (item: T): void => {
    const key = getItemKey(item, keyField!)
    selectedItems.value = selectedItems.value.filter(i => 
      getItemKey(i, keyField!) !== key
    )
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
