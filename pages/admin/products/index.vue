<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý sản phẩm</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm sản phẩm mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <ProductFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="7" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in items" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img 
                    v-if="product.image" 
                    :src="product.image" 
                    :alt="product.name"
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
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ getCategoryNames(product.categories) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.sku }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <span v-if="product.sale_price" class="text-red-600 font-medium">
                  {{ formatCurrency(product.sale_price) }}
                </span>
                <span 
                  v-else
                  class="text-gray-900 font-medium"
                >
                  {{ formatCurrency(product.price) }}
                </span>
              </div>
              <div v-if="product.sale_price" class="text-sm text-gray-500 line-through">
                {{ formatCurrency(product.price) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="{
                'text-green-600': product.stock_quantity > 10,
                'text-yellow-600': product.stock_quantity > 0 && product.stock_quantity <= 10,
                'text-red-600': product.stock_quantity === 0
              }">
                {{ product.stock_quantity }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="getStatusClass(product.status)"
                >
                  {{ getStatusLabel(product.status) }}
                </span>
                <span 
                  v-if="product.featured"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                >
                  Nổi bật
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <ClientOnly>
                <Actions
                  :item="product"
                  @edit="openEditModal"
                  @delete="confirmDelete"
                  :additional-actions="[
                    {
                      label: product.featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật',
                      action: () => toggleFeatured(product),
                      icon: product.featured ? 'star' : 'star-outline'
                    }
                  ]"
                />
                <template #fallback>
                  <div class="flex space-x-1">
                    <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </template>
              </ClientOnly>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
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
    <CreateProduct
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handleProductCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditProduct
      v-if="modals.edit"
      :show="modals.edit"
      :product="selectedProduct"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleProductUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa sản phẩm ${selectedProduct?.name || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deleteProduct"
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
const CreateProduct = defineAsyncComponent(() => import('./create.vue'))
const EditProduct = defineAsyncComponent(() => import('./edit.vue'))
const ProductFilter = defineAsyncComponent(() => import('./filter.vue'))

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
    list: adminEndpoints.products.list,
    create: adminEndpoints.products.create,
    update: (id) => adminEndpoints.products.update(id),
    delete: (id) => adminEndpoints.products.delete(id)
  }
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()

// State
const statusEnums = ref([])
const categoryEnums = ref([])

// Use selectedItem from composable as selectedProduct
const selectedProduct = selectedItem

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
  
  // Load categories
  try {
    const response = await apiClient.get(adminEndpoints.productCategories.list)
    if (response.data?.success) {
      categoryEnums.value = response.data.data || []
    } else {
      categoryEnums.value = []
    }
  } catch (e) {
    categoryEnums.value = []
  }
}

// Modal handlers - sử dụng composable handlers
const openCreateModal = openCreateModalComposable
const closeCreateModal = closeCreateModalComposable
const openEditModal = openEditModalComposable
const closeEditModal = closeEditModalComposable
const openDeleteModal = openDeleteModalComposable
const closeDeleteModal = closeDeleteModalComposable

function confirmDelete(product) {
  openDeleteModal(product)
}

// Action handlers
async function handleProductCreated(productData) {
  try {
    await createItem(productData)
    showSuccess('Sản phẩm đã được tạo thành công')
  } catch (error) {
    showError('Không thể tạo sản phẩm')
  }
}

async function handleProductUpdated(productData) {
  try {
    await updateItem(productData)
    showSuccess('Sản phẩm đã được cập nhật thành công')
  } catch (error) {
    showError('Không thể cập nhật sản phẩm')
  }
}

async function deleteProduct() {
  try {
    const success = await deleteItem()
    if (success) {
      showSuccess('Sản phẩm đã được xóa thành công')
    } else {
      showError('Không thể xóa sản phẩm')
    }
  } catch (error) {
    showError('Không thể xóa sản phẩm')
  }
}

async function toggleFeatured(product) {
  try {
    const response = await apiClient.patch(adminEndpoints.products.toggleFeatured(product.id))
    if (response.data?.success) {
      showSuccess(`Đã ${product.featured ? 'bỏ' : 'đánh dấu'} sản phẩm nổi bật`)
      fetchData() // Refresh data
    } else {
      showError('Không thể cập nhật trạng thái nổi bật')
    }
  } catch (error) {
    showError('Không thể cập nhật trạng thái nổi bật')
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

function getCategoryNames(categories) {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return '—'
  }
  return categories.map(cat => cat.name).join(', ')
}

</script>

<style>
/* Cho phép cuộn ngang table khi màn hình nhỏ */
.table-responsive {
  overflow-x: auto;
}
</style>