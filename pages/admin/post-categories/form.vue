<template>
  <Modal v-model="modalVisible" :title="formTitle" :loading="loading">
    <FormWrapper
      :default-values="defaultValues"
      :rules="validationRules"
      :api-errors="apiErrors"
      :submit-text="category ? 'Cập nhật' : 'Thêm mới'"
      @submit="handleSubmit"
      @cancel="onClose"
    >
      <template #default="{ form, errors, clearError, isSubmitting }">
        <!-- Tên danh mục -->
        <FormField
          v-model="form.name"
          label="Tên danh mục"
          name="name"
          :error="errors.name"
          required
          @update:model-value="clearError('name')"
        />
        
        <!-- Mô tả -->
        <FormField
          v-model="form.description"
          label="Mô tả"
          name="description"
          type="textarea"
          :error="errors.description"
          @update:model-value="clearError('description')"
        />
        
        <!-- Ảnh danh mục -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="category-image">Ảnh danh mục</label>
          <ImageUploader
            v-model="form.image"
            :default-url="imageUrl"
            @remove="form.remove_image = true"
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
        
        <!-- Thứ tự sắp xếp -->
        <FormField
          v-model="form.sort_order"
          label="Thứ tự sắp xếp"
          name="sort_order"
          type="number"
          :error="errors.sort_order"
          @update:model-value="clearError('sort_order')"
        />
        
        <!-- Danh mục cha -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="parent_id">Danh mục cha</label>
          <SearchableSelect
            v-model="form.parent_id"
            :search-api="searchApi"
            placeholder="Tìm kiếm danh mục cha..."
            :error="errors.parent_id"
            @update:model-value="clearError('parent_id')"
          />
          <div v-if="errors.parent_id" class="mt-1 text-sm text-red-600">{{ errors.parent_id }}</div>
        </div>
        
        <!-- Meta Title -->
        <FormField
          v-model="form.meta_title"
          label="Meta Title"
          name="meta_title"
          :error="errors.meta_title"
          @update:model-value="clearError('meta_title')"
        />
        
        <!-- Meta Description -->
        <FormField
          v-model="form.meta_description"
          label="Meta Description"
          name="meta_description"
          type="textarea"
          :error="errors.meta_description"
          @update:model-value="clearError('meta_description')"
        />
        
        <!-- Canonical URL -->
        <FormField
          v-model="form.canonical_url"
          label="Canonical URL"
          name="canonical_url"
          :error="errors.canonical_url"
          @update:model-value="clearError('canonical_url')"
        />
        
        <!-- OG Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="og-image">OG Image</label>
          <ImageUploader
            v-model="form.og_image"
            :default-url="ogImageUrl"
            @remove="form.remove_og_image = true"
          />
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
import SearchableSelect from '../../../components/Core/Select/SearchableSelect.vue'
import endpoints from '../../../api/endpoints.js'
// 
const props = defineProps({
  show: Boolean,
  category: Object,
  statusEnums: {
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

const formTitle = computed(() => props.category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới')
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

const defaultValues = computed(() => {
  const obj = props.category || {}
  
  return {
    name: obj.name || '',
    description: obj.description || '',
    image: obj.image || null,
    status: obj.status || 'active',
    sort_order: obj.sort_order || 0,
    parent_id: obj.parent_id || null,
    meta_title: obj.meta_title || '',
    meta_description: obj.meta_description || '',
    canonical_url: obj.canonical_url || '',
    og_image: obj.og_image || null,
    remove_image: false,
    remove_og_image: false,
    ...obj
  }
})

const imageUrl = computed(() => {
  if (props.category?.image) {
    return props.category.image
  }
  return null
})

const ogImageUrl = computed(() => {
  if (props.category?.og_image) {
    return props.category.og_image
  }
  return null
})

const validationRules = computed(() => ({
  name: [
    { required: 'Tên danh mục là bắt buộc.' },
    { max: [255, 'Tên danh mục không được vượt quá 255 ký tự.'] }
  ],
  description: [
    { max: [500, 'Mô tả không được vượt quá 500 ký tự.'] }
  ],
  sort_order: [
    { min: [0, 'Thứ tự sắp xếp phải lớn hơn hoặc bằng 0.'] }
  ],
  meta_title: [
    { max: [255, 'Meta title không được vượt quá 255 ký tự.'] }
  ],
  meta_description: [
    { max: [500, 'Meta description không được vượt quá 500 ký tự.'] }
  ],
  canonical_url: [
    { max: [500, 'Canonical URL không được vượt quá 500 ký tự.'] }
  ]
}))

const statusOptions = computed(() =>
  (props.statusEnums || []).map(opt => ({
    value: opt.value,
    label: opt.label
  }))
)

const searchApi = computed(() => {
  // API endpoint để tìm kiếm danh mục cha
  return endpoints.postCategories.list
})

function handleSubmit(form) {
  // Loại bỏ slug khỏi dữ liệu gửi lên server
  const { slug, ...formData } = form
  emit('submit', formData)
}

function onClose() {
  emit('cancel')
}
</script>
