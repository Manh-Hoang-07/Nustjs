import { reactive, computed, type ComputedRef } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

// ===== TYPES =====

interface FormDataOptions {
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  skipEmpty?: boolean
  exclude?: string[]
}

interface ValidationRule {
  required?: string | boolean
  email?: string | boolean
  min?: [number, string] | number
  match?: [string, string] | string
  pattern?: [RegExp, string] | RegExp
}

interface ValidationRules {
  [field: string]: (string | ValidationRule)[]
}

interface FormObject {
  [key: string]: any
}

interface ApiFormSubmitOptions {
  endpoint: string
  emit: (event: string, ...args: any[]) => void
  onClose?: () => void
  eventName?: string
  method?: 'post' | 'put' | 'patch'
}

interface ApiErrors {
  [field: string]: string
}

// ===== FORM TO FORMDATA =====

/**
 * Convert form object to FormData with type safety
 */
export function formToFormData(
  form: FormObject, 
  options: FormDataOptions = {}
): FormData {
  const submitData = new FormData()

  // Nếu là update (PUT/PATCH), thêm _method vào FormData
  if (options.method && (options.method.toLowerCase() === 'put' || options.method.toLowerCase() === 'patch')) {
    submitData.append('_method', options.method.toUpperCase())
  }

  const appendValue = (fd: FormData, key: string, value: any): void => {
    // Nếu là boolean true cho remove_xxx, append 1
    if (typeof key === 'string' && key.startsWith('remove_') && value) {
      fd.append(key, '1')
      return
    }
    
    if (value === null || value === undefined) {
      fd.append(key, '')
      return
    }
    
    if (value === '' && options.skipEmpty) return

    // File/Blob giữ nguyên
    if (typeof File !== 'undefined' && value instanceof File) {
      fd.append(key, value)
      return
    }
    
    if (typeof Blob !== 'undefined' && value instanceof Blob) {
      fd.append(key, value)
      return
    }

    // Array -> key[]
    if (Array.isArray(value)) {
      value.forEach((item) => {
        fd.append(`${key}[]`, item)
      })
      return
    }

    // Object -> key[sub]
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((subKey) => {
        appendValue(fd, `${key}[${subKey}]`, value[subKey])
      })
      return
    }

    // Primitive
    fd.append(key, String(value))
  }

  Object.keys(form).forEach((key) => {
    if (options.exclude && options.exclude.includes(key)) return
    appendValue(submitData, key, form[key])
  })

  return submitData
}

// ===== FORM VALIDATION =====

/**
 * Validate form with comprehensive type safety
 */
export function validateForm(form: FormObject, rules: ValidationRules): Record<string, string> {
  const newErrors: Record<string, string> = {}

  for (const field in rules) {
    // Đảm bảo form[field] không undefined và convert sang string an toàn
    const fieldValue = form && form[field] !== undefined && form[field] !== null ? form[field] : ''
    
    // Xử lý khác nhau cho từng loại field
    let value: string
    if (field === 'password') {
      // Password không nên trim
      value = String(fieldValue)
    } else {
      // Các field khác có thể trim
      value = String(fieldValue).trim()
    }
    
    for (const ruleObj of rules[field]) {
      if (typeof ruleObj === 'string') {
        // Dạng ngắn, không custom message
        if (ruleObj === 'required' && !value) {
          newErrors[field] = 'Trường này là bắt buộc.'
          break
        }
        if (ruleObj === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
          newErrors[field] = 'Email không hợp lệ.'
          break
        }
      } else if (typeof ruleObj === 'object') {
        // Dạng object: { rule: message } hoặc { rule: [param, message] }
        for (const rule in ruleObj) {
          const msg = ruleObj[rule as keyof ValidationRule]
          if (rule === 'required' && !value) {
            newErrors[field] = typeof msg === 'string' ? msg : 'Trường này là bắt buộc.'
            break
          }
          if (rule === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
            newErrors[field] = typeof msg === 'string' ? msg : 'Email không hợp lệ.'
            break
          }
          if (rule === 'min' && value) {
            const [min, minMsg] = Array.isArray(msg) ? msg : [msg, `Tối thiểu ${msg} ký tự.`]
            if (value.length < (min as number)) {
              newErrors[field] = minMsg as string
              break
            }
          }
          if (rule === 'match' && value) {
            const [otherField, matchMsg] = Array.isArray(msg) ? msg : [msg, 'Giá trị xác nhận không khớp.']
            const otherValue = form && form[otherField as string] !== undefined && form[otherField as string] !== null ? form[otherField as string] : ''
            const otherValueStr = otherField === 'password' ? String(otherValue) : String(otherValue).trim()
            if (value !== otherValueStr) {
              newErrors[field] = matchMsg as string
              break
            }
          }
          // Bổ sung xử lý pattern
          if (rule === 'pattern' && value) {
            const [regex, patternMsg] = Array.isArray(msg) ? msg : [msg, 'Định dạng không hợp lệ.']
            if (!(regex as RegExp).test(value)) {
              newErrors[field] = patternMsg as string
              break
            }
          }
        }
      }
    }
  }

  return newErrors
}

// ===== FORM DEFAULTS =====

/**
 * Create computed form defaults with type safety
 */
export function useFormDefaults<T extends FormObject>(
  props: { [key: string]: any },
  objectName: string,
  fallback: T = {} as T
): ComputedRef<T> {
  return computed(() => {
    const obj = props[objectName] || {}
    return { ...fallback, ...obj } as T
  })
}

// ===== API FORM SUBMIT =====

/**
 * API form submit with error handling and type safety
 */
export function useApiFormSubmit({ 
  endpoint, 
  emit, 
  onClose, 
  eventName = 'created', 
  method = 'post' 
}: ApiFormSubmitOptions) {
  const apiErrors = reactive<ApiErrors>({})

  async function submit(form: FormObject) {
    try {
      // Xóa lỗi cũ
      Object.keys(apiErrors).forEach(key => delete apiErrors[key])

      // Luôn tạo mới FormData và append _method nếu là update
      const dataToSend = (method === 'put' || method === 'patch')
        ? formToFormData(form, { method: method.toUpperCase() as 'PUT' | 'PATCH' })
        : formToFormData(form)

      const { apiClient } = useApiClient()
      const response = await apiClient.post(endpoint, dataToSend)
      emit(eventName)
      if (onClose) onClose()
      return response
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors
        for (const field in errors) {
          apiErrors[field] = Array.isArray(errors[field]) ? errors[field][0] : errors[field]
        }
      }
      throw error
    }
  }

  return { apiErrors, submit }
}

// Default export for backward compatibility
export default formToFormData
