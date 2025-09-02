<template>
  <Modal v-model="modalVisible" :title="formTitle" :loading="loading">
    <FormWrapper
      :default-values="defaultValues"
      :rules="validationRules"
      :api-errors="apiErrors"
      :submit-text="post ? 'Cập nhật' : 'Thêm mới'"
      @submit="handleSubmit"
      @cancel="onClose"
    >
      <template #default="{ form, errors, clearError, isSubmitting }">
        <!-- Tiêu đề -->
        <FormField
          v-model="form.name"
          label="Tiêu đề"
          name="name"
          :error="errors.name"
          required
          @update:model-value="clearError('name')"
        />
        
        <!-- Slug -->
        <FormField
          v-model="form.slug"
          label="Slug"
          name="slug"
          :error="errors.slug"
          @update:model-value="clearError('slug')"
        />
        
        <!-- Tóm tắt -->
        <FormField
          v-model="form.excerpt"
          label="Tóm tắt"
          name="excerpt"
          type="textarea"
          :error="errors.excerpt"
          @update:model-value="clearError('excerpt')"
        />
        
        <!-- Nội dung -->
        <FormField
          v-model="form.content"
          label="Nội dung"
          name="content"
          type="textarea"
          :error="errors.content"
          @update:model-value="clearError('content')"
        />
        
        <!-- Ảnh bìa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="post-cover">Ảnh bìa</label>
          <ImageUploader
            v-model="form.cover_image"
            :default-url="coverImageUrl"
            @remove="form.remove_cover_image = true"
          />
        </div>
        
        <!-- Trạng thái -->
        <FormField
          v-model="form.status"
          label="Trạng thái"
          name="status"
          type="select"
          :options="statusOptions"
          :error="errors.status"
          @update:model-value="clearError('status')"
        />
        
        <!-- Danh mục -->
        <FormField
          v-model="form.category_ids"
          label="Danh mục"
          name="category_ids"
          type="select"
          :options="categoryOptions"
          :error="errors.category_ids"
          multiple
          @update:model-value="clearError('category_ids')"
        />
        
        <!-- Thẻ -->
        <FormField
          v-model="form.tag_ids"
          label="Thẻ"
          name="tag_ids"
          type="select"
          :options="tagOptions"
          :error="errors.tag_ids"
          multiple
          @update:model-value="clearError('tag_ids')"
        />
        
        <!-- Nổi bật -->
        <div class="flex items-center">
          <input
            v-model="form.is_featured"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label class="ml-2 text-sm text-gray-700">Nổi bật</label>
        </div>
        
        <!-- Ghim -->
        <div class="flex items-center">
          <input
            v-model="form.is_pinned"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label class="ml-2 text-sm text-gray-700">Ghim</label>
        </div>
      </template>
    </FormWrapper>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '../../../components/Core/Modal/Modal.vue'
import FormWrapper from '../../../components/Core/Form/FormWrapper.vue'
import FormField from '../../../components/Core/Form/FormField.vue'
import ImageUploader from '../../../components/Core/Image/ImageUploader.vue'
// import { useUrl } from '../../../utils/useUrl.js'

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
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formTitle = computed(() => props.post ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới')
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

const defaultValues = computed(() => {
  const obj = props.post || {}
  
  // Extract category_ids from categories array if exists
  let categoryIds = []
  if (obj.categories && Array.isArray(obj.categories)) {
    categoryIds = obj.categories.map(category => category.id)
  }
  
  // Extract tag_ids from tags array if exists
  let tagIds = []
  if (obj.tags && Array.isArray(obj.tags)) {
    tagIds = obj.tags.map(tag => tag.id)
  }
  
  return {
    name: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: null,
    status: 'draft',
    category_ids: categoryIds,
    tag_ids: tagIds,
    is_featured: false,
    is_pinned: false,
    remove_cover_image: false,
    ...obj
  }
})

// const coverImageUrl = useUrl(props, 'post', 'cover_image')
const coverImageUrl = computed(() => null)

const validationRules = computed(() => ({
  name: [
    { required: 'Tiêu đề là bắt buộc.' },
    { max: [255, 'Tiêu đề không được vượt quá 255 ký tự.'] }
  ],
  slug: [
    { max: [255, 'Slug không được vượt quá 255 ký tự.'] }
  ],
  excerpt: [
    { max: [500, 'Tóm tắt không được vượt quá 500 ký tự.'] }
  ],
  content: [
    { max: [10000, 'Nội dung không được vượt quá 10000 ký tự.'] }
  ]
}))

const statusOptions = computed(() =>
  (props.statusEnums || []).map(opt => ({
    value: opt.value,
    label: opt.label
  }))
)

const categoryOptions = computed(() =>
  (props.categoryEnums || []).map(opt => ({
    value: opt.id,
    label: opt.name
  }))
)

const tagOptions = computed(() =>
  (props.tagEnums || []).map(opt => ({
    value: opt.id,
    label: opt.name
  }))
)

function handleSubmit(form) {
  emit('submit', form)
}

function onClose() {
  emit('cancel')
}
</script>
