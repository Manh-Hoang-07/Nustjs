<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Quản lý bài đăng</h1>
        <p class="text-gray-600 mt-2">Quản lý tất cả bài đăng, danh mục và tags</p>
      </div>
      <div class="flex space-x-3">
        <button 
        @click="showAddModal = true"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
      >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        Thêm bài đăng
      </button>
      </div>
    </div>



    <!-- Posts Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài đăng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="4" class="px-6 py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </td>
            </tr>
            <tr v-else-if="!posts || posts.length === 0" class="text-center">
              <td colspan="4" class="px-6 py-4 text-gray-500">
                Không có bài đăng nào
              </td>
            </tr>
            <tr v-else v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <img 
                      v-if="post.featured_image"
                      :src="post.featured_image"
                      :alt="post.title"
                      class="h-12 w-12 rounded-lg object-cover"
                    >
                    <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
                    <div class="text-sm text-gray-500 line-clamp-2">{{ post.excerpt }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': post.status === 'published',
                    'bg-yellow-100 text-yellow-800': post.status === 'draft',
                    'bg-red-100 text-red-800': post.status === 'archived'
                  }"
                >
                  {{ getStatusText(post.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(post.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="editPost(post)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Sửa
                  </button>
                  <button 
                    @click="deletePost(post.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">
            {{ showEditModal ? 'Sửa bài đăng' : 'Thêm bài đăng' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="savePost" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label class="block text-sm font-medium text-gray-700">Tiêu đề *</label>
                <input 
                  v-model="form.title"
                  type="text" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Slug</label>
              <input 
                v-model="form.slug"
                type="text" 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          
              <div>
                <label class="block text-sm font-medium text-gray-700">Tóm tắt</label>
                <textarea 
                  v-model="form.excerpt"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
          
              <div>
            <label class="block text-sm font-medium text-gray-700">Nội dung</label>
            <textarea 
                  v-model="form.content"
              rows="6"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập nội dung bài viết..."
            ></textarea>
              </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select 
                  v-model="form.status"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
              <input 
              v-model="form.featured_image"
                type="text" 
                placeholder="URL ảnh"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
      
        <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? 'Đang xử lý...' : (showEditModal ? 'Cập nhật' : 'Thêm') }}
          </button>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout'
})

import { ref, computed, onMounted } from 'vue'
import useCrudAdmin from '../../composables/data/useCrudAdmin.js'
import { useToast } from '../../composables/ui/useToast.js'

const { 
  items: posts, 
  loading, 
  apiErrors,
  fetchItems: fetchAdminPosts, 
  createItem: createPost, 
  updateItem: updatePost, 
  deleteItem: deletePost
} = useCrudAdmin({
  endpoints: {
    list: '/api/admin/posts',
    create: '/api/admin/posts',
    update: '/api/admin/posts',
    delete: '/api/admin/posts'
  },
  resourceName: 'bài viết'
})

const { showToast } = useToast()

// State
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingPost = ref(null)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  featured_image: ''
})

// Computed
const publishedPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.filter(post => post.status === 'published')
})

const draftPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.filter(post => post.status === 'draft')
})

// Methods
const loadPosts = async () => {
  try {
    await fetchAdminPosts()
  } catch (err) {
    showToast('Lỗi khi tải danh sách bài viết', 'error')
  }
}

const editPost = (post) => {
  editingPost.value = post
  form.value = { ...post }
  showEditModal.value = true
}

const savePost = async () => {
  try {
    if (showEditModal.value) {
      await updatePost(editingPost.value.id, form.value)
      showToast('Cập nhật bài viết thành công', 'success')
    } else {
      await createPost(form.value)
      showToast('Thêm bài viết thành công', 'success')
    }
    closeModal()
  } catch (err) {
    showToast('Lỗi khi lưu bài viết', 'error')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingPost.value = null
  form.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featured_image: ''
  }
}

const getStatusText = (status) => {
  const statusMap = {
    published: 'Đã xuất bản',
    draft: 'Bản nháp',
    archived: 'Đã lưu trữ'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

onMounted(async () => {
  await loadPosts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 

