<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý thẻ bài viết</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm thẻ mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <TagFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="3" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thẻ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="tag in items" :key="tag.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ tag.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="(
                  statusEnums.find(s => s.value === tag.status)?.class ||
                  statusEnums.find(s => s.value === tag.status)?.badge_class ||
                  statusEnums.find(s => s.value === tag.status)?.color_class ||
                  'bg-gray-100 text-gray-800'
                )"
              >
                {{ getStatusText(tag.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium">
              <Actions 
                :item="tag"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
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
    <CreateTag
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handleTagCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditTag
      v-if="modals.edit"
      :show="modals.edit"
      :tag="selectedTag"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleTagUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <Modal v-model="modals.delete" :title="'Xác nhận xóa'">
      <div class="text-center">
        <p class="text-gray-600 mb-4">Bạn có chắc chắn muốn xóa thẻ này không?</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout'
})

import { ref, onMounted } from 'vue'
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import { useGlobalApiClient } from '@/composables/api'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import TagFilter from './filter.vue'
import CreateTag from './create.vue'
import EditTag from './edit.vue'

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
    list: adminEndpoints.postTags.list,
    create: adminEndpoints.postTags.create,
    update: (id) => adminEndpoints.postTags.update(id),
    delete: (id) => adminEndpoints.postTags.delete(id)
  }
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()

// State
const statusEnums = ref([])

// Alias selectedItem from composable
const selectedTag = selectedItem

// Fetch data
// Flag to prevent duplicate enum loading
const enumsLoaded = ref(false)

onMounted(async () => {
  // Load enums and options only once
  if (!enumsLoaded.value) {
    await loadEnums()
    enumsLoaded.value = true
  }
  // fetchData() will be called automatically by useCrudDataTable with URL sync
  // No need to call it manually here
})

// Load enums and options
async function loadEnums() {
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

// Filter handlers
function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

// Modal handlers
function openCreateModal() {
  openCreateModalComposable()
}

function closeCreateModal() {
  closeCreateModalComposable()
}

function openEditModal(tag) {
  openEditModalComposable(tag)
}

function closeEditModal() {
  closeEditModalComposable()
}

function confirmDelete(tag) {
  openDeleteModalComposable(tag)
}

function closeDeleteModal() {
  closeDeleteModalComposable()
}

// CRUD operations
async function handleTagCreated(data) {
  await createItem(data)
  showSuccess('Thẻ đã được tạo thành công')
}

async function handleTagUpdated(data) {
  await updateItem(data)
  showSuccess('Thẻ đã được cập nhật thành công')
}

async function handleDelete() {
  await deleteItem()
  showSuccess('Xóa thẻ thành công')
}

function handlePageChange(page) {
  fetchData({ page })
}

function getStatusText(status) {
  const found = (statusEnums.value || []).find(s => s.value === status)
  return found?.label || status || 'Không xác định'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>
