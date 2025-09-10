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
                :class="getStatusClass(post.status)"
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
      v-if="showCreateModal"
      :show="showCreateModal"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :tag-enums="tagEnums"
      :on-close="closeCreateModal"
      @created="handlePostCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditPost
      v-if="showEditModal"
      :show="showEditModal"
      :post="selectedPost"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :tag-enums="tagEnums"
      :on-close="closeEditModal"
      @updated="handlePostUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
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

import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { getEnumSync, getEnumLabel } from '../../../constants/enums.js'
import { useDataTable } from '../../../composables/data/useDataTable.js'
import { useToast } from '../../../composables/ui/useToast.js'
import SkeletonLoader from '../../../components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '../../../components/Core/Modal/ConfirmModal.vue'
import Actions from '../../../components/Core/Actions/Actions.vue'
import Pagination from '../../../components/Core/Navigation/Pagination.vue'
import endpoints from '../../../api/endpoints.js'

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
  deleteItem 
} = useDataTable(endpoints.posts.list, {
  defaultFilters: {
    search: '',
    status: '',
    category_id: '',
    sort_by: 'created_at_desc'
  }
})

const { showSuccess, showError } = useToast()

// State
const selectedPost = ref(null)
const statusEnums = ref([])
const categoryEnums = ref([])
const tagEnums = ref([])

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Fetch data
onMounted(async () => {
  // Load enums immediately (static)
  fetchEnums()
  
  // Fetch posts
  await fetchData()
})

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

function fetchEnums() {
  // Sử dụng static enum thay vì gọi API
  statusEnums.value = [
    { value: 'draft', label: 'Bản nháp' },
    { value: 'published', label: 'Xuất bản' },
    { value: 'scheduled', label: 'Lên lịch' },
    { value: 'archived', label: 'Lưu trữ' }
  ]
  
  // TODO: Load categories and tags from API if needed
  categoryEnums.value = []
  tagEnums.value = []
}

// Modal handlers
function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function openEditModal(post) {
  selectedPost.value = post
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  selectedPost.value = null
}

function confirmDelete(post) {
  selectedPost.value = post
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedPost.value = null
}

// Action handlers
async function handlePostCreated() {
  await fetchData()
  closeCreateModal()
  showSuccess('Bài viết đã được tạo thành công')
}

async function handlePostUpdated() {
  await fetchData()
  closeEditModal()
  showSuccess('Bài viết đã được cập nhật thành công')
}

async function deletePost() {
  try {
    await deleteItem(selectedPost.value.id)
    closeDeleteModal()
    showSuccess('Bài viết đã được xóa thành công')
  } catch (error) {
    showError('Không thể xóa bài viết')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Status helper functions
function getStatusLabel(status) {
  const statusMap = {
    'published': 'Xuất bản',
    'draft': 'Bản nháp',
    'scheduled': 'Lên lịch',
    'archived': 'Lưu trữ'
  }
  return statusMap[status] || status || 'Không xác định'
}

function getStatusClass(status) {
  if (status === 'published') return 'bg-green-100 text-green-800'
  if (status === 'draft') return 'bg-yellow-100 text-yellow-800'
  if (status === 'scheduled') return 'bg-blue-100 text-blue-800'
  if (status === 'archived') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

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

