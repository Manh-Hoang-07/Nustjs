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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài viết</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thẻ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in items" :key="post.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img 
                    v-if="post.cover_image" 
                    :src="post.cover_image" 
                    :alt="post.name"
                    class="h-10 w-10 rounded-lg object-cover"
                  />
                  <div v-else class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  </div>
                  <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ post.name }}</div>
                  <div class="text-sm text-gray-500">{{ post.slug }}</div>
                  <div v-if="post.excerpt" class="text-sm text-gray-400 mt-1 line-clamp-2">
                    {{ post.excerpt }}
                  </div>
                  </div>
                </div>
              </td>
            <td class="px-6 py-4">
              <div v-if="post.categories && post.categories.length > 0">
                <span 
                  v-for="category in post.categories" 
                  :key="category.id"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1"
                >
                  {{ category.name }}
                </span>
              </div>
              <span v-else class="text-gray-400 text-sm">Không có</span>
              </td>
            <td class="px-6 py-4">
              <div v-if="post.tags && post.tags.length > 0">
                  <span 
                    v-for="tag in post.tags" 
                    :key="tag.id"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-1 mb-1"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              <span v-else class="text-gray-400 text-sm">Không có</span>
              </td>
            <td class="px-6 py-4">
                <span 
                  :class="{
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                    'bg-green-100 text-green-800': post.status === 'published',
                    'bg-yellow-100 text-yellow-800': post.status === 'draft',
                  'bg-red-100 text-red-800': post.status === 'archived',
                  'bg-gray-100 text-gray-800': !post.status
                  }"
                >
                  {{ getStatusText(post.status) }}
              </span>
              <div v-if="post.is_featured" class="mt-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Nổi bật
                </span>
              </div>
              <div v-if="post.is_pinned" class="mt-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  Ghim
                </span>
              </div>
              </td>
            <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(post.created_at) }}
              </td>
            <td class="px-6 py-4 text-sm font-medium">
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
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Hiển thị {{ pagination.from }} đến {{ pagination.to }} trên tổng số {{ pagination.total }} bản ghi
      </div>
      <div class="flex space-x-1">
        <button 
          v-for="page in pagination.links" 
          :key="page.label"
          @click="changePage(page.url)"
          :disabled="!page.url"
          :class="[
            'px-3 py-1 border rounded',
            page.active 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50',
            !page.url && 'opacity-50 cursor-not-allowed'
          ]"
        >
          {{ page.label }}
        </button>
      </div>
    </div>

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

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" :title="'Xác nhận xóa'">
      <div class="text-center">
        <p class="text-gray-600 mb-4">Bạn có chắc chắn muốn xóa bài viết này không?</p>
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
import { useDataTable } from '../../../composables/data/useDataTable.js'
import { useToast } from '../../../composables/ui/useToast.js'
import { useApiClient } from '../../../composables/api/useApiClient.js'
import SkeletonLoader from '../../../components/Core/Loading/SkeletonLoader.vue'
import Modal from '../../../components/Core/Modal/Modal.vue'
import Actions from '../../../components/Core/Actions/Actions.vue'
import PostFilter from './filter.vue'
import CreatePost from './create.vue'
import EditPost from './edit.vue'

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters,
  fetchData, 
  updateFilters,
  deleteItem 
} = useDataTable('/api/admin/posts', {
  defaultFilters: {
    search: '',
    status: '',
    category_id: '',
    sort_by: 'created_at_desc'
  }
})

const { showSuccess, showError } = useToast()
const apiClient = useApiClient()

// State
const selectedPost = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Enums and options
const statusEnums = ref([])
const categoryEnums = ref([])
const tagEnums = ref([])

// Fetch data
onMounted(async () => {
  // Load enums and options
  await loadEnums()
  await fetchData()
})

// Load enums and options
async function loadEnums() {
  try {
    // Load categories
    const categoriesResponse = await apiClient.get('/api/admin/post-categories')
    if (categoriesResponse.data.success) {
      categoryEnums.value = categoriesResponse.data.data.data || []
    }
    
    // Load tags
    const tagsResponse = await apiClient.get('/api/admin/post-tags')
    if (tagsResponse.data.success) {
      tagEnums.value = tagsResponse.data.data.data || []
    }
    
    // Status options
    statusEnums.value = [
      { value: 'draft', label: 'Bản nháp' },
      { value: 'published', label: 'Xuất bản' },
      { value: 'archived', label: 'Lưu trữ' }
    ]
  } catch (error) {
    console.error('Error loading enums:', error)
    showError('Không thể tải dữ liệu cần thiết')
  }
}

// Filter handlers
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

function openEditModal(post) {
  selectedPost.value = post
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  selectedPost.value = null
}

function openDeleteModal(post) {
  selectedPost.value = post
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedPost.value = null
}

// CRUD operations
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

async function confirmDelete(post) {
  openDeleteModal(post)
}

async function handleDelete() {
  try {
    await deleteItem(selectedPost.value.id)
    showSuccess('Xóa bài viết thành công')
    closeDeleteModal()
    await fetchData()
  } catch (error) {
    showError('Lỗi khi xóa bài viết')
  }
}

function changePage(url) {
  if (!url) return
  
  const urlObj = new URL(url)
  const page = urlObj.searchParams.get('page')
  fetchData({ page })
}

function getStatusText(status) {
  const statusMap = {
    'published': 'Xuất bản',
    'draft': 'Bản nháp',
    'archived': 'Lưu trữ'
  }
  return statusMap[status] || 'Không xác định'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 

