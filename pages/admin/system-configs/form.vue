<template>
  <Modal v-model="modalVisible" :title="formTitle" :loading="loading">
    <FormWrapper
      :default-values="defaultValues"
      :rules="validationRules"
      :api-errors="apiErrors"
      :submit-text="config ? 'Cập nhật' : 'Thêm mới'"
      @submit="handleSubmit"
      @cancel="onClose"
    >
      <template #default="{ form, errors, clearError, isSubmitting }">
        <!-- Key cấu hình -->
        <FormField
          v-model="form.key"
          label="Key cấu hình"
          name="key"
          :error="errors.key"
          required
          placeholder="VD: app.name, mail.host"
          @update:model-value="clearError('key')"
        />
        
        <!-- Value -->
        <FormField
          v-model="form.value"
          label="Giá trị cấu hình"
          name="value"
          type="textarea"
          :error="errors.value"
          required
          placeholder="Nhập giá trị cấu hình..."
          @update:model-value="clearError('value')"
        />
        
        <!-- Type -->
        <FormField
          v-model="form.type"
          label="Loại dữ liệu"
          name="type"
          type="select"
          :error="errors.type"
          :options="typeOptions"
          required
          placeholder="-- Chọn loại dữ liệu --"
          @update:model-value="clearError('type')"
        />
        
        <!-- Group -->
        <FormField
          v-model="form.group"
          label="Nhóm cấu hình"
          name="group"
          type="select"
          :error="errors.group"
          :options="groupOptions"
          required
          placeholder="-- Chọn nhóm cấu hình --"
          @update:model-value="clearError('group')"
        />
        
        <!-- Description -->
        <FormField
          v-model="form.description"
          label="Mô tả cấu hình"
          name="description"
          type="textarea"
          :error="errors.description"
          placeholder="Mô tả về cấu hình này..."
          @update:model-value="clearError('description')"
        />
        
        <!-- Default Value -->
        <FormField
          v-model="form.default_value"
          label="Giá trị mặc định"
          name="default_value"
          type="textarea"
          :error="errors.default_value"
          placeholder="Giá trị mặc định khi không có giá trị..."
          @update:model-value="clearError('default_value')"
        />
        
        <!-- Validation Rules -->
        <FormField
          v-model="form.validation_rules"
          label="Rules validation"
          name="validation_rules"
          type="textarea"
          :error="errors.validation_rules"
          placeholder='VD: {"required": true, "min": 1, "max": 100}'
          :rows="3"
          @update:model-value="clearError('validation_rules')"
        />
        
        <!-- Sort Order -->
        <FormField
          v-model.number="form.sort_order"
          label="Thứ tự sắp xếp"
          name="sort_order"
          type="number"
          :error="errors.sort_order"
          :min="0"
          @update:model-value="clearError('sort_order')"
        />
        
        <!-- Status -->
        <FormField
          v-model="form.status"
          label="Trạng thái"
          name="status"
          type="select"
          :error="errors.status"
          :options="statusOptions"
          required
          placeholder="-- Chọn trạng thái --"
          @update:model-value="clearError('status')"
        />
        
        <!-- Is Public -->
        <FormField
          v-model="form.is_public"
          label="Có thể truy cập public"
          name="is_public"
          type="checkbox"
          :error="errors.is_public"
          @update:model-value="clearError('is_public')"
        />
        
        <!-- Is Encrypted -->
        <FormField
          v-model="form.is_encrypted"
          label="Mã hóa giá trị"
          name="is_encrypted"
          type="checkbox"
          :error="errors.is_encrypted"
          @update:model-value="clearError('is_encrypted')"
        />
      </template>
    </FormWrapper>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'

const props = defineProps({
  show: Boolean,
  config: Object,
  typeEnums: {
    type: Array,
    default: () => []
  },
  groupEnums: {
    type: Array,
    default: () => []
  },
  statusEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Form title
const formTitle = computed(() => props.config ? 'Chỉnh sửa cấu hình' : 'Thêm cấu hình mới')

// Modal visibility
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

// Loading state
const loading = ref(false)

// Default values
const defaultValues = computed(() => {
  if (props.config) {
    return {
      key: props.config.key || '',
      value: props.config.value || '',
      type: props.config.type || 'string',
      group: props.config.group || '',
      description: props.config.description || '',
      default_value: props.config.default_value || '',
      validation_rules: props.config.validation_rules ? 
        (typeof props.config.validation_rules === 'string' ? 
          props.config.validation_rules : 
          JSON.stringify(props.config.validation_rules, null, 2)) : '',
      sort_order: props.config.sort_order || 0,
      status: props.config.status || 'active',
      is_public: Boolean(props.config.is_public),
      is_encrypted: Boolean(props.config.is_encrypted)
    }
  }
  
  return {
    key: '',
    value: '',
    type: 'string',
    group: '',
    description: '',
    default_value: '',
    validation_rules: '',
    sort_order: 0,
    status: 'active',
    is_public: false,
    is_encrypted: false
  }
})

// Validation rules
const validationRules = computed(() => ({
  key: [
    { required: 'Key cấu hình là bắt buộc' },
    { minLength: [2, 'Key phải có ít nhất 2 ký tự'] },
    { maxLength: [255, 'Key không được quá 255 ký tự'] }
  ],
  value: [
    { required: 'Giá trị cấu hình là bắt buộc' }
  ],
  type: [
    { required: 'Loại dữ liệu là bắt buộc' }
  ],
  group: [
    { required: 'Nhóm cấu hình là bắt buộc' }
  ],
  status: [
    { required: 'Trạng thái là bắt buộc' }
  ],
  sort_order: [
    { min: [0, 'Thứ tự sắp xếp phải >= 0'] }
  ],
  validation_rules: [
    { 
      custom: (value) => {
        if (!value || !value.trim()) return true
        try {
          JSON.parse(value)
          return true
        } catch {
          return 'Validation rules phải là JSON hợp lệ'
        }
      }
    }
  ]
}))

// Options for selects
const typeOptions = computed(() => 
  props.typeEnums.map(item => ({
    value: item.value,
    label: item.label
  }))
)

const groupOptions = computed(() => 
  props.groupEnums.map(item => ({
    value: item.value,
    label: item.label
  }))
)

const statusOptions = computed(() => 
  props.statusEnums.map(item => ({
    value: item.value,
    label: item.label
  }))
)

// Handle submit
function handleSubmit(formData) {
  loading.value = true
  
  try {
    // Parse validation rules if provided
    let parsedValidationRules = null
    if (formData.validation_rules && formData.validation_rules.trim()) {
      parsedValidationRules = JSON.parse(formData.validation_rules)
    }

    const submitData = {
      key: formData.key,
      value: formData.value,
      type: formData.type,
      group: formData.group,
      description: formData.description || null,
      default_value: formData.default_value || null,
      validation_rules: parsedValidationRules,
      sort_order: formData.sort_order,
      status: formData.status,
      is_public: formData.is_public ? 1 : 0,
      is_encrypted: formData.is_encrypted ? 1 : 0
    }
    
    emit('submit', submitData)
  } finally {
    loading.value = false
  }
}

// Close modal
function onClose() {
  emit('cancel')
}
</script>
