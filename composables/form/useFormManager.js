import { ref, reactive, computed, watch } from 'vue'

/**
 * Composable để quản lý form với validation, submission và state management
 * @param {Object} initialData - Dữ liệu ban đầu của form
 * @param {Object} options - Các tùy chọn
 * @param {Function} options.validator - Hàm validation
 * @param {Function} options.onSubmit - Hàm xử lý submit
 * @param {Function} options.onSuccess - Callback khi submit thành công
 * @param {Function} options.onError - Callback khi submit thất bại
 * @param {boolean} options.autoValidate - Tự động validate khi field thay đổi
 * @returns {Object} - Các state và methods cho form management
 */
export default function useFormManager(initialData = {}, options = {}) {
  const {
    validator = null,
    onSubmit = null,
    onSuccess = null,
    onError = null,
    autoValidate = true
  } = options

  // State
  const formData = reactive({ ...initialData })
  const originalData = { ...initialData }
  const errors = reactive({})
  const touched = reactive({})
  const loading = ref(false)
  const submitted = ref(false)

  // Computed
  const isValid = computed(() => {
    if (!validator) return true
    const validation = validator(formData)
    return Object.keys(validation).length === 0
  })

  const hasChanges = computed(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  })

  const hasErrors = computed(() => {
    return Object.keys(errors).length > 0
  })

  const isDirty = computed(() => {
    return Object.keys(touched).length > 0
  })

  // Methods
  const setField = (field, value) => {
    formData[field] = value
    touched[field] = true
    
    if (autoValidate && validator) {
      validateField(field)
    }
  }

  const setFields = (fields) => {
    Object.assign(formData, fields)
    Object.keys(fields).forEach(field => {
      touched[field] = true
      if (autoValidate && validator) {
        validateField(field)
      }
    })
  }

  const getField = (field) => {
    return formData[field]
  }

  const validateField = (field) => {
    if (!validator) return true
    
    const validation = validator(formData)
    if (validation[field]) {
      errors[field] = validation[field]
      return false
    } else {
      delete errors[field]
      return true
    }
  }

  const validateForm = () => {
    if (!validator) return true
    
    const validation = validator(formData)
    Object.assign(errors, validation)
    
    return Object.keys(validation).length === 0
  }

  const setError = (field, message) => {
    errors[field] = message
  }

  const setErrors = (newErrors) => {
    Object.assign(errors, newErrors)
  }

  const clearError = (field) => {
    delete errors[field]
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const reset = () => {
    Object.assign(formData, originalData)
    clearErrors()
    Object.keys(touched).forEach(key => delete touched[key])
    submitted.value = false
    loading.value = false
  }

  const resetTo = (newData) => {
    Object.assign(formData, newData)
    Object.assign(originalData, newData)
    clearErrors()
    Object.keys(touched).forEach(key => delete touched[key])
    submitted.value = false
    loading.value = false
  }

  const submit = async (customData = null) => {
    if (!onSubmit) {
      return
    }

    submitted.value = true
    
    // Validate form
    if (!validateForm()) {
      if (onError) {
        onError(errors)
      }
      return false
    }

    loading.value = true
    clearErrors()

    try {
      const dataToSubmit = customData || formData
      const result = await onSubmit(dataToSubmit)
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (error) {
      // Handle API errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setError('_general', error.message || 'Có lỗi xảy ra')
      }
      
      if (onError) {
        onError(error)
      }
      
      throw error
    } finally {
      loading.value = false
    }
  }

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    return submit()
  }

  // Watch for form data changes
  if (autoValidate) {
    watch(formData, () => {
      if (submitted.value) {
        validateForm()
      }
    }, { deep: true })
  }

  return {
    // State
    formData,
    errors,
    touched,
    loading,
    submitted,
    
    // Computed
    isValid,
    hasChanges,
    hasErrors,
    isDirty,
    
    // Methods
    setField,
    setFields,
    getField,
    validateField,
    validateForm,
    setError,
    setErrors,
    clearError,
    clearErrors,
    reset,
    resetTo,
    submit,
    handleSubmit
  }
} 