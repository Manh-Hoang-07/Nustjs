<template>
  <Modal v-model="modalVisible" :title="formTitle" :loading="loading">
    <FormWrapper
      :default-values="defaultValues"
      :rules="validationRules"
      :api-errors="apiErrors"
      :submit-text="tag ? 'Cập nhật' : 'Thêm mới'"
      @submit="handleSubmit"
      @cancel="onClose"
    >
      <template #default="{ form, errors, clearError, isSubmitting }">
        <!-- Tên thẻ -->
        <FormField
          v-model="form.name"
          label="Tên thẻ"
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
      </template>
    </FormWrapper>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'

const props = defineProps({
  show: Boolean,
  tag: Object,
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

const formTitle = computed(() => props.tag ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới')
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

const defaultValues = computed(() => {
  const obj = props.tag || {}
  
  // Loại bỏ slug khỏi object
  const { slug, ...tagWithoutSlug } = obj
  
  return {
    name: '',
    description: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    status: 'active',
    ...tagWithoutSlug
  }
})



const validationRules = computed(() => ({
  name: [
    { required: 'Tên thẻ là bắt buộc.' },
    { max: [255, 'Tên thẻ không được vượt quá 255 ký tự.'] }
  ],
  description: [
    { max: [500, 'Mô tả không được vượt quá 500 ký tự.'] }
  ],
  meta_title: [
    { max: [255, 'Meta title không được vượt quá 255 ký tự.'] }
  ],
  meta_description: [
    { max: [500, 'Meta description không được vượt quá 500 ký tự.'] }
  ],
  canonical_url: [
    { max: [255, 'Canonical URL không được vượt quá 255 ký tự.'] }
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
