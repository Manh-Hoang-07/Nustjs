<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Qu?n l� b�i vi?t</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Th�m b�i vi?t m?i
      </button>
    </div>

    <!-- B? l?c -->
    <PostFilter 
      :initial-filters="filters"
      @update:filters="handleFilterUpdate" 
    />

    <!-- B?ng d? li?u -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="6" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ti�u d?</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh m?c</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tr?ng th�i</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ng�y t?o</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao t�c</th>
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
              Kh�ng c� d? li?u
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ph�n trang -->
    <Pagination 
      v-if="items.length > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      :loading="loading"
      @page-change="handlePageChange"
    />

    <!-- Modal th�m m?i -->
    <CreatePost
      v-if="showCreateModal"
      :show="showCreateModal"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :tag-enums="tagEnums"
      :on-close="closeCreateModal"
      @created="handlePostCreated"
    />

    <!-- Modal ch?nh s?a -->
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

    <!-- Modal x�c nh?n x�a -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="X�c nh?n x�a"
      :message="`B?n c� ch?c ch?n mu?n x�a b�i vi?t ${selectedPost?.name || ''}?`"
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
import { useDataTable } from '@/composables/data/useDataTable'
import { useToast } from '@/composables/ui/useToast'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'
import { useApiClient } from '@/composables/api/useApiClient'

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
} = useDataTable(adminEndpoints.posts.list, {
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
const { apiClient } = useApiClient()

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
  // Load enums via API
  await fetchEnums()
  
  // Fetch posts
  await fetchData()
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
  showSuccess('B�i vi?t d� du?c t?o th�nh c�ng')
}

async function handlePostUpdated() {
  await fetchData()
  closeEditModal()
  showSuccess('B�i vi?t d� du?c c?p nh?t th�nh c�ng')
}

async function deletePost() {
  try {
    await deleteItem(selectedPost.value.id)
    closeDeleteModal()
    showSuccess('B�i vi?t d� du?c x�a th�nh c�ng')
  } catch (error) {
    showError('Kh�ng th? x�a b�i vi?t')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Status helper functions
function getStatusLabel(status) {
  const found = (statusEnums.value || []).find(s => s.value === status)
  return found?.label || status || 'Kh�ng x�c d?nh'
}

// Removed getStatusClass; class is derived from API enums directly in template

function getCategoryNames(categories) {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return '�'
  }
  return categories.map(cat => cat.name).join(', ')
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>

<style>
/* Cho ph�p cu?n ngang table khi m�n h�nh nh? */
.table-responsive {
  overflow-x: auto;
}
</style> 

