<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <form @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Tìm kiếm theo tên -->
        <TextFilter
          v-model="filters.search"
          placeholder="Tìm theo tên tag"
        />
        <!-- Lọc theo trạng thái -->
        <SelectFilter
          v-model="filters.status"
          :api-endpoint="statusApi"
          label-field="label"
          value-field="value"
          placeholder="Tất cả trạng thái"
        />
        
        <div class="flex items-end space-x-2">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Lọc
          </button>
          <button
            type="button"
            @click="resetFilters"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import TextFilter from '@/components/Core/Filter/TextFilter.vue'
import SelectFilter from '@/components/Core/Filter/SelectFilter.vue'
import { adminEndpoints } from '@/api/endpoints'

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:filters'])

const filters = reactive({
  search: props.initialFilters.search || '',
  status: props.initialFilters.status || '',
})

// API cho enum trạng thái
const statusApi = adminEndpoints.enums('basic_status')

// Áp dụng bộ lọc
function applyFilters() {
  emit('update:filters', { ...filters })
}

// Đặt lại bộ lọc
function resetFilters() {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  emit('update:filters', { ...filters })
}
</script>