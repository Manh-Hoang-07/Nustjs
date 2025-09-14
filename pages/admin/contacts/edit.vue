<template>
  <Modal :show="show" :on-close="onClose" size="lg">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Chỉnh sửa liên hệ</h2>
        <span class="text-sm text-gray-500">ID: #{{ contact?.id }}</span>
      </div>

      <FormWrapper
        :default-values="defaultValues"
        :rules="validationRules"
        :api-errors="apiErrors"
        submit-text="Cập nhật"
        submitting-text="Đang cập nhật..."
        @submit="handleSubmit"
        @cancel="onClose"
      >
        <template #default="{ form, errors, clearError, isSubmitting }">
          <!-- Thông tin cơ bản -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              v-model="form.name"
              label="Họ và tên"
              name="name"
              type="text"
              :error="errors.name"
              placeholder="Nhập họ và tên"
              @update:model-value="clearError('name')"
            />

            <FormField
              v-model="form.email"
              label="Email"
              name="email"
              type="email"
              :error="errors.email"
              required
              placeholder="Nhập email"
              @update:model-value="clearError('email')"
            />

            <FormField
              v-model="form.phone"
              label="Số điện thoại"
              name="phone"
              type="tel"
              :error="errors.phone"
              placeholder="Nhập số điện thoại"
              @update:model-value="clearError('phone')"
            />

            <FormField
              v-model="form.subject"
              label="Chủ đề"
              name="subject"
              type="text"
              :error="errors.subject"
              placeholder="Nhập chủ đề"
              @update:model-value="clearError('subject')"
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
            required
            @update:model-value="clearError('status')"
          />

          <!-- Nội dung tin nhắn -->
          <FormField
            v-model="form.content"
            label="Nội dung tin nhắn"
            name="content"
            type="textarea"
            :error="errors.content"
            :rows="6"
            required
            placeholder="Nhập nội dung tin nhắn"
            @update:model-value="clearError('content')"
          />

          <!-- Ghi chú admin -->
          <FormField
            v-model="form.admin_notes"
            label="Ghi chú admin"
            name="admin_notes"
            type="textarea"
            :error="errors.admin_notes"
            :rows="4"
            placeholder="Nhập ghi chú admin (nếu có)"
            @update:model-value="clearError('admin_notes')"
          />
        </template>
      </FormWrapper>
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { getEnumSync } from '@/constants/enums'
import Modal from '@/components/Core/Modal/Modal.vue'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'
import api from '@/api/apiClient'
import endpoints from '@/api/endpoints'
import { useToast } from '@/composables/ui/useToast'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  contact: {
    type: Object,
    default: null
  },
  statusEnums: {
    type: Array,
    default: () => []
  },
  onClose: {
    type: Function,
    required: true
  }
})

// Emits
const emit = defineEmits(['updated'])

// State
const apiErrors = reactive({})
const { showSuccess, showError } = useToast()

// Default values
const defaultValues = computed(() => {
  if (!props.contact) {
    return {
      name: '',
      email: '',
      phone: '',
      subject: '',
      content: '',
      status: 'pending',
      admin_notes: ''
    }
  }
  
  return {
    name: props.contact.name || '',
    email: props.contact.email || '',
    phone: props.contact.phone || '',
    subject: props.contact.subject || '',
    content: props.contact.content || '',
    status: props.contact.status || 'pending',
    admin_notes: props.contact.admin_notes || ''
  }
})

// Validation rules
const validationRules = computed(() => ({
  name: [
    { max: [255, 'Họ và tên không được vượt quá 255 ký tự.'] }
  ],
  email: [
    { required: 'Email là bắt buộc.' },
    { email: 'Email không hợp lệ.' }
  ],
  phone: [
    { max: [20, 'Số điện thoại không được vượt quá 20 ký tự.'] },
    { pattern: [/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ.'] }
  ],
  subject: [
    { max: [255, 'Chủ đề không được vượt quá 255 ký tự.'] }
  ],
  content: [
    { required: 'Nội dung tin nhắn là bắt buộc.' },
    { min: [10, 'Nội dung phải có ít nhất 10 ký tự.'] },
    { max: [2000, 'Nội dung không được vượt quá 2000 ký tự.'] }
  ],
  status: [
    { required: 'Vui lòng chọn trạng thái.' }
  ],
  admin_notes: [
    { max: [1000, 'Ghi chú admin không được vượt quá 1000 ký tự.'] }
  ]
}))

// Status options
const statusOptions = computed(() =>
  (props.statusEnums || []).map(opt => ({
    value: opt.value,
    label: opt.label
  }))
)

// Submit handler
const handleSubmit = async (formData) => {
  try {
    await api.put(endpoints.contacts.update(props.contact.id), {
      name: formData.name?.trim() || null,
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      subject: formData.subject?.trim() || null,
      content: formData.content.trim(),
      status: formData.status,
      admin_notes: formData.admin_notes?.trim() || null
    })
    
    showSuccess('Liên hệ đã được cập nhật thành công')
    emit('updated')
  } catch (error) {
    console.error('Contact update error:', error)
    
    if (error.response?.data?.errors) {
      Object.assign(apiErrors, error.response.data.errors)
    } else {
      showError('Không thể cập nhật liên hệ')
    }
  }
}

// Watch for contact changes to clear errors
watch(() => props.contact, () => {
  Object.keys(apiErrors).forEach(key => delete apiErrors[key])
}, { immediate: true })
</script>
