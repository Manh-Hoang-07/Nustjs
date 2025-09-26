import { reactive, computed } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient.js'

// ===== FORM TO FORMDATA =====
export function formToFormData(form, options = {}) {
  const submitData = new FormData()

  // Nếu là update (PUT/PATCH), thêm _method vào FormData
  if (options.method && (options.method.toLowerCase() === 'put' || options.method.toLowerCase() === 'patch')) {
    submitData.append('_method', options.method.toUpperCase())
  }

  const appendValue = (fd, key, value) => {
    // Nếu là boolean true cho remove_xxx, append 1
    if (typeof key === 'string' && key.startsWith('remove_') && value) {
      fd.append(key, 1)
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
    if (typeof value === 'object') {
      Object.keys(value).forEach((subKey) => {
        appendValue(fd, `${key}[${subKey}]`, value[subKey])
      })
      return
    }

    // Primitive
    fd.append(key, value)
  }

  Object.keys(form).forEach((key) => {
    if (options.exclude && options.exclude.includes(key)) return
    appendValue(submitData, key, form[key])
  })

  return submitData
}

// ===== FORM VALIDATION =====
export function validateForm(form, rules) {
  const newErrors = {}

  for (const field in rules) {
    // Đảm bảo form[field] không undefined và convert sang string an toàn
    const fieldValue = form && form[field] !== undefined && form[field] !== null ? form[field] : ''
    
    // Xử lý khác nhau cho từng loại field
    let value
    if (field === 'password') {
      // Password không nên trim
      value = fieldValue.toString()
    } else {
      // Các field khác có thể trim
      value = fieldValue.toString().trim()
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
          const msg = ruleObj[rule]
          if (rule === 'required' && !value) {
            newErrors[field] = msg
            break
          }
          if (rule === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
            newErrors[field] = msg
            break
          }
          if (rule === 'min' && value) {
            const [min, minMsg] = Array.isArray(msg) ? msg : [msg, `Tối thiểu ${msg} ký tự.`]
            if (value.length < min) {
              newErrors[field] = minMsg
              break
            }
          }
          if (rule === 'match' && value) {
            const [otherField, matchMsg] = Array.isArray(msg) ? msg : [msg, 'Giá trị xác nhận không khớp.']
            const otherValue = form && form[otherField] !== undefined && form[otherField] !== null ? form[otherField] : ''
            const otherValueStr = otherField === 'password' ? otherValue.toString() : otherValue.toString().trim()
            if (value !== otherValueStr) {
              newErrors[field] = matchMsg
              break
            }
          }
          // Bổ sung xử lý pattern
          if (rule === 'pattern' && value) {
            const [regex, patternMsg] = Array.isArray(msg) ? msg : [msg, 'Định dạng không hợp lệ.']
            if (!regex.test(value)) {
              newErrors[field] = patternMsg
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
export function useFormDefaults(props, objectName, fallback = {}) {
  return computed(() => {
    const obj = props[objectName] || {}
    return { ...fallback, ...obj }
  })
}

// ===== API FORM SUBMIT =====
export function useApiFormSubmit({ endpoint, emit, onClose, eventName = 'created', method = 'post' }) {
  const apiErrors = reactive({})

  async function submit(form) {
    try {
      // Xóa lỗi cũ
      Object.keys(apiErrors).forEach(key => delete apiErrors[key])

      // Luôn tạo mới FormData và append _method nếu là update
      const dataToSend = (method === 'put' || method === 'patch')
        ? formToFormData(form, { method })
        : formToFormData(form)

      const { apiClient } = useApiClient()
      const response = await apiClient.post(endpoint, dataToSend)
      emit(eventName)
      if (onClose) onClose()
      return response
    } catch (error) {
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
