<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Quản lý Tags</h1>
        <p class="text-gray-600 mt-2">Quản lý các tags bài viết</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Thêm Tag
      </button>
    </div>



    <!-- Search and Filters -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm tags..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
        </div>
        <select 
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="name">Sắp xếp theo tên</option>
          <option value="posts">Sắp xếp theo số bài viết</option>
          <option value="created">Sắp xếp theo ngày tạo</option>
        </select>
        <button 
          @click="loadTags"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Lọc
        </button>
      </div>
    </div>

    <!-- Tags Grid -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <div v-else-if="filteredTags.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy tags</h3>
          <p class="mt-1 text-sm text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="tag in filteredTags" 
            :key="tag.id"
            class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 class="text-lg font-semibold text-gray-900">{{ tag.name }}</h3>
              </div>
              <Actions 
                :item="tag"
                @edit="editTag"
                @delete="(item) => handleDeleteTag(item.id)"
                size="sm"
              />
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Slug:</span>
                <span class="text-gray-900 font-mono">{{ tag.slug }}</span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Số bài viết:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ tag.post_count || 0 }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Trạng thái:</span>
                <span 
                  :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': tag.status === 'active',
                    'bg-red-100 text-red-800': tag.status === 'inactive'
                  }"
                >
                  {{ getStatusText(tag.status) }}
                </span>
              </div>
              
              <div v-if="tag.description" class="text-sm text-gray-600 mt-2">
                {{ tag.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-if="showAddModal || showEditModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          {{ showEditModal ? 'Sửa Tag' : 'Thêm Tag' }}
        </h3>
      </template>
      
      <template #body>
        <form @submit.prevent="saveTag" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tên Tag *</label>
            <input 
              v-model="form.name"
              type="text" 
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Slug</label>
            <input 
              v-model="form.slug"
              type="text" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
            <p class="mt-1 text-sm text-gray-500">Để trống để tự động tạo từ tên tag</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea 
              v-model="form.description"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select 
              v-model="form.status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            @click="saveTag"
            :disabled="loading"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
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

import { ref, computed, onMounted, watch } from 'vue'
import useCrudAdmin from '../../composables/data/useCrudAdmin.js'
import { useToast } from '../../composables/ui/useToast.js'
import Actions from '../../components/Core/Actions/Actions.vue'
import Modal from '../../components/Core/Modal/Modal.vue'

const { 
  items: tags, 
  loading, 
  apiErrors,
  fetchItems: fetchTags,
  createItem: createTag,
  updateItem: updateTag,
  deleteItem: deleteTag
} = useCrudAdmin({
  endpoints: {
    list: '/api/admin/post-tags',
    create: '/api/admin/post-tags',
    update: '/api/admin/post-tags',
    delete: '/api/admin/post-tags'
  },
  resourceName: 'thẻ bài viết'
})

const { showToast } = useToast()

// State
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingTag = ref(null)
const searchQuery = ref('')
const sortBy = ref('name')

const form = ref({
  name: '',
  slug: '',
  description: '',
  status: 'active'
})

// Computed
const filteredTags = computed(() => {
  if (!tags.value || !Array.isArray(tags.value)) return []
  
  let filtered = tags.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Sort tags
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'posts':
        return (b.post_count || 0) - (a.post_count || 0)
      case 'created':
        return new Date(b.created_at) - new Date(a.created_at)
      default: // name
        return a.name.localeCompare(b.name)
    }
  })
  
  return filtered
})

const totalPosts = computed(() => {
  if (!tags.value || !Array.isArray(tags.value)) return 0
  return tags.value.reduce((total, tag) => total + (tag.post_count || 0), 0)
})

const popularTag = computed(() => {
  if (!tags.value || !Array.isArray(tags.value) || tags.value.length === 0) return null
  return tags.value.reduce((max, tag) => 
    (tag.post_count || 0) > (max.post_count || 0) ? tag : max
  )
})

// Methods
const loadTags = async () => {
  try {
    await fetchTags()
  } catch (err) {
    showToast('Lỗi khi tải danh sách tags', 'error')
  }
}

const editTag = (tag) => {
  editingTag.value = tag
  form.value = { ...tag }
  showEditModal.value = true
}

const saveTag = async () => {
  try {
    if (showEditModal.value) {
      await updateTag(editingTag.value.id, form.value)
      showToast('Cập nhật tag thành công', 'success')
    } else {
      await createTag(form.value)
      showToast('Thêm tag thành công', 'success')
    }
    closeModal()
  } catch (err) {
    showToast('Lỗi khi lưu tag', 'error')
  }
}

const handleDeleteTag = async (id) => {
  try {
    await deleteTag(id)
    showToast('Xóa tag thành công', 'success')
  } catch (err) {
    showToast('Lỗi khi xóa tag', 'error')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingTag.value = null
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

// Watchers
watch([searchQuery, sortBy], () => {
  // Re-filter when search or sort changes
})

onMounted(async () => {
  await loadTags()
})
</script>

