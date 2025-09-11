<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Tìm kiếm -->
      <div class="relative">
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Tìm kiếm cấu hình..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
        >
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Lọc theo nhóm -->
      <select
        v-model="localFilters.group"
        @change="handleFilterChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Tất cả nhóm</option>
        <option value="general">Cài đặt chung</option>
        <option value="email">Cài đặt email</option>
        <option value="security">Cài đặt bảo mật</option>
      </select>

      <!-- Lọc theo trạng thái -->
      <select
        v-model="localFilters.status"
        @change="handleFilterChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Không hoạt động</option>
      </select>

      <!-- Sắp xếp -->
      <select
        v-model="localFilters.sort_by"
        @change="handleFilterChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="created_at_desc">Mới nhất</option>
        <option value="created_at_asc">Cũ nhất</option>
        <option value="config_key_asc">Tên A-Z</option>
        <option value="config_key_desc">Tên Z-A</option>
        <option value="display_name_asc">Hiển thị A-Z</option>
        <option value="display_name_desc">Hiển thị Z-A</option>
      </select>
    </div>

    <!-- Nút reset -->
    <div class="mt-4 flex justify-end">
      <button
        @click="resetFilters"
        class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        Đặt lại bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:filters'])

// Local filters state
const localFilters = ref({ ...props.initialFilters })

// Watch for prop changes
watch(() => props.initialFilters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Debounced search
let searchTimeout = null
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    handleFilterChange()
  }, 300)
}

// Handle filter changes
const handleFilterChange = () => {
  emit('update:filters', { ...localFilters.value })
}

// Reset filters
const resetFilters = () => {
  localFilters.value = {
    search: '',
    group: '',
    status: '',
    sort_by: 'created_at_desc'
  }
  handleFilterChange()
}
</script>
