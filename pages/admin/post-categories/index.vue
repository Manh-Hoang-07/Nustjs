<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý danh mục bài viết</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm danh mục mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <CategoryFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="4" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
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
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                :item="category"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
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
    <CreateCategory
      v-if="showCreateModal"
      :show="showCreateModal"
      :status-enums="statusEnums"
      :on-close="closeCreateModal"
      @created="handleCategoryCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditCategory
      v-if="showEditModal"
      :show="showEditModal"
      :category="selectedCategory"
      :status-enums="statusEnums"
      :on-close="closeEditModal"
      @updated="handleCategoryUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
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

import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useDataTable } from '@/composables/data/useDataTable'
import { useToast } from '@/composables/ui/useToast'
import { useApiClient } from '@/composables/api/useApiClient'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'

// Lazy load components
const CreateCategory = defineAsyncComponent(() => import('./create.vue'))
const EditCategory = defineAsyncComponent(() => import('./edit.vue'))
const CategoryFilter = defineAsyncComponent(() => import('./filter.vue'))

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters, 
  fetchData, 
  updateFilters, 
  deleteItem 
} = useDataTable(adminEndpoints.postCategories.list, {
  defaultFilters: {
    search: '',
    status: '',
    sort_by: 'created_at_desc'
  }
})

const { showSuccess, showError } = useToast()
const { apiClient } = useApiClient()

// State
const selectedCategory = ref(null)
const statusEnums = ref([])

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Fetch data
onMounted(async () => {
  await Promise.all([
    fetchData(),
    fetchStatusEnums()
  ])
})

async function fetchStatusEnums() {
  try {
    const response = await apiClient.get(adminEndpoints.enums('basic_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    } else {
      statusEnums.value = []
    }
  } catch (error) {
    statusEnums.value = []
  }
}



function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

// Modal handlers
function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function openEditModal(category) {
  selectedCategory.value = category
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  selectedCategory.value = null
}

function confirmDelete(category) {
  selectedCategory.value = category
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedCategory.value = null
}

// Action handlers
async function handleCategoryCreated() {
  await fetchData()
  closeCreateModal()
  showSuccess('Danh mục đã được tạo thành công')
}

async function handleCategoryUpdated() {
  await fetchData()
  closeEditModal()
  showSuccess('Danh mục đã được cập nhật thành công')
}

async function deleteCategory() {
  try {
    await deleteItem(selectedCategory.value.id)
    closeDeleteModal()
    showSuccess('Danh mục đã được xóa thành công')
  } catch (error) {
    showError('Không thể xóa danh mục')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Status helper functions
function getStatusLabel(status) {
  const found = (statusEnums.value || []).find(it => it.value === status || it.id === status)
  return found?.label || found?.name || status || 'Không xác định'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>

<style>
/* Cho phép cuộn ngang table khi màn hình nhỏ */
.table-responsive {
  overflow-x: auto;
}
</style>