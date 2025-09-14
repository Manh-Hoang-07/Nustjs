<template>
  <Modal :show="show" :on-close="onClose" size="md">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Ghi chú admin</h2>
        <span class="text-sm text-gray-500">ID: #{{ contact?.id }}</span>
      </div>

      <!-- Contact Info -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ contact?.name || 'N/A' }}</h3>
            <p class="text-sm text-gray-600">{{ contact?.email }}</p>
          </div>
          <span 
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(contact?.status)"
          >
            {{ getStatusLabel(contact?.status) }}
          </span>
        </div>
      </div>

      <!-- Current Notes -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Ghi chú hiện tại
        </label>
        <div class="bg-gray-50 rounded-lg p-4 min-h-[100px]">
          <p v-if="contact?.admin_notes" class="text-gray-900 whitespace-pre-wrap">
            {{ contact?.admin_notes }}
          </p>
          <p v-else class="text-gray-400 italic">Chưa có ghi chú</p>
        </div>
      </div>

      <!-- Update Notes Form -->
      <FormWrapper
        :default-values="defaultValues"
        :rules="validationRules"
        :api-errors="apiErrors"
        submit-text="Cập nhật ghi chú"
        submitting-text="Đang cập nhật..."
        @submit="handleSubmit"
        @cancel="onClose"
      >
        <template #default="{ form, errors, clearError, isSubmitting }">
          <FormField
            v-model="form.admin_notes"
            label="Cập nhật ghi chú"
            name="admin_notes"
            type="textarea"
            :error="errors.admin_notes"
            :rows="6"
            placeholder="Nhập ghi chú admin..."
            @update:model-value="clearError('admin_notes')"
          />

          <!-- Quick Actions -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-blue-900 mb-2">Thao tác nhanh:</h4>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                @click="addQuickNote('Đã gọi điện thoại cho khách hàng')"
                class="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                📞 Đã gọi điện
              </button>
              <button
                type="button"
                @click="addQuickNote('Đã gửi email phản hồi')"
                class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
              >
                📧 Đã gửi email
              </button>
              <button
                type="button"
                @click="addQuickNote('Đã xử lý xong yêu cầu')"
                class="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
              >
                ✅ Đã xử lý xong
              </button>
              <button
                type="button"
                @click="addQuickNote('Cần liên hệ lại sau')"
                class="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
              >
                ⏰ Liên hệ lại sau
              </button>
              <button
                type="button"
                @click="addQuickNote('Khách hàng không phản hồi')"
                class="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
              >
                ❌ Không phản hồi
              </button>
            </div>
          </div>
        </template>
      </FormWrapper>
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { getEnumLabel } from '@/constants/enums'
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
  onClose: {
    type: Function,
    required: true
  }
})

// Emits
const emit = defineEmits(['notes-updated'])

// State
const apiErrors = reactive({})
const { showSuccess, showError } = useToast()

// Default values
const defaultValues = computed(() => ({
  admin_notes: props.contact?.admin_notes || ''
}))

// Validation rules
const validationRules = computed(() => ({
  admin_notes: [
    { max: [1000, 'Ghi chú admin không được vượt quá 1000 ký tự.'] }
  ]
}))

// Methods
function getStatusLabel(status) {
  return getEnumLabel('contact_status', status) || status || 'Không xác định'
}

function getStatusClass(status) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// We need to access the form data from FormWrapper
// This is a workaround to add quick notes
let currentFormData = ref({ admin_notes: '' })

function addQuickNote(note) {
  const currentNotes = currentFormData.value.admin_notes?.trim() || ''
  const timestamp = new Date().toLocaleString('vi-VN')
  const newNote = `[${timestamp}] ${note}`
  
  if (currentNotes) {
    currentFormData.value.admin_notes = currentNotes + '\n\n' + newNote
  } else {
    currentFormData.value.admin_notes = newNote
  }
}

// Submit handler
const handleSubmit = async (formData) => {
  try {
    await api.put(endpoints.contacts.update(props.contact.id), {
      admin_notes: formData.admin_notes?.trim() || null
    })
    
    // Update local contact
    props.contact.admin_notes = formData.admin_notes?.trim() || null
    
    showSuccess('Ghi chú đã được cập nhật thành công')
    emit('notes-updated')
  } catch (error) {
    console.error('Notes update error:', error)
    
    if (error.response?.data?.errors) {
      Object.assign(apiErrors, error.response.data.errors)
    } else {
      showError('Không thể cập nhật ghi chú')
    }
  }
}

// Watch for contact changes to clear errors
watch(() => props.contact, () => {
  Object.keys(apiErrors).forEach(key => delete apiErrors[key])
  currentFormData.value.admin_notes = props.contact?.admin_notes || ''
}, { immediate: true })
</script>
