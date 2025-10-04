<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý bài viết</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm bài viết mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <PostFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="6" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in items" :key="post.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ post.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ post.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getCategoryNames(post.categories) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="(
                  statusEnums.find(s => s.value === post.status)?.class ||
                  statusEnums.find(s => s.value === post.status)?.badge_class ||
                  statusEnums.find(s => s.value === post.status)?.color_class ||
                  'bg-gray-100 text-gray-800'
                )"
              >
                {{ getStatusLabel(post.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(post.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                :item="post"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
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
    <CreatePost
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :tag-enums="tagEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handlePostCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditPost
      v-if="modals.edit"
      :show="modals.edit"
      :post="selectedPost"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :tag-enums="tagEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handlePostUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa bài viết ${selectedPost?.name || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deletePost"
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
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'
import { useGlobalApiClient } from '@/composables/api'

// Lazy load components
const CreatePost = defineAsyncComponent(() => import('./create.vue'))
const EditPost = defineAsyncComponent(() => import('./edit.vue'))
const PostFilter = defineAsyncComponent(() => import('./filter.vue'))

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
    list: adminEndpoints.posts.list,
    create: adminEndpoints.posts.create,
    update: (id) => adminEndpoints.posts.update(id),
    delete: (id) => adminEndpoints.posts.delete(id)
  },
  resourceName: 'bài viết',
  defaultFilters: {
    search: '',
    status: '',
    category_id: '',
    sort_by: 'created_at_desc'
  },
  enableUrlSync: true,
  filterKeys: ['search', 'status', 'category_id', 'sort_by'],
  sortKeys: ['sort_by', 'sort_order']
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()

// State
const statusEnums = ref([])
const categoryEnums = ref([])
const tagEnums = ref([])

// Use selectedItem from composable as selectedPost
const selectedPost = selectedItem

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
    const response = await apiClient.get(adminEndpoints.enums('post_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    } else {
      statusEnums.value = []
    }
  } catch (e) {
    statusEnums.value = []
  }
  
  // TODO: Load categories and tags from API if needed
  categoryEnums.value = []
  tagEnums.value = []
}

// Modal handlers - sử dụng composable handlers
const openCreateModal = openCreateModalComposable
const closeCreateModal = closeCreateModalComposable
const openEditModal = openEditModalComposable
const closeEditModal = closeEditModalComposable
const openDeleteModal = openDeleteModalComposable
const closeDeleteModal = closeDeleteModalComposable

function confirmDelete(post) {
  openDeleteModal(post)
}

// Action handlers
async function handlePostCreated(postData) {
  try {
    await createItem(postData)
    showSuccess('Bài viết đã được tạo thành công')
  } catch (error) {
    showError('Không thể tạo bài viết')
  }
}

async function handlePostUpdated(postData) {
  try {
    await updateItem(postData)
    showSuccess('Bài viết đã được cập nhật thành công')
  } catch (error) {
    showError('Không thể cập nhật bài viết')
  }
}

async function deletePost() {
  try {
    const success = await deleteItem()
    if (success) {
      showSuccess('Bài viết đã được xóa thành công')
    } else {
      showError('Không thể xóa bài viết')
    }
  } catch (error) {
    showError('Không thể xóa bài viết')
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

// Removed getStatusClass; class is derived from API enums directly in template

function getCategoryNames(categories) {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return '—'
  }
  return categories.map(cat => cat.name).join(', ')
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