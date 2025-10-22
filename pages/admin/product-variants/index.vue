<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý biến thể sản phẩm</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm biến thể mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <ProductVariantFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      :product-enums="productEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="7" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biến thể</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="variant in items" :key="variant.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ variant.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img 
                    v-if="variant.image" 
                    :src="variant.image" 
                    :alt="variant.name"
                    class="h-10 w-10 rounded-full object-cover"
                  >
                  <div 
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <span class="text-xs text-gray-500">N/A</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ variant.name }}</div>
                  <div class="text-sm text-gray-500">{{ getAttributeNames(variant.attributes) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ variant.product?.name || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ variant.sku }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <span v-if="variant.sale_price" class="text-red-600 font-medium">
                  {{ formatCurrency(variant.sale_price) }}
                </span>
                <span 
                  v-else
                  class="text-gray-900 font-medium"
                >
                  {{ formatCurrency(variant.price) }}
                </span>
              </div>
              <div v-if="variant.sale_price" class="text-sm text-gray-500 line-through">
                {{ formatCurrency(variant.price) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="{
                'text-green-600': variant.stock_quantity > 10,
                'text-yellow-600': variant.stock_quantity > 0 && variant.stock_quantity <= 10,
                'text-red-600': variant.stock_quantity === 0
              }">
                {{ variant.stock_quantity }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="getStatusClass(variant.status)"
              >
                {{ getStatusLabel(variant.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions
                :item="variant"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-gray-500">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <Pagination 
      v-if="items.length > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      :loading="loading"
      @page-change="handlePageChange"
    />

    <!-- Modal thêm mới -->
    <CreateProductVariant
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :product-enums="productEnums"
      :attribute-enums="attributeEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handleVariantCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditProductVariant
      v-if="modals.edit"
      :show="modals.edit"
      :variant="selectedVariant"
      :status-enums="statusEnums"
      :product-enums="productEnums"
      :attribute-enums="attributeEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleVariantUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa biến thể ${selectedVariant?.name || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deleteVariant"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import { formatCurrency } from '@/utils/formatters'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'
import { useGlobalApiClient } from '@/composables/api'

// Lazy load components
const CreateProductVariant = defineAsyncComponent(() => import('./create.vue'))
const EditProductVariant = defineAsyncComponent(() => import('./edit.vue'))
const ProductVariantFilter = defineAsyncComponent(() => import('./filter.vue'))

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters, 
  fetchData, 
  updateFilters,
  // CRUD operations
  createItem,
  updateItem,
  deleteItem,
  // Modal handlers
  openCreateModal: openCreateModalComposable,
  closeCreateModal: closeCreateModalComposable,
  openEditModal: openEditModalComposable,
  closeEditModal: closeEditModalComposable,
  openDeleteModal: openDeleteModalComposable,
  closeDeleteModal: closeDeleteModalComposable,
  // Selection
  selectedItem,
  // Modal state
  modals,
  // Error handling
  apiErrors,
  clearApiErrors
} = useCrudDataTable({
  endpoints: {
    list: adminEndpoints.productVariants.list,
    create: adminEndpoints.productVariants.create,
    update: (id) => adminEndpoints.productVariants.update(id),
    delete: (id) => adminEndpoints.productVariants.delete(id)
  }
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()

// State
const statusEnums = ref([])
const productEnums = ref([])
const attributeEnums = ref([])

// Use selectedItem from composable as selectedVariant
const selectedVariant = selectedItem

// Fetch data
// Flag to prevent duplicate enum loading
const enumsLoaded = ref(false)

onMounted(async () => {
  // Load enums via API only once
  if (!enumsLoaded.value) {
    await fetchEnums()
    enumsLoaded.value = true
  }
  
  // fetchData() will be called automatically by useCrudDataTable with URL sync
  // No need to call it manually here
})

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

async function fetchEnums() {
  try {
    const response = await apiClient.get(adminEndpoints.adminEnums('product_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    } else {
      statusEnums.value = []
    }
  } catch (e) {
    statusEnums.value = []
  }
  
  // Load products
  try {
    const response = await apiClient.get(adminEndpoints.products.list)
    if (response.data?.success) {
      productEnums.value = response.data.data || []
    } else {
      productEnums.value = []
    }
  } catch (e) {
    productEnums.value = []
  }
  
  // Load attributes
  try {
    const response = await apiClient.get(adminEndpoints.productAttributes.list)
    if (response.data?.success) {
      attributeEnums.value = response.data.data || []
    } else {
      attributeEnums.value = []
    }
  } catch (e) {
    attributeEnums.value = []
  }
}

// Modal handlers - sử dụng composable handlers
const openCreateModal = openCreateModalComposable
const closeCreateModal = closeCreateModalComposable
const openEditModal = openEditModalComposable
const closeEditModal = closeEditModalComposable
const openDeleteModal = openDeleteModalComposable
const closeDeleteModal = closeDeleteModalComposable

function confirmDelete(variant) {
  openDeleteModal(variant)
}

// Action handlers
async function handleVariantCreated(variantData) {
  try {
    await createItem(variantData)
    showSuccess('Biến thể đã được tạo thành công')
  } catch (error) {
    showError('Không thể tạo biến thể')
  }
}

async function handleVariantUpdated(variantData) {
  try {
    await updateItem(variantData)
    showSuccess('Biến thể đã được cập nhật thành công')
  } catch (error) {
    showError('Không thể cập nhật biến thể')
  }
}

async function deleteVariant() {
  try {
    const success = await deleteItem()
    if (success) {
      showSuccess('Biến thể đã được xóa thành công')
    } else {
      showError('Không thể xóa biến thể')
    }
  } catch (error) {
    showError('Không thể xóa biến thể')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Status helper functions
function getStatusLabel(status) {
  const found = (statusEnums.value || []).find(s => s.value === status)
  return found?.label || status || 'Không xác định'
}

function getStatusClass(status) {
  const found = (statusEnums.value || []).find(s => s.value === status)
  return found?.class || found?.badge_class || found?.color_class || 'bg-gray-100 text-gray-800'
}

function getAttributeNames(attributes) {
  if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
    return '—'
  }
  return attributes.map(attr => `${attr.attribute.name}: ${attr.value.value}`).join(', ')
}

</script>

<style>
/* Cho phép cuộn ngang table khi màn hình nhỏ */
.table-responsive {
  overflow-x: auto;
}
</style>