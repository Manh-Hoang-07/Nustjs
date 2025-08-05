<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <form @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Tìm kiếm -->
        <AdminFilterItem
          id="search"
          label="Tìm kiếm"
          type="text"
          v-model="filters.search"
          placeholder="Tên sản phẩm, mã sản phẩm..."
          @input="debounceSearch"
        />

        <!-- Kho hàng -->
        <AdminFilterItem
          id="warehouse_id"
          label="Kho hàng"
          type="select"
          v-model="filters.warehouse_id"
          placeholder="Tất cả kho hàng"
          :options="warehouseOptions"
        />

        <!-- Thương hiệu -->
        <AdminFilterItem
          id="brand_id"
          label="Thương hiệu"
          type="select"
          v-model="filters.brand_id"
          placeholder="Tất cả thương hiệu"
          :options="brandOptions"
        />

        <!-- Danh mục -->
        <AdminFilterItem
          id="category_id"
          label="Danh mục"
          type="select"
          v-model="filters.category_id"
          placeholder="Tất cả danh mục"
          :options="categoryOptions"
        />

        <!-- Trạng thái tồn kho -->
        <AdminFilterItem
          id="stock_status"
          label="Trạng thái tồn kho"
          type="select"
          v-model="filters.stock_status"
          placeholder="Tất cả trạng thái"
          :options="stockStatusOptions"
        />

        <!-- Hạn sử dụng -->
        <AdminFilterItem
          id="expiry_status"
          label="Hạn sử dụng"
          type="select"
          v-model="filters.expiry_status"
          placeholder="Tất cả hạn sử dụng"
          :options="expiryStatusOptions"
        />

        <!-- Sắp xếp -->
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
import { ref, watch, onMounted, computed } from 'vue'
import AdminFilterItem from '/components/Admin/AdminFilterItem.vue'
import { debounce } from '../../../utils/debounce.js'
import { getEnumSync } from '../../../constants/enums.js'

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  },
  warehouses: {
    type: Array,
    default: () => []
  },
  brands: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

const filters = ref({
  search: '',
  warehouse_id: '',
  brand_id: '',
  category_id: '',
  stock_status: '',
  expiry_status: '',
  sort_by: 'updated_at_desc',
  ...props.initialFilters
})

// Options for selects
const warehouseOptions = computed(() => [
  { value: '', label: 'Tất cả kho hàng' },
  ...props.warehouses.map(warehouse => ({
    value: warehouse.id,
    label: warehouse.name
  }))
])

const brandOptions = computed(() => [
  { value: '', label: 'Tất cả thương hiệu' },
  ...props.brands.map(brand => ({
    value: brand.id,
    label: brand.name
  }))
])

const categoryOptions = computed(() => [
  { value: '', label: 'Tất cả danh mục' },
  ...props.categories.map(category => ({
    value: category.id,
    label: category.name
  }))
])

const stockStatusOptions = computed(() => {
  const enumData = getEnumSync('stock_status')
  const options = [{ value: '', label: 'Tất cả trạng thái' }]
  if (Array.isArray(enumData)) {
    options.push(...enumData.map(item => ({
      value: item.value,
      label: item.label
    })))
  }
  return options
})

const expiryStatusOptions = computed(() => {
  const enumData = getEnumSync('expiry_status')
  const options = [{ value: '', label: 'Tất cả hạn sử dụng' }]
  if (Array.isArray(enumData)) {
    options.push(...enumData.map(item => ({
      value: item.value,
      label: item.label
    })))
  }
  return options
})

const sortOptions = [
  { value: 'updated_at_desc', label: 'Cập nhật gần nhất' },
  { value: 'updated_at_asc', label: 'Cập nhật xa nhất' },
  { value: 'available_quantity_desc', label: 'Số lượng giảm dần' },
  { value: 'available_quantity_asc', label: 'Số lượng tăng dần' },
  { value: 'expiry_date_asc', label: 'Hạn sử dụng gần nhất' },
  { value: 'expiry_date_desc', label: 'Hạn sử dụng xa nhất' },
  { value: 'product_name_asc', label: 'Tên sản phẩm A-Z' },
  { value: 'product_name_desc', label: 'Tên sản phẩm Z-A' }
]

// Debounce search
const debounceSearch = debounce(() => {
  applyFilters()
}, 300)

function applyFilters() {
  // Chỉ emit các filter có giá trị
  const activeFilters = {}
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key] !== '' && filters.value[key] !== null && filters.value[key] !== undefined) {
      activeFilters[key] = filters.value[key]
    }
  })
  emit('update:filters', activeFilters)
}

function resetFilters() {
  filters.value = {
    search: '',
    warehouse_id: '',
    brand_id: '',
    category_id: '',
    stock_status: '',
    expiry_status: '',
    sort_by: 'updated_at_desc'
  }
  applyFilters()
}

// Watch for prop changes
watch(() => props.initialFilters, (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
}, { deep: true })

onMounted(() => {
  // Load filter options if not provided
  if (props.warehouses.length === 0 || props.brands.length === 0 || props.categories.length === 0) {
    // You can load them here if needed
  }
})
</script> 

