import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// Types
interface ValidationRule {
  required?: string
  min?: number
  max?: number
  email?: boolean
  numeric?: boolean
  minValue?: number
  maxValue?: number
  minMessage?: string
  maxMessage?: string
  emailMessage?: string
  numericMessage?: string
  minValueMessage?: string
  maxValueMessage?: string
}

interface ValidationRules {
  [key: string]: ValidationRule[]
}

interface FormData {
  [key: string]: any
}

export function useFormValidation(
  formData: Ref<FormData>, 
  validationRules: Ref<ValidationRules> | { value: ValidationRules }
) {
  const validationErrors = ref<Record<string, string>>({})

  // Clear errors
  function clearErrors() {
    Object.keys(validationErrors.value).forEach(key => delete validationErrors.value[key])
  }

  // Validate form
  function validateForm() {
    clearErrors()
    let valid = true
    const rules = validationRules.value || {}
    
    for (const field in rules) {
      const fieldRules = rules[field]
      if (!fieldRules) continue
      
      for (const rule of fieldRules) {
        const errorMessage = validateRule(field, rule)
        if (errorMessage) {
          validationErrors.value[field] = errorMessage
          valid = false
          break
        }
      }
    }
    
    return valid
  }

  // Helper function to validate email
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Helper function to validate a single rule
  function validateRule(field: string, rule: any): string | null {
    const fieldValue = formData.value[field]
    
    // Support both formats: useFormValidation format and utils/form.ts format
    if (typeof rule === 'string') {
      // utils/form.ts format
      if (rule === 'required' && !fieldValue) {
        return 'Trường này là bắt buộc.'
      }
      if (rule === 'email' && fieldValue && !isValidEmail(fieldValue)) {
        return 'Email không hợp lệ.'
      }
    } else if (typeof rule === 'object') {
      // useFormValidation format
      if (rule.required && !fieldValue) {
        return rule.required
      }
      
      if (rule.min && fieldValue && fieldValue.length < rule.min) {
        return rule.minMessage || `Tối thiểu ${rule.min} ký tự`
      }
      
      if (rule.max && fieldValue && fieldValue.length > rule.max) {
        return rule.maxMessage || `Tối đa ${rule.max} ký tự`
      }
      
      if (rule.email && fieldValue && !isValidEmail(fieldValue)) {
        return rule.emailMessage || 'Email không hợp lệ'
      }
      
      if (rule.numeric && fieldValue && isNaN(fieldValue)) {
        return rule.numericMessage || 'Phải là số'
      }
      
      if (rule.minValue && fieldValue && Number(fieldValue) < rule.minValue) {
        return rule.minValueMessage || `Giá trị tối thiểu là ${rule.minValue}`
      }
      
      if (rule.maxValue && fieldValue && Number(fieldValue) > rule.maxValue) {
        return rule.maxValueMessage || `Giá trị tối đa là ${rule.maxValue}`
      }
    }
    
    return null // No error
  }

  // Validate single field
  function validateField(fieldName: string): boolean {
    const rules = validationRules.value?.[fieldName]
    if (!rules) return true
    
    delete validationErrors.value[fieldName]
    
    for (const rule of rules) {
      const errorMessage = validateRule(fieldName, rule)
      if (errorMessage) {
        validationErrors.value[fieldName] = errorMessage
        return false
      }
    }
    
    return true
  }

  // Check if field has error
  function hasError(fieldName: string): boolean {
    return !!validationErrors.value[fieldName]
  }

  // Get error message for field
  function getError(fieldName: string): string {
    return validationErrors.value[fieldName] || ''
  }

  return {
    validationErrors,
    clearErrors,
    validateForm,
    validateField,
    hasError,
    getError
  }
}
