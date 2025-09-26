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
            :class="(
              statusEnums.find(s => s.value === contact?.status)?.class ||
              statusEnums.find(s => s.value === contact?.status)?.badge_class ||
              statusEnums.find(s => s.value === contact?.status)?.color_class ||
              'bg-gray-100 text-gray-800'
            )"
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

          
        </template>
      </FormWrapper>
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
// Removed static enum helpers; enums are loaded via API
import { adminEndpoints } from '@/api/endpoints'
import Modal from '@/components/Core/Modal/Modal.vue'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'
import { useApiClient } from '@/composables/api/useApiClient'
import { useToast } from '@/composables/ui/useToast'

const { apiClient } = useApiClient()
const statusEnums = ref([])

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
  const found = (statusEnums.value || []).find(s => s.value === status)
  return found?.label || status || 'Không xác định'
}

// Removed getStatusClass; class is derived from API enums directly in template

// Removed quick action helpers; keep minimal state only
let currentFormData = ref({ admin_notes: '' })

// Submit handler
const handleSubmit = async (formData) => {
  try {
    // Send email along with admin_notes to satisfy backend validation
    await apiClient.patch(adminEndpoints.contacts.update(props.contact.id), {
      admin_notes: formData.admin_notes?.trim() || null,
      email: props.contact?.email || undefined
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

// Load enums
onMounted(async () => {
  try {
    const response = await apiClient.get(adminEndpoints.enums('contact_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    } else {
      statusEnums.value = []
    }
  } catch (e) {
    statusEnums.value = []
  }
})
</script>
