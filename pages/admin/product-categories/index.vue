<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý danh mục sản phẩm</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm danh mục mới
      </button>
    </div>

    <CategoryFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="5" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ tự</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in items" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="(
                  statusEnums.find(s => s.value === category.status)?.class ||
                  statusEnums.find(s => s.value === category.status)?.badge_class ||
                  statusEnums.find(s => s.value === category.status)?.color_class ||
                  'bg-gray-100 text-gray-800'
                )"
              >
                {{ getStatusLabel(category.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.sort_order ?? 0 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                :item="category"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination 
      v-if="items.length > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      :loading="loading"
      @page-change="handlePageChange"
    />

    <CreateCategory
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handleCategoryCreated"
    />

    <EditCategory
      v-if="modals.edit"
      :show="modals.edit"
      :category="selectedCategory"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleCategoryUpdated"
    />

    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa danh mục ${selectedCategory?.name || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deleteCategory"
    />
  </div>
  
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import { useGlobalApiClient } from '@/composables/api'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'

const CreateCategory = defineAsyncComponent(() => import('./create.vue'))
const EditCategory = defineAsyncComponent(() => import('./edit.vue'))
const CategoryFilter = defineAsyncComponent(() => import('./filter.vue'))

const {
  items,
  loading,
  pagination,
  filters,
  fetchData,
  updateFilters,
  createItem,
  updateItem,
  deleteItem,
  openCreateModal: openCreateModalComposable,
  closeCreateModal: closeCreateModalComposable,
  openEditModal: openEditModalComposable,
  closeEditModal: closeEditModalComposable,
  openDeleteModal: openDeleteModalComposable,
  closeDeleteModal: closeDeleteModalComposable,
  selectedItem,
  modals,
  apiErrors,
  clearApiErrors
} = useCrudDataTable({
  endpoints: {
    list: adminEndpoints.productCategories.list,
    create: adminEndpoints.productCategories.create,
    update: (id) => adminEndpoints.productCategories.update(id),
    delete: (id) => adminEndpoints.productCategories.delete(id)
  }
})

const { showSuccess } = useToast()
const { apiClient } = useGlobalApiClient()

const statusEnums = ref([])
const selectedCategory = selectedItem
const enumsLoaded = ref(false)

onMounted(async () => {
  if (!enumsLoaded.value) {
    await fetchStatusEnums()
    enumsLoaded.value = true
  }
})

async function fetchStatusEnums() {
  try {
    const response = await apiClient.get(adminEndpoints.enums('basic_status'))
    statusEnums.value = response.data?.data || []
  } catch (e) {
    statusEnums.value = []
  }
}

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

function openCreateModal() { openCreateModalComposable() }
function closeCreateModal() { closeCreateModalComposable() }
function openEditModal(category) { openEditModalComposable(category) }
function closeEditModal() { closeEditModalComposable() }
function confirmDelete(category) { openDeleteModalComposable(category) }
function closeDeleteModal() { closeDeleteModalComposable() }

async function handleCategoryCreated(data) { await createItem(data); showSuccess('Danh mục đã được tạo thành công') }
async function handleCategoryUpdated(data) { await updateItem(data); showSuccess('Danh mục đã được cập nhật thành công') }
async function deleteCategory() { await deleteItem(); showSuccess('Danh mục đã được xóa thành công') }

function handlePageChange(page) { fetchData({ page }) }

function getStatusLabel(status) {
  const found = (statusEnums.value || []).find(it => it.value === status || it.id === status)
  return found?.label || found?.name || status || 'Không xác định'
}
</script>



