<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">Bộ lọc</h3>
      <button
        @click="clearFilters"
        class="text-sm text-gray-500 hover:text-gray-700"
        :disabled="!hasActiveFilters"
      >
        Xóa bộ lọc
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Tìm kiếm theo key -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
        <TextFilter
          id="search"
          v-model="localFilters.search"
          placeholder="Tìm theo key hoặc mô tả..."
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Lọc theo nhóm -->
      <div>
        <label for="group" class="block text-sm font-medium text-gray-700 mb-1">Nhóm cấu hình</label>
        <SelectFilter
          id="group"
          v-model="localFilters.group"
          :options="groupOptions"
          placeholder="-- Tất cả nhóm --"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Lọc theo loại -->
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Loại dữ liệu</label>
        <SelectFilter
          id="type"
          v-model="localFilters.type"
          :options="typeOptions"
          placeholder="-- Tất cả loại --"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Lọc theo trạng thái -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
        <SelectFilter
          id="status"
          v-model="localFilters.status"
          :options="statusOptions"
          placeholder="-- Tất cả trạng thái --"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Lọc theo public -->
      <div>
        <label for="is_public" class="block text-sm font-medium text-gray-700 mb-1">Truy cập Public</label>
        <SelectFilter
          id="is_public"
          v-model="localFilters.is_public"
          :options="publicOptions"
          placeholder="-- Tất cả --"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Lọc theo encrypted -->
      <div>
        <label for="is_encrypted" class="block text-sm font-medium text-gray-700 mb-1">Mã hóa</label>
        <SelectFilter
          id="is_encrypted"
          v-model="localFilters.is_encrypted"
          :options="encryptedOptions"
          placeholder="-- Tất cả --"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Lọc theo ngày tạo -->
      <div>
        <label for="created_at" class="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
        <DateRangeFilter
          id="created_at"
          v-model="localFilters.created_at"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Lọc theo ngày cập nhật -->
      <div>
        <label for="updated_at" class="block text-sm font-medium text-gray-700 mb-1">Ngày cập nhật</label>
        <DateRangeFilter
          id="updated_at"
          v-model="localFilters.updated_at"
          @update:model-value="handleFilterChange"
        />
      </div>
    </div>

    <!-- Hiển thị số lượng bộ lọc đang active -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          <span class="font-medium">{{ activeFiltersCount }}</span> bộ lọc đang áp dụng
        </div>
        <div class="flex space-x-2">
          <button
            @click="applyFilters"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Áp dụng bộ lọc
          </button>
          <button
            @click="clearFilters"
            class="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import TextFilter from '@/components/Core/Filter/TextFilter.vue'
import SelectFilter from '@/components/Core/Filter/SelectFilter.vue'
import DateRangeFilter from '@/components/Core/Filter/DateRangeFilter.vue'

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  },
  groupEnums: {
    type: Array,
    default: () => []
  },
  typeEnums: {
    type: Array,
    default: () => []
  },
  statusEnums: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

// Local filters state
const localFilters = reactive({
  search: '',
  group: '',
  type: '',
  status: '',
  is_public: '',
  is_encrypted: '',
  created_at: null,
  updated_at: null,
  ...props.initialFilters
})

// Computed options for selects
const groupOptions = computed(() => [
  { value: '', label: '-- Tất cả nhóm --' },
  ...props.groupEnums.map(item => ({
    value: item.value,
    label: item.label
  }))
])

const typeOptions = computed(() => [
  { value: '', label: '-- Tất cả loại --' },
  ...props.typeEnums.map(item => ({
    value: item.value,
    label: item.label
  }))
])

const statusOptions = computed(() => [
  { value: '', label: '-- Tất cả trạng thái --' },
  ...props.statusEnums.map(item => ({
    value: item.value,
    label: item.label
  }))
])

const publicOptions = computed(() => [
  { value: '', label: '-- Tất cả --' },
  { value: '1', label: 'Có' },
  { value: '0', label: 'Không' }
])

const encryptedOptions = computed(() => [
  { value: '', label: '-- Tất cả --' },
  { value: '1', label: 'Có' },
  { value: '0', label: 'Không' }
])

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return Object.keys(localFilters).some(key => {
    const value = localFilters[key]
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'object' && value.start && value.end) return true
    return false
  })
})

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0
  Object.keys(localFilters).forEach(key => {
    const value = localFilters[key]
    if (value === null || value === undefined) return
    if (typeof value === 'string' && value.trim() !== '') count++
    if (typeof value === 'object' && value.start && value.end) count++
  })
  return count
})

// Watch for changes in local filters
watch(localFilters, (newFilters) => {
  // Debounce the emit to avoid too many API calls
  clearTimeout(window.filterTimeout)
  window.filterTimeout = setTimeout(() => {
    emit('update:filters', { ...newFilters })
  }, 300)
}, { deep: true })

// Handle individual filter changes
function handleFilterChange() {
  // This will trigger the watch above
}

// Apply filters immediately
function applyFilters() {
  emit('update:filters', { ...localFilters })
}

// Clear all filters
function clearFilters() {
  Object.keys(localFilters).forEach(key => {
    if (typeof localFilters[key] === 'string') {
      localFilters[key] = ''
    } else if (typeof localFilters[key] === 'object') {
      localFilters[key] = null
    }
  })
  emit('update:filters', { ...localFilters })
}

// Watch for changes in initialFilters prop
watch(() => props.initialFilters, (newFilters) => {
  Object.keys(newFilters).forEach(key => {
    if (localFilters.hasOwnProperty(key)) {
      localFilters[key] = newFilters[key]
    }
  })
}, { deep: true })
</script>
