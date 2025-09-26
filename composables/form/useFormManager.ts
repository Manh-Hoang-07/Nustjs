import { ref, reactive, computed, watch, type Ref, type ComputedRef } from 'vue'

// ===== TYPES =====

interface FormData {
  [key: string]: any
}

interface FormErrors {
  [key: string]: string
}

interface FormTouched {
  [key: string]: boolean
}

interface FormValidator {
  (data: FormData): FormErrors
}

interface FormSubmitHandler {
  (data: FormData): Promise<any>
}

interface FormSuccessHandler {
  (result: any): void
}

interface FormErrorHandler {
  (error: any): void
}

interface FormManagerOptions {
  validator?: FormValidator | null
  onSubmit?: FormSubmitHandler | null
  onSuccess?: FormSuccessHandler | null
  onError?: FormErrorHandler | null
  autoValidate?: boolean
}

interface FormManagerResult {
  // State
  formData: FormData
  errors: FormErrors
  touched: FormTouched
  loading: Ref<boolean>
  submitted: Ref<boolean>
  
  // Computed
  isValid: ComputedRef<boolean>
  hasChanges: ComputedRef<boolean>
  hasErrors: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  
  // Methods
  setField: (field: string, value: any) => void
  setFields: (fields: Partial<FormData>) => void
  getField: (field: string) => any
  validateField: (field: string) => boolean
  validateForm: () => boolean
  setError: (field: string, message: string) => void
  setErrors: (newErrors: FormErrors) => void
  clearError: (field: string) => void
  clearErrors: () => void
  reset: () => void
  resetTo: (newData: FormData) => void
  submit: (customData?: FormData | null) => Promise<any>
  handleSubmit: (event?: Event) => Promise<any>
}

// ===== COMPOSABLE =====

/**
 * Composable để quản lý form với validation, submission và state management
 */
export default function useFormManager(
  initialData: FormData = {}, 
  options: FormManagerOptions = {}
): FormManagerResult {
  const {
    validator = null,
    onSubmit = null,
    onSuccess = null,
    onError = null,
    autoValidate = true
  } = options

  // State
  const formData: FormData = reactive({ ...initialData })
  const originalData: FormData = { ...initialData }
  const errors: FormErrors = reactive({})
  const touched: FormTouched = reactive({})
  const loading: Ref<boolean> = ref(false)
  const submitted: Ref<boolean> = ref(false)

  // Computed
  const isValid: ComputedRef<boolean> = computed(() => {
    if (!validator) return true
    const validation = validator(formData)
    return Object.keys(validation).length === 0
  })

  const hasChanges: ComputedRef<boolean> = computed(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  })

  const hasErrors: ComputedRef<boolean> = computed(() => {
    return Object.keys(errors).length > 0
  })

  const isDirty: ComputedRef<boolean> = computed(() => {
    return Object.keys(touched).length > 0
  })

  // Methods
  const setField = (field: string, value: any): void => {
    formData[field] = value
    touched[field] = true
    
    if (autoValidate && validator) {
      validateField(field)
    }
  }

  const setFields = (fields: Partial<FormData>): void => {
    Object.assign(formData, fields)
    Object.keys(fields).forEach(field => {
      touched[field] = true
      if (autoValidate && validator) {
        validateField(field)
      }
    })
  }

  const getField = (field: string): any => {
    return formData[field]
  }

  const validateField = (field: string): boolean => {
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

  const validateForm = (): boolean => {
    if (!validator) return true
    
    const validation = validator(formData)
    Object.assign(errors, validation)
    
    return Object.keys(validation).length === 0
  }

  const setError = (field: string, message: string): void => {
    errors[field] = message
  }

  const setErrors = (newErrors: FormErrors): void => {
    Object.assign(errors, newErrors)
  }

  const clearError = (field: string): void => {
    delete errors[field]
  }

  const clearErrors = (): void => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const reset = (): void => {
    Object.assign(formData, originalData)
    clearErrors()
    Object.keys(touched).forEach(key => delete touched[key])
    submitted.value = false
    loading.value = false
  }

  const resetTo = (newData: FormData): void => {
    Object.assign(formData, newData)
    Object.assign(originalData, newData)
    clearErrors()
    Object.keys(touched).forEach(key => delete touched[key])
    submitted.value = false
    loading.value = false
  }

  const submit = async (customData: FormData | null = null): Promise<any> => {
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
    } catch (error: any) {
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

  const handleSubmit = (event?: Event): Promise<any> => {
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
