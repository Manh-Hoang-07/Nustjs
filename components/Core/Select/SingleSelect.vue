<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
    <div class="relative">
      <!-- Control -->
      <div 
        @click="toggleDropdown"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer bg-white flex items-center justify-between"
        :class="{ 'border-red-500': error, 'bg-gray-100 cursor-not-allowed': disabled }"
      >
        <span class="truncate" :class="{ 'text-gray-500': !selectedItem }">
          {{ selectedItem ? selectedItem.label : placeholder }}
        </span>
        <svg class="h-4 w-4 text-gray-500 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Dropdown -->
      <div 
        v-if="showDropdown"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
      >
        <div 
          v-if="clearable && selectedItem"
          @click="clearSelection"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 text-gray-500"
        >
          ✕ Xóa lựa chọn
        </div>

        <div class="px-2 py-2" v-if="searchable">
          <input 
            v-model="searchQuery"
            type="text" 
            class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :placeholder="searchPlaceholder"
          />
        </div>

        <div 
          v-for="option in filteredOptions" 
          :key="option.value"
          @click="selectItem(option)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <input 
            type="radio" 
            class="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            :checked="modelValue == option.value"
            readonly
          />
          {{ option.label }}
        </div>

        <div v-if="!loading && filteredOptions.length === 0" class="px-3 py-2 text-gray-500">
          Không có lựa chọn
        </div>

        <div v-if="loading" class="px-3 py-2 text-gray-500">
          Đang tải...
        </div>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient.js'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  searchApi: {
    type: String,
    default: ''
  },
  params: {
    type: Object,
    default: () => ({})
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Chọn...'
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Tìm kiếm...'
  },
  labelField: {
    type: String,
    default: 'title'
  },
  excludeId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showDropdown = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const internalOptions = ref([])

const getLabel = (option) => {
  if (props.labelField === 'display_name') {
    return option.display_name || option.name || option.title || option.label || 'Không có tên'
  }
  return option.title || option.name || option.label || 'Không có tên'
}

const selectedItem = computed(() => {
  const found = internalOptions.value.find(opt => opt.value == props.modelValue)
  if (found) return found
  if (props.modelValue == null) return null
  return { value: props.modelValue, label: String(props.modelValue) }
})

function toggleDropdown() {
  if (props.disabled) return
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    ensureOptionsLoaded()
  }
}

async function ensureOptionsLoaded() {
  if (internalOptions.value.length > 0) return
  // prefer provided options; otherwise fetch
  if (props.options && props.options.length > 0) {
    internalOptions.value = props.options
    return
  }
  if (!props.searchApi) return
  loading.value = true
  try {
    const { apiClient } = useApiClient()
    const query = new URLSearchParams({ per_page: '50', ...props.params }).toString()
    const url = `${props.searchApi}${query ? `?${query}` : ''}`
    const response = await apiClient.get(url)
    const data = response.data?.data || []
    let mapped = data.map(item => ({ value: item.id, label: getLabel(item) }))
    if (props.excludeId) {
      mapped = mapped.filter(i => i.value != props.excludeId)
    }
    internalOptions.value = mapped
  } catch (e) {
    internalOptions.value = []
  } finally {
    loading.value = false
  }
}

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return internalOptions.value
  return internalOptions.value.filter(opt => (opt.label || '').toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function selectItem(option) {
  showDropdown.value = false
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

function clearSelection() {
  showDropdown.value = false
  emit('update:modelValue', null)
  emit('change', null)
}

function handleClickOutside(event) {
  const root = event.target.closest('.relative')
  // If click outside any open dropdown area
  if (!root) {
    showDropdown.value = false
  }
}

watch(() => props.options, (newOpts) => {
  if (newOpts && newOpts.length > 0) {
    internalOptions.value = newOpts
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>








