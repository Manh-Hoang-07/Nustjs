<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <form @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Tìm ki?m theo tên -->
        <AdminFilterItem
          id="search"
          label="Tìm ki?m"
          type="text"
          v-model="filters.search"
          placeholder="Tìm theo tên vai trò"
        />
        <!-- L?c theo tr?ng thái -->
        <AdminFilterItem
          id="status"
          label="Tr?ng thái"
          type="select"
          v-model="filters.status"
          :options="statusOptions"
        />
        <!-- S?p x?p theo -->
        <AdminFilterItem
          id="sort_by"
          label="S?p x?p theo"
          type="select"
          v-model="filters.sort_by"
          :options="sortOptions"
        />
        
        <div class="flex items-end space-x-2">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            L?c
          </button>
          <button
            type="button"
            @click="resetFilters"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
          >
            Ğ?t l?i
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import AdminFilterItem from '/components/Admin/Filter/AdminFilterItem.vue'

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  },
  statusEnums: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

const filters = reactive({
  search: props.initialFilters.search || '',
  status: props.initialFilters.status || '',
  sort_by: props.initialFilters.sort_by || 'created_at_desc',
})

// Các tùy ch?n cho select
const statusOptions = computed(() => {
  const options = [{ value: '', label: 'T?t c? tr?ng thái' }]
  
  if (Array.isArray(props.statusEnums)) {
    options.push(...props.statusEnums.map(item => ({
      value: item.value || item.id,
      label: item.label || item.name
    })))
  }
  
  return options
})

const sortOptions = [
  { value: 'created_at_desc', label: 'M?i nh?t' },
  { value: 'created_at_asc', label: 'Cu nh?t' },
  { value: 'name_asc', label: 'Tên (A-Z)' },
  { value: 'name_desc', label: 'Tên (Z-A)' }
]

// Áp d?ng b? l?c
function applyFilters() {
  emit('update:filters', { ...filters })
}

// Ğ?t l?i b? l?c
function resetFilters() {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  filters.sort_by = 'created_at_desc'
  emit('update:filters', { ...filters })
}
</script> 

