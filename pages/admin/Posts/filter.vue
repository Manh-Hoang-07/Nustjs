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
          placeholder="Tìm theo tên bài viết"
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
        
        <!-- Lọc theo danh mục -->
        <AdminFilterItem
          id="category_id"
          label="Danh mục"
          type="select"
          v-model="filters.category_id"
          placeholder="Tất cả danh mục"
          :options="categoryOptions"
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
import { reactive } from 'vue'
import AdminFilterItem from '/components/Admin/Filter/AdminFilterItem.vue'

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
  category_id: props.initialFilters.category_id || '',
  sort_by: props.initialFilters.sort_by || 'created_at_desc',
})

// Các tùy chọn cho select
const statusOptions = [
  { value: 'published', label: 'Xuất bản' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'archived', label: 'Lưu trữ' }
]

const categoryOptions = [
  { value: '', label: 'Tất cả danh mục' },
  { value: '1', label: 'Tin tức' },
  { value: '16', label: 'Incidunt Vitae' }
]

const sortOptions = [
  { value: 'created_at_desc', label: 'Mới nhất' },
  { value: 'created_at_asc', label: 'Cũ nhất' },
  { value: 'name_asc', label: 'Tên bài viết (A-Z)' },
  { value: 'name_desc', label: 'Tên bài viết (Z-A)' },
  { value: 'published_at_desc', label: 'Xuất bản mới nhất' },
  { value: 'view_count_desc', label: 'Lượt xem cao nhất' }
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
  filters.sort_by = 'created_at_desc'
  emit('update:filters', { ...filters })
}
</script>



