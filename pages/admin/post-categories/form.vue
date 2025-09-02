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
        
        <!-- Slug -->
        <FormField
          v-model="form.slug"
          label="Slug"
          name="slug"
          :error="errors.slug"
          @update:model-value="clearError('slug')"
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
    name: '',
    slug: '',
    description: '',
    image: null,
    status: 'active',
    sort_order: 0,
    remove_image: false,
    ...obj
  }
})

// const imageUrl = useUrl(props, 'category', 'image')
const imageUrl = computed(() => null)

const validationRules = computed(() => ({
  name: [
    { required: 'Tên danh mục là bắt buộc.' },
    { max: [255, 'Tên danh mục không được vượt quá 255 ký tự.'] }
  ],
  slug: [
    { max: [255, 'Slug không được vượt quá 255 ký tự.'] }
  ],
  description: [
    { max: [500, 'Mô tả không được vượt quá 500 ký tự.'] }
  ],
  sort_order: [
    { min: [0, 'Thứ tự sắp xếp phải lớn hơn hoặc bằng 0.'] }
  ]
}))

const statusOptions = computed(() =>
  (props.statusEnums || []).map(opt => ({
    value: opt.value,
    label: opt.label
  }))
)

function handleSubmit(form) {
  emit('submit', form)
}

function onClose() {
  emit('cancel')
}
</script>
