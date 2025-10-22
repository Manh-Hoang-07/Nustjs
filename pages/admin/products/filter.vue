<template>
  <div class="bg-white p-4 rounded-lg shadow-md mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Tìm kiếm -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
        <TextFilter
          v-model="localFilters.search"
          placeholder="Tìm theo tên, SKU..."
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Trạng thái -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
        <SelectFilter
          v-model="localFilters.status"
          :options="statusOptions"
          placeholder="Chọn trạng thái"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Danh mục -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
        <SelectFilter
          v-model="localFilters.category_id"
          :options="categoryOptions"
          placeholder="Chọn danh mục"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Nổi bật -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nổi bật</label>
        <SelectFilter
          v-model="localFilters.featured"
          :options="featuredOptions"
          placeholder="Chọn trạng thái nổi bật"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Khoảng giá -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Giá tối thiểu</label>
        <input
          v-model="localFilters.min_price"
          type="number"
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          @input="handleFilterChange"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Giá tối đa</label>
        <input
          v-model="localFilters.max_price"
          type="number"
          placeholder="999999999"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          @input="handleFilterChange"
        />
      </div>

      <!-- Tồn kho -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
        <SelectFilter
          v-model="localFilters.in_stock"
          :options="stockOptions"
          placeholder="Chọn trạng thái tồn kho"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Sắp xếp -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
        <div class="flex space-x-2">
          <SelectFilter
            v-model="localFilters.sort_by"
            :options="sortOptions"
            placeholder="Sắp xếp theo"
            @update:model-value="handleFilterChange"
          />
          <SelectFilter
            v-model="localFilters.sort_order"
            :options="sortOrderOptions"
            placeholder="Thứ tự"
            @update:model-value="handleFilterChange"
          />
        </div>
      </div>
    </div>

    <!-- Nút hành động -->
    <div class="flex justify-end space-x-2 mt-4">
      <button
        @click="resetFilters"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
      >
        Đặt lại
      </button>
      <button
        @click="applyFilters"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TextFilter from '@/components/Core/Filter/TextFilter.vue'
import SelectFilter from '@/components/Core/Filter/SelectFilter.vue'

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  },
  statusEnums: {
    type: Array,
    default: () => []
  },
  categoryEnums: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

// Local filters state
const localFilters = ref({
  search: '',
  status: '',
  category_id: '',
  featured: '',
  min_price: '',
  max_price: '',
  in_stock: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  ...props.initialFilters
})

// Options for select filters
const statusOptions = computed(() => {
  const options = [{ value: '', label: 'Tất cả' }]
  if (props.statusEnums && Array.isArray(props.statusEnums)) {
    props.statusEnums.forEach(item => {
      options.push({
        value: item.value,
        label: item.label || item.name
      })
    })
  }
  return options
})

const categoryOptions = computed(() => {
  const options = [{ value: '', label: 'Tất cả' }]
  if (props.categoryEnums && Array.isArray(props.categoryEnums)) {
    props.categoryEnums.forEach(item => {
      options.push({
        value: item.id,
        label: item.name
      })
    })
  }
  return options
})

const featuredOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Nổi bật' },
  { value: 'false', label: 'Không nổi bật' }
]

const stockOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Còn hàng' },
  { value: 'false', label: 'Hết hàng' }
]

const sortOptions = [
  { value: 'name', label: 'Tên' },
  { value: 'price', label: 'Giá' },
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' }
]

const sortOrderOptions = [
  { value: 'asc', label: 'A-Z' },
  { value: 'desc', label: 'Z-A' }
]

// Watch for changes in props
watch(() => props.initialFilters, (newFilters) => {
  localFilters.value = { ...localFilters.value, ...newFilters }
}, { deep: true })

// Handle filter changes
function handleFilterChange() {
  // Debounce could be added here if needed
}

// Apply filters
function applyFilters() {
  // Clean up empty values
  const cleanFilters = {}
  Object.keys(localFilters.value).forEach(key => {
    const value = localFilters.value[key]
    if (value !== '' && value !== null && value !== undefined) {
      cleanFilters[key] = value
    }
  })
  
  emit('update:filters', cleanFilters)
}

// Reset filters
function resetFilters() {
  localFilters.value = {
    search: '',
    status: '',
    category_id: '',
    featured: '',
    min_price: '',
    max_price: '',
    in_stock: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  }
  applyFilters()
}
</script>