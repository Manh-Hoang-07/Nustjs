<template>
  <div class="bg-white p-6 rounded-lg shadow-md mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Tìm kiếm -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
        <div class="relative">
          <input
            v-model="localFilters.search"
            type="text"
            placeholder="Tên, email, chủ đề..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debouncedSearch"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Trạng thái -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
        <select
          v-model="localFilters.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="applyFilters"
        >
          <option value="">Tất cả trạng thái</option>
          <option 
            v-for="status in statusEnums" 
            :key="status.value" 
            :value="status.value"
          >
            {{ status.label }}
          </option>
        </select>
      </div>

      <!-- Từ ngày -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
        <input
          v-model="localFilters.date_from"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="applyFilters"
        >
      </div>

      <!-- Đến ngày -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
        <input
          v-model="localFilters.date_to"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="applyFilters"
        >
      </div>
    </div>

    <!-- Sắp xếp -->
    <div class="mt-4 flex flex-wrap items-center justify-between">
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-gray-700">Sắp xếp theo:</label>
        <select
          v-model="localFilters.sort_by"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="applyFilters"
        >
          <option value="created_at_desc">Mới nhất</option>
          <option value="created_at_asc">Cũ nhất</option>
          <option value="name_asc">Tên A-Z</option>
          <option value="name_desc">Tên Z-A</option>
          <option value="email_asc">Email A-Z</option>
          <option value="email_desc">Email Z-A</option>
          <option value="status_asc">Trạng thái</option>
        </select>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="resetFilters"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Đặt lại
        </button>
        <button
          @click="applyFilters"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Áp dụng
        </button>
      </div>
    </div>

    <!-- Thống kê nhanh -->
    <div v-if="stats" class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ stats.total || 0 }}</div>
          <div class="text-sm text-gray-600">Tổng số</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ stats.pending || 0 }}</div>
          <div class="text-sm text-gray-600">Chờ xử lý</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.in_progress || 0 }}</div>
          <div class="text-sm text-gray-600">Đang xử lý</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ stats.completed || 0 }}</div>
          <div class="text-sm text-gray-600">Hoàn thành</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getEnumSync } from '../../../constants/enums.js'
import { debounce } from 'lodash-es'

// Props
const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:filters'])

// State
const localFilters = ref({ ...props.initialFilters })
const statusEnums = ref([])
const stats = ref(null)

// Debounced search
const debouncedSearch = debounce(() => {
  applyFilters()
}, 500)

// Methods
function applyFilters() {
  emit('update:filters', { ...localFilters.value })
}

function resetFilters() {
  localFilters.value = {
    search: '',
    status: '',
    date_from: '',
    date_to: '',
    sort_by: 'created_at_desc'
  }
  applyFilters()
}

// Watch for prop changes
watch(() => props.initialFilters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Load enums
onMounted(() => {
  statusEnums.value = getEnumSync('contact_status')
})
</script>

