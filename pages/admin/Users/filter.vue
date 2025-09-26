<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <form @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Tìm ki?m theo tên -->
        <TextFilter
          v-model="filters.search"
          label="Tìm ki?m"
          placeholder="Tìm theo tên dang nh?p, email"
        />
        
        <!-- L?c theo tr?ng thái -->
        <SelectFilter
          v-model="filters.status"
          label="Tr?ng thái"
          placeholder="T?t c? tr?ng thái"
          :api-endpoint="statusApi"
          label-field="label"
          value-field="value"
        />
        
        <!-- S?p x?p theo -->
        <SelectFilter
          v-model="filters.sort_by"
          label="S?p x?p theo"
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
import TextFilter from '@/components/Core/Filter/TextFilter.vue'
import SelectFilter from '@/components/Core/Filter/SelectFilter.vue'
import { adminEndpoints } from '@/api/endpoints'

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
  sort_by: props.initialFilters.sort_by || 'created_at:desc',
})

// API cho enum tr?ng thái ngu?i dùng
const statusApi = adminEndpoints.enums('user_status')

const sortOptions = [
  { value: 'created_at:desc', label: 'M?i nh?t' },
  { value: 'created_at:asc', label: 'Cu nh?t' },
  { value: 'username:asc', label: 'Tên dang nh?p (A-Z)' },
  { value: 'username:desc', label: 'Tên dang nh?p (Z-A)' },
  { value: 'email:asc', label: 'Email (A-Z)' },
  { value: 'email:desc', label: 'Email (Z-A)' }
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
  filters.sort_by = 'created_at:desc'
  emit('update:filters', { ...filters })
}
</script> 


