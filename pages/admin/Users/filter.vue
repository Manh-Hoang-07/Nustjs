<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <form @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Tìm kiếm theo tên -->
        <AdminFilterItem
          id="search"
          label="Tìm kiếm"
          type="text"
          v-model="filters.search"
          placeholder="Tìm theo tên đăng nhập, email"
        />
        
        <!-- Lọc theo trạng thái -->
        <AdminFilterItem
          id="status"
          label="Trạng thái"
          type="select"
          v-model="filters.status"
          placeholder="Tất cả trạng thái"
          :options="statusOptions"
        />
        
        <!-- Sắp xếp theo -->
        <AdminFilterItem
          id="sort_by"
          label="Sắp xếp theo"
          type="select"
          v-model="filters.sort_by"
          :options="sortOptions"
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
  sort_by: props.initialFilters.sort_by || 'created_at:desc',
})

// Các tùy chọn cho select (lấy từ props.statusEnums) và phản ứng khi props thay đổi
const statusOptions = computed(() => (props.statusEnums || []).map(it => ({
  value: it.value ?? it.id,
  label: it.label ?? it.name
})))

const sortOptions = [
  { value: 'created_at:desc', label: 'Mới nhất' },
  { value: 'created_at:asc', label: 'Cũ nhất' },
  { value: 'username:asc', label: 'Tên đăng nhập (A-Z)' },
  { value: 'username:desc', label: 'Tên đăng nhập (Z-A)' },
  { value: 'email:asc', label: 'Email (A-Z)' },
  { value: 'email:desc', label: 'Email (Z-A)' }
]

// Áp dụng bộ lọc
function applyFilters() {
  emit('update:filters', { ...filters })
}

// Đặt lại bộ lọc
function resetFilters() {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  filters.sort_by = 'created_at:desc'
  emit('update:filters', { ...filters })
}
</script> 


