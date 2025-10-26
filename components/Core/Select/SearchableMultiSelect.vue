<template>
  <div class="searchable-multi-select relative">
    <!-- Search input with single-line summary (ellipsis if overflow) -->
    <div class="relative">
      <div
        class="w-full pl-10 pr-3 py-2.5 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 flex items-center"
        :class="[
          error ? 'border-red-500' : 'border-gray-300',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        ]"
        @click="focusInput"
      >
        <span v-if="!showDropdown && selectedItems.length > 0" class="text-sm text-gray-700 truncate">
          {{ selectedItems.length }} đã chọn
        </span>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.backspace="handleBackspace"
          :placeholder="placeholder"
          :disabled="disabled"
          class="flex-1 min-w-0 outline-none border-0 p-0 bg-transparent text-sm placeholder-gray-400"
        />
      </div>

      <!-- Search icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    </div>
    
    <!-- Dropdown -->
    <div 
      v-if="showDropdown" 
      class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto"
      @mousedown.prevent="onDropdownMouseDown"
      @mouseup="onDropdownMouseUp"
    >

      <div 
        v-for="option in combinedOptions" 
        :key="option.value"
        @click="onOptionRowClick(option)"
        class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center justify-between transition-colors"
      >
        <span class="text-gray-700">{{ option.label }}</span>
        <button
          type="button"
          class="text-sm px-2 py-1 rounded-md border transition-colors"
          :class="isSelected(option) ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-blue-600 border-blue-200 hover:bg-blue-50'"
          @click.stop="handleOptionAction(option)"
        >
          {{ isSelected(option) ? 'Xóa' : 'Chọn' }}
        </button>
      </div>
      
      <!-- No results -->
      <div v-if="searchQuery.length > 0 && filteredOptions.length === 0 && !loading" class="px-4 py-3 text-gray-500 text-center">
        Không tìm thấy kết quả
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { debounce } from '@/utils/debounce'
import { useApiClient } from '@/composables/api/useApiClient'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Tìm kiếm...'
  },
  searchApi: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  minSearchLength: {
    type: Number,
    default: 2
  },
  labelField: {
    type: String,
    default: 'title'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])



const searchQuery = ref('')
const showDropdown = ref(false)
const options = ref([])
const loading = ref(false)
const selectedItems = ref([])
const searchInputRef = ref(null)
const selectedSummary = computed(() => selectedItems.value.map(i => i.label).join(', '))

// Combine selected and filtered options into a single list
const combinedOptions = computed(() => {
  const selectedMap = new Map(selectedItems.value.map(i => [i.value, i]))
  const filtered = filteredOptions.value
  const combined = []
  // Ensure selected appear first (and unique)
  selectedItems.value.forEach(item => {
    combined.push(item)
  })
  filtered.forEach(opt => {
    if (!selectedMap.has(opt.value)) combined.push(opt)
  })
  return combined
})

// Function to get label based on labelField prop
const getLabel = (option) => {
  // First try to use the specified labelField
  if (props.labelField && option[props.labelField]) {
    return option[props.labelField]
  }
  
  // Fallback to common label fields
  if (props.labelField === 'display_name') {
    return option.display_name || option.name || option.title || option.label || 'Không có tên'
  }
  
  return option.title || option.name || option.label || 'Không có tên'
}

// Filter options to exclude already selected items
const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return options.value.slice(0, 10).filter(option => !isSelected(option))
  }
  return options.value.filter(option => 
    !isSelected(option) && 
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Load default options when focused
const loadDefaultOptions = async () => {
  if (options.value.length === 0) {
    loading.value = true
    try {
      const { apiClient } = useApiClient()
      const response = await apiClient.get(`${props.searchApi}?per_page=50`)
      const allOptions = response.data.data || []
      
      // Transform options to have consistent label field
      options.value = allOptions.map(option => ({
        value: option.id,
        label: getLabel(option)
      }))
    } catch (error) {
      console.error('Error loading default options:', error)
      options.value = []
    } finally {
      loading.value = false
    }
  }
}

// Debounced search function
const debouncedSearch = debounce(async () => {
  if (searchQuery.value.length < props.minSearchLength) {
    options.value = []
    return
  }
  
  loading.value = true
  try {
    const { apiClient } = useApiClient()
    const response = await apiClient.get(`${props.searchApi}?search=${encodeURIComponent(searchQuery.value)}&per_page=50`)
    const searchResults = response.data.data || []
    
    // Transform search results to have consistent label field
    options.value = searchResults.map(option => ({
      value: option.id,
      label: getLabel(option)
    }))
  } catch (error) {
    console.error('Error searching options:', error)
    options.value = []
  } finally {
    loading.value = false
  }
}, 100)

// Handle input changes
const handleInput = () => {
  if (searchQuery.value.length >= props.minSearchLength) {
    debouncedSearch()
  } else {
    options.value = []
  }
}

// Focus input when clicking on the wrapper
const focusInput = () => {
  if (props.disabled) return
  searchInputRef.value && searchInputRef.value.focus()
}

// Handle focus
const handleFocus = async () => {
  showDropdown.value = true
  await loadDefaultOptions()
}

// Handle blur with delay to allow click events
const handleBlur = () => {
  // Delay closing to allow clicks inside dropdown; only close if not interacting
  setTimeout(() => {
    if (!isInteractingWithDropdown.value) {
      showDropdown.value = false
    }
  }, 150)
}

// Handle backspace to remove last selected when query is empty
const handleBackspace = () => {
  if (searchQuery.value.length === 0 && selectedItems.value.length > 0) {
    const last = selectedItems.value[selectedItems.value.length - 1]
    removeItem(last)
  }
}

// Row click: only select when not already selected
const onOptionRowClick = (option) => {
  if (!isSelected(option)) {
    selectOption(option)
  }
}

// Action button click inside option row
const handleOptionAction = (option) => {
  if (isSelected(option)) {
    removeItem(option)
  } else {
    selectOption(option)
  }
  // Keep dropdown open and refocus input
  nextTick(() => {
    showDropdown.value = true
    searchInputRef.value && searchInputRef.value.focus()
  })
}

// Manage dropdown interaction state to prevent blur-closing
const isInteractingWithDropdown = ref(false)
const onDropdownMouseDown = () => {
  isInteractingWithDropdown.value = true
}
const onDropdownMouseUp = () => {
  isInteractingWithDropdown.value = false
  searchInputRef.value && searchInputRef.value.focus()
}

// Select an option
const selectOption = (option) => {
  if (!isSelected(option)) {
    selectedItems.value.push(option)
    emit('update:modelValue', selectedItems.value.map(item => item.value))
    emit('change', selectedItems.value.map(item => item.value))
  }
  searchQuery.value = ''
}

// Remove an item
const removeItem = (item) => {
  selectedItems.value = selectedItems.value.filter(i => i.value !== item.value)
  emit('update:modelValue', selectedItems.value.map(item => item.value))
  emit('change', selectedItems.value.map(item => item.value))
}

// Check if option is already selected
const isSelected = (option) => {
  return selectedItems.value.some(item => item.value === option.value)
}


// Watch for modelValue changes to update selected items
watch(() => props.modelValue, async (newValue) => {
  if (newValue && newValue.length > 0) {
    const normalizedIds = normalizeToIds(newValue)
    const uniqueIds = Array.from(new Set(normalizedIds))
    // Try to find items in current options
    const foundItems = []
    const missingIds = []
    
    for (const id of uniqueIds) {
      const found = options.value.find(opt => opt.value === id)
      if (found) {
        foundItems.push(found)
      } else {
        missingIds.push(id)
      }
    }
    
    // Fetch missing items from API
    if (missingIds.length > 0) {
      try {
        const { apiClient } = useApiClient()
        const response = await apiClient.get(`${props.searchApi}?ids=${missingIds.join(',')}`)
        if (response.data.data) {
          const requestedIdSet = new Set(missingIds)
          const missingItems = response.data.data
            .filter(option => requestedIdSet.has(option.id))
            .map(option => ({
              value: option.id,
              label: getLabel(option)
            }))
          foundItems.push(...missingItems)
        }
      } catch (error) {
        console.error('Error fetching missing items:', error)
      }
    }
    
    // Deduplicate by value to avoid inflated counts
    const seen = new Set()
    selectedItems.value = foundItems.filter(item => {
      if (seen.has(item.value)) return false
      seen.add(item.value)
      return true
    })
  } else {
    selectedItems.value = []
  }
}, { immediate: true })

// Load initial options if modelValue exists
// Removed onMounted ids-fetch to avoid duplicate calls; watcher with immediate handles initialization

// Normalize incoming modelValue to an array of ids
function normalizeToIds(values) {
  return values.map(v => {
    if (v && typeof v === 'object') {
      if ('id' in v && v.id != null) return v.id
      if ('value' in v && v.value != null) return v.value
    }
    return v
  })
}
</script>

<style scoped>
.searchable-multi-select {
  position: relative;
}

.selected-items {
  min-height: 2rem;
}
</style>
