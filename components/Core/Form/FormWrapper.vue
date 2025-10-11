<template>
  <div class="form-wrapper">

    
    <slot 
      :form="form" 
      :errors="displayErrors" 
      :isSubmitting="isSubmitting" 
      :clearError="clearError"
      :validate="validate"
    ></slot>
    
    <div class="mt-4 flex justify-end space-x-2">
      <slot name="actions" :submit="handleSubmit" :cancel="handleCancel">
        <button 
          v-if="showCancelButton" 
          type="button" 
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          :disabled="isSubmitting || disableSubmit"
          @click.prevent="handleSubmit"
        >
          <span v-if="isSubmitting">
            <span class="inline-block animate-spin mr-2">&#8635;</span>
            {{ submittingText }}
          </span>
          <span v-else>{{ submitText }}</span>
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { useFormValidation } from '@/composables/utils/useFormValidation'

const props = defineProps({
  // Form data
  initialData: {
    type: Object,
    default: () => ({})
  },
  defaultValues: {
    type: Object,
    default: () => ({})
  },
  // Validation
  rules: {
    type: Object,
    default: () => ({})
  },
  // API errors from parent
  apiErrors: {
    type: Object,
    default: () => ({})
  },

  showCancelButton: {
    type: Boolean,
    default: true
  },
  submitText: {
    type: String,
    default: 'Lưu'
  },
  submittingText: {
    type: String,
    default: 'Đang lưu...'
  },
  cancelText: {
    type: String,
    default: 'Hủy'
  },
  disableSubmit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel', 'error'])

// Form state
const form = reactive({ ...props.defaultValues })
const isSubmitting = ref(false)

// Use form validation composable
const { validationErrors, clearErrors, validateForm } = useFormValidation(ref(form), computed(() => props.rules))

// Method để update form
const updateForm = (newData) => {
  Object.keys(newData).forEach(key => {
    if (key in form) {
      form[key] = newData[key]
    }
  })
}

// Kết hợp lỗi từ API và lỗi local
const displayErrors = computed(() => {
  return { ...validationErrors.value, ...props.apiErrors }
})

// Watch defaultValues để update form
watch(() => props.defaultValues, (newValues) => {
  Object.keys(newValues).forEach(key => {
    if (key in form) {
      form[key] = newValues[key]
    }
  })
}, { deep: true })

// Theo dõi initialData để cập nhật form
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    Object.keys(form).forEach(key => {
      if (key in newData) {
        form[key] = newData[key]
      }
    })
  }
}, { deep: true })

// Phương thức tiện ích để xóa lỗi
function clearError(field) {
  clearErrors()
}

// Phương thức xóa tất cả lỗi
function clearAllErrors() {
  clearErrors()
}

// Phương thức validate form
function validate() {
  clearAllErrors()
  
  if (!props.rules || Object.keys(props.rules).length === 0) {
    return true
  }
  
  const isValid = validateForm()
  if (!isValid) {
    emit('error', validationErrors.value)
    return false
  }
  
  return true
}

// Phương thức xử lý submit
async function handleSubmit() {
  if (isSubmitting.value) return
  
  if (!validate()) return
  
  isSubmitting.value = true
  try {
    emit('submit', { ...form })
  } finally {
    isSubmitting.value = false
  }
}

// Phương thức xử lý cancel
function handleCancel() {
  emit('cancel')
}

// Expose methods
defineExpose({
  updateForm,
  form,
  validate: () => validateForm()
})
</script> 
