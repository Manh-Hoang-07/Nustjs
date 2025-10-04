import { reactive, computed, watch } from 'vue'
import { useFormErrors } from './useFormErrors'
import { useFormValidation } from './useFormValidation'
import { useFormSubmission } from './useFormSubmission'
import type { 
  FormData, 
  FormTouched, 
  FormManagerOptions, 
  FormManagerResult 
} from './form.types'

/**
 * Composable chính để quản lý form - kết hợp các composables chuyên biệt
 */
export function useFormManager(
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
  const touched: FormTouched = reactive({})

  // Sử dụng các composables chuyên biệt
  const { errors, setError, setErrors, clearError, clearAll } = useFormErrors()
  const { isValid, validateField: validateFieldFn, validateForm: validateFormFn } = useFormValidation(formData, validator)
  const { loading, submitted, submit: submitFn, handleSubmit: handleSubmitFn, resetSubmission } = useFormSubmission(onSubmit, onSuccess, onError)

  // Computed
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
  const setField = (field: string, value: any): void => {
    formData[field] = value
    touched[field] = true
    
    if (autoValidate && validator) {
      const fieldErrors = validateFieldFn(field)
      if (fieldErrors[field]) {
        setError(field, fieldErrors[field])
      } else {
        clearError(field)
      }
    }
  }

  const setFields = (fields: Partial<FormData>): void => {
    Object.assign(formData, fields)
    Object.keys(fields).forEach(field => {
      touched[field] = true
      if (autoValidate && validator) {
        const fieldErrors = validateFieldFn(field)
        if (fieldErrors[field]) {
          setError(field, fieldErrors[field])
        } else {
          clearError(field)
        }
      }
    })
  }

  const getField = (field: string): any => {
    return formData[field]
  }

  const validateField = (field: string): boolean => {
    const fieldErrors = validateFieldFn(field)
    if (fieldErrors[field]) {
      setError(field, fieldErrors[field])
      return false
    } else {
      clearError(field)
      return true
    }
  }

  const validateForm = (): boolean => {
    const validation = validateFormFn()
    setErrors(validation)
    return Object.keys(validation).length === 0
  }

  const reset = (): void => {
    Object.assign(formData, originalData)
    clearAll()
    Object.keys(touched).forEach(key => delete touched[key])
    resetSubmission()
  }

  const resetTo = (newData: FormData): void => {
    Object.assign(formData, newData)
    Object.assign(originalData, newData)
    clearAll()
    Object.keys(touched).forEach(key => delete touched[key])
    resetSubmission()
  }

  const submit = async (customData: FormData | null = null): Promise<any> => {
    if (!validateForm()) {
      if (onError) onError(errors)
      return false
    }

    clearAll()
    return submitFn(formData, customData)
  }

  const handleSubmit = (event?: Event): Promise<any> => {
    if (event) event.preventDefault()
    return submit()
  }

  // Watch for form data changes
  if (autoValidate) {
    watch(formData, () => {
      if (submitted.value) validateForm()
    }, { deep: true })
  }

  return {
    formData,
    errors,
    touched,
    loading,
    submitted,
    isValid,
    hasChanges,
    hasErrors,
    isDirty,
    setField,
    setFields,
    getField,
    validateField,
    validateForm,
    setError,
    setErrors,
    clearError,
    clearErrors: clearAll,
    reset,
    resetTo,
    submit,
    handleSubmit
  }
}
