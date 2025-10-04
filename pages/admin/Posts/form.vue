<template>
  <Modal v-model="modalVisible" :title="formTitle">
    <form @submit.prevent="validateAndSubmit" class="space-y-4">
        <!-- Tiêu đề -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span class="text-red-500">*</span></label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :class="{ 'border-red-500': validationErrors.name || apiErrors.name }"
        />
        <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</p>
        <p v-else-if="apiErrors.name" class="mt-1 text-sm text-red-600">{{ apiErrors.name }}</p>
      </div>


        
        <!-- Tóm tắt -->
      <div>
        <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
        <textarea
          id="excerpt"
          v-model="formData.excerpt"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :class="{ 'border-red-500': validationErrors.excerpt || apiErrors.excerpt }"
        ></textarea>
        <p v-if="validationErrors.excerpt" class="mt-1 text-sm text-red-600">{{ validationErrors.excerpt }}</p>
        <p v-else-if="apiErrors.excerpt" class="mt-1 text-sm text-red-600">{{ apiErrors.excerpt }}</p>
      </div>
        
        <!-- Nội dung -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
        <textarea
          id="content"
          v-model="formData.content"
          rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :class="{ 'border-red-500': validationErrors.content || apiErrors.content }"
        ></textarea>
        <p v-if="validationErrors.content" class="mt-1 text-sm text-red-600">{{ validationErrors.content }}</p>
        <p v-else-if="apiErrors.content" class="mt-1 text-sm text-red-600">{{ apiErrors.content }}</p>
      </div>
        
        <!-- Ảnh bìa -->
        <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa</label>
          <ImageUploader
          v-model="formData.cover_image"
            :defaultUrl="coverImageUrl"
          @remove="formData.cover_image = null"
        />
        <p v-if="validationErrors.cover_image" class="mt-1 text-sm text-red-600">{{ validationErrors.cover_image }}</p>
        <p v-else-if="apiErrors.cover_image" class="mt-1 text-sm text-red-600">{{ apiErrors.cover_image }}</p>
      </div>

      <!-- Ảnh đại diện -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
          <ImageUploader
          v-model="formData.image"
          :defaultUrl="imageUrl"
          @remove="formData.image = null"
        />
        <p v-if="validationErrors.image" class="mt-1 text-sm text-red-600">{{ validationErrors.image }}</p>
        <p v-else-if="apiErrors.image" class="mt-1 text-sm text-red-600">{{ apiErrors.image }}</p>
        </div>
        
        <!-- Trạng thái -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
        <SearchableSelect
          id="status"
          v-model="formData.status"
          :search-api="statusApi"
          label-field="label"
          value-field="value"
          placeholder="-- Chọn trạng thái --"
          :error="validationErrors.status || apiErrors.status"
        />
        <p v-if="validationErrors.status" class="mt-1 text-sm text-red-600">{{ validationErrors.status }}</p>
        <p v-else-if="apiErrors.status" class="mt-1 text-sm text-red-600">{{ apiErrors.status }}</p>
      </div>

      <!-- Ngày xuất bản -->
      <div>
        <label for="published_at" class="block text-sm font-medium text-gray-700 mb-1">Ngày xuất bản</label>
        <input
          id="published_at"
          v-model="formData.published_at"
          type="datetime-local"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :class="{ 'border-red-500': validationErrors.published_at || apiErrors.published_at }"
        />
        <p v-if="validationErrors.published_at" class="mt-1 text-sm text-red-600">{{ validationErrors.published_at }}</p>
        <p v-else-if="apiErrors.published_at" class="mt-1 text-sm text-red-600">{{ apiErrors.published_at }}</p>
      </div>

      <!-- Danh mục chính -->
      <div>
        <label for="primary_postcategory_id" class="block text-sm font-medium text-gray-700 mb-1">Danh mục chính</label>
        <SearchableSelect
          v-model="formData.primary_postcategory_id"
          :search-api="adminEndpoints.postCategories?.list || '/api/admin/post-categories'"
          :label-field="'name'"
          placeholder="Chọn danh mục chính"
          :error="validationErrors.primary_postcategory_id || apiErrors.primary_postcategory_id"
        />
        <p v-if="validationErrors.primary_postcategory_id" class="mt-1 text-sm text-red-600">{{ validationErrors.primary_postcategory_id }}</p>
        <p v-else-if="apiErrors.primary_postcategory_id" class="mt-1 text-sm text-red-600">{{ apiErrors.primary_postcategory_id }}</p>
      </div>
        
        <!-- Danh mục -->
      <div>
        <SearchableMultiSelect
          v-model="formData.category_ids"
          :search-api="adminEndpoints.postCategories?.list || '/api/admin/post-categories'"
          :label-field="'name'"
          placeholder="Chọn danh mục"
          :error="validationErrors.category_ids || apiErrors.category_ids"
        />
      </div>
        
        <!-- Thẻ -->
      <div>
        <SearchableMultiSelect
          v-model="formData.tag_ids"
          :search-api="adminEndpoints.postTags?.list || '/api/admin/post-tags'"
          :label-field="'name'"
          placeholder="Chọn thẻ"
          :error="validationErrors.tag_ids || apiErrors.tag_ids"
        />
      </div>
        
        <!-- Nổi bật -->
        <div class="flex items-center">
          <input
          v-model="formData.is_featured"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label class="ml-2 text-sm text-gray-700">Nổi bật</label>
        </div>
        
        <!-- Ghim -->
        <div class="flex items-center">
          <input
          v-model="formData.is_pinned"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label class="ml-2 text-sm text-gray-700">Ghim</label>
        </div>

      <!-- SEO Meta Title -->
      <div>
        <label for="meta_title" class="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
        <input
          id="meta_title"
          v-model="formData.meta_title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :class="{ 'border-red-500': validationErrors.meta_title || apiErrors.meta_title }"
        />
        <p v-if="validationErrors.meta_title" class="mt-1 text-sm text-red-600">{{ validationErrors.meta_title }}</p>
        <p v-else-if="apiErrors.meta_title" class="mt-1 text-sm text-red-600">{{ apiErrors.meta_title }}</p>
      </div>

      <!-- SEO Meta Description -->
      <div>
        <label for="meta_description" class="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
        <textarea
          id="meta_description"
          v-model="formData.meta_description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :class="{ 'border-red-500': validationErrors.meta_description || apiErrors.meta_description }"
        ></textarea>
        <p v-if="validationErrors.meta_description" class="mt-1 text-sm text-red-600">{{ validationErrors.meta_description }}</p>
        <p v-else-if="apiErrors.meta_description" class="mt-1 text-sm text-red-600">{{ apiErrors.meta_description }}</p>
      </div>

      <!-- Canonical URL -->
      <div>
        <label for="canonical_url" class="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
        <input
          id="canonical_url"
          v-model="formData.canonical_url"
          type="url"
          placeholder="https://example.com/page"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          :class="{ 'border-red-500': validationErrors.canonical_url || apiErrors.canonical_url }"
        />
        <p v-if="validationErrors.canonical_url" class="mt-1 text-sm text-red-600">{{ validationErrors.canonical_url }}</p>
        <p v-else-if="apiErrors.canonical_url" class="mt-1 text-sm text-red-600">{{ apiErrors.canonical_url }}</p>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="onClose"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Hủy
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Đang xử lý...' : (post ? 'Cập nhật' : 'Thêm mới') }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed, reactive, watch, nextTick } from 'vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import ImageUploader from '@/components/Core/Image/ImageUploader.vue'
import SearchableSelect from '@/components/Core/Select/SearchableSelect.vue'
import SearchableMultiSelect from '@/components/Core/Select/SearchableMultiSelect.vue'
import { adminEndpoints } from '@/api/endpoints'


const props = defineProps({
  show: Boolean,
  post: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  categoryEnums: {
    type: Array,
    default: () => []
  },
  tagEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

// API cho enum trạng thái
const statusApi = adminEndpoints.enums('post_status')

//



// Form title
const formTitle = computed(() => props.post ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới')

// Modal visibility
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

// Image URLs for ImageUploader
const coverImageUrl = computed(() => {
  if (props.post?.cover_image) {
    return props.post.cover_image
  }
  return null
})

const imageUrl = computed(() => {
  if (props.post?.image) {
    return props.post.image
  }
  return null
})

// Form data
const formData = reactive({
    name: '',
    excerpt: '',
    content: '',
    cover_image: null,
  image: null,
  status: '',
  published_at: '',
  primary_postcategory_id: '',
  category_ids: [],
  tag_ids: [],
    is_featured: false,
    is_pinned: false,
  meta_title: '',
  meta_description: '',
  canonical_url: ''
})





// Form state
const validationErrors = reactive({})
const isSubmitting = ref(false)

// Watch post prop to update form data
watch(() => props.post, async (newVal) => {
  if (newVal) {
    formData.name = newVal.name || ''
    formData.excerpt = newVal.excerpt || ''
    formData.content = newVal.content || ''
    
    // Xử lý ảnh - set URL vào v-model để ImageUploader hiển thị
    // Chỉ set ảnh nếu URL hợp lệ (không phải placeholder)
    formData.cover_image = (newVal.cover_image && !newVal.cover_image.includes('via.placeholder')) ? newVal.cover_image : null
    formData.image = (newVal.image && !newVal.image.includes('via.placeholder')) ? newVal.image : null
    
    formData.status = newVal.status !== undefined ? newVal.status : ''
    formData.published_at = newVal.published_at ? formatDateTimeForInput(newVal.published_at) : ''
    formData.primary_postcategory_id = newVal.primary_postcategory_id || ''
    
    // Xử lý categories
    if (newVal.categories && Array.isArray(newVal.categories)) {
      formData.category_ids = newVal.categories.map(cat => cat.id)
    } else {
      formData.category_ids = []
    }
    
    // Xử lý tags
    if (newVal.tags && Array.isArray(newVal.tags)) {
      formData.tag_ids = newVal.tags.map(tag => tag.id)
    } else {
      formData.tag_ids = []
    }
    
    formData.is_featured = newVal.is_featured || false
    formData.is_pinned = newVal.is_pinned || false
    formData.meta_title = newVal.meta_title || ''
    formData.meta_description = newVal.meta_description || ''
    formData.canonical_url = newVal.canonical_url || ''
    

    
    // Đảm bảo DOM được cập nhật
    await nextTick()
  } else {
    // Khi tạo mới, set giá trị mặc định
    formData.name = ''
    formData.excerpt = ''
    formData.content = ''
    formData.cover_image = null
    formData.image = null
    formData.status = 'draft'
    formData.published_at = ''
    formData.primary_postcategory_id = ''
    formData.category_ids = []
    formData.tag_ids = []
    formData.is_featured = false
    formData.is_pinned = false
    formData.meta_title = ''
    formData.meta_description = ''
    formData.canonical_url = ''
    clearErrors()
  }
}, { immediate: true })

// Reset form
function resetForm() {
  formData.name = ''
  formData.excerpt = ''
  formData.content = ''
  formData.cover_image = null
  formData.image = null
  formData.status = ''
  formData.published_at = ''
  formData.primary_postcategory_id = ''
  formData.category_ids = []
  formData.tag_ids = []
  formData.is_featured = false
  formData.is_pinned = false
  formData.meta_title = ''
  formData.meta_description = ''
  formData.canonical_url = ''
  clearErrors()
}

// Format datetime for input
function formatDateTimeForInput(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Clear errors
function clearErrors() {
  Object.keys(validationErrors).forEach(key => delete validationErrors[key])
}

// Validation rules
const validationRules = computed(() => ({
  name: [
    { required: 'Tiêu đề là bắt buộc' }
  ]
}))

function validateForm() {
  clearErrors()
  let valid = true
  const rules = validationRules.value
  for (const field in rules) {
    for (const rule of rules[field]) {
      if (rule.required && !formData[field]) {
        validationErrors[field] = rule.required
        valid = false
        break
      }
    }
  }
  return valid
}

// Validate and submit form
function validateAndSubmit() {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Tạo object data thay vì FormData
    const submitData = {
      name: formData.name,
      excerpt: formData.excerpt,
      content: formData.content,
      cover_image: formData.cover_image,
      image: formData.image,
      status: formData.status,
      published_at: formData.published_at || null,
      primary_postcategory_id: formData.primary_postcategory_id || null,
      category_ids: formData.category_ids,
      tag_ids: formData.tag_ids,
      is_featured: formData.is_featured,
      is_pinned: formData.is_pinned,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      canonical_url: formData.canonical_url
    }
    
    emit('submit', submitData)
  } finally {
    isSubmitting.value = false
  }
}

// Close modal
function onClose() {
  emit('cancel')
}

//


</script>
