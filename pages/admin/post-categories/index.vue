<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        <p class="text-gray-600 mt-2">Quản lý các danh mục bài viết</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Thêm danh mục
      </button>
    </div>



    <!-- Categories Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số bài viết</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="px-6 py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </td>
            </tr>
            <tr v-else-if="!categories || categories.length === 0" class="text-center">
              <td colspan="6" class="px-6 py-4 text-gray-500">
                Không có danh mục nào
              </td>
            </tr>
            <tr v-else v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.slug }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="max-w-xs truncate">{{ category.description || 'Không có mô tả' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ category.post_count || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': category.status === 'active',
                    'bg-red-100 text-red-800': category.status === 'inactive'
                  }"
                >
                  {{ getStatusText(category.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Actions 
                  :item="category"
                  @edit="editCategory"
                  @delete="(item) => handleDeleteCategory(item.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-if="showAddModal || showEditModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          {{ showEditModal ? 'Sửa danh mục' : 'Thêm danh mục' }}
        </h3>
      </template>
      
      <template #body>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tên danh mục *</label>
            <input 
              v-model="form.name"
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
            <p class="mt-1 text-sm text-gray-500">Để trống để tự động tạo từ tên danh mục</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea 
              v-model="form.description"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select 
              v-model="form.status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </form>
      </template>
      
      <template #footer>
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
            @click="saveCategory"
            :disabled="loading"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? 'Đang xử lý...' : (showEditModal ? 'Cập nhật' : 'Thêm') }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout'
})

import { ref, computed, onMounted } from 'vue'
import useCrudAdmin from '../../composables/data/useCrudAdmin.js'
import { useToast } from '../../composables/ui/useToast.js'
import Actions from '../../components/Core/Actions/Actions.vue'
import Modal from '../../components/Core/Modal/Modal.vue'

const { 
  items: categories, 
  loading, 
  apiErrors,
  fetchItems: fetchCategories,
  createItem: createCategory,
  updateItem: updateCategory,
  deleteItem: deleteCategory
} = useCrudAdmin({
  endpoints: {
    list: '/api/admin/post-categories',
    create: '/api/admin/post-categories',
    update: '/api/admin/post-categories',
    delete: '/api/admin/post-categories'
  },
  resourceName: 'danh mục bài viết'
})

const { showToast } = useToast()

// State
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)

const form = ref({
  name: '',
  slug: '',
  description: '',
  status: 'active'
})

// Computed
const totalPosts = computed(() => {
  if (!categories.value || !Array.isArray(categories.value)) return 0
  return categories.value.reduce((total, category) => total + (category.post_count || 0), 0)
})

const popularCategory = computed(() => {
  if (!categories.value || !Array.isArray(categories.value) || categories.value.length === 0) return null
  return categories.value.reduce((max, category) => 
    (category.post_count || 0) > (max.post_count || 0) ? category : max
  )
})

// Methods
const loadCategories = async () => {
  try {
    await fetchCategories()
  } catch (err) {
    showToast('Lỗi khi tải danh sách danh mục', 'error')
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  form.value = { ...category }
  showEditModal.value = true
}

const saveCategory = async () => {
  try {
    if (showEditModal.value) {
      await updateCategory(editingCategory.value.id, form.value)
      showToast('Cập nhật danh mục thành công', 'success')
    } else {
      await createCategory(form.value)
      showToast('Thêm danh mục thành công', 'success')
    }
    closeModal()
  } catch (err) {
    showToast('Lỗi khi lưu danh mục', 'error')
  }
}

const handleDeleteCategory = async (id) => {
  try {
    await deleteCategory(id)
    showToast('Xóa danh mục thành công', 'success')
  } catch (err) {
    showToast('Lỗi khi xóa danh mục', 'error')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  form.value = {
    name: '',
    slug: '',
    description: '',
    status: 'active'
  }
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động'
  }
  return statusMap[status] || status
}

onMounted(async () => {
  await loadCategories()
})
</script>

