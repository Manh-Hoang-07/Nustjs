import { reactive, type Ref } from 'vue'

// ===== TYPES =====

interface FormErrors {
  [key: string]: string
}

interface FormErrorsResult {
  errors: FormErrors
  setErrors: (newErrors: Record<string, string | string[]>, append?: boolean) => void
  setServerErrors: (apiErrors: Record<string, string | string[]>) => void
  clearError: (field: string) => void
  clearAll: () => void
  hasErrors: () => boolean
  setError: (field: string, message: string) => void
}

// ===== COMPOSABLE =====

/**
 * Composable để quản lý lỗi form
 * Cung cấp các phương thức để thiết lập, xóa và quản lý lỗi
 * Hỗ trợ cả lỗi từ validation phía client và API
 */
export default function useFormErrors(): FormErrorsResult {
  // Sử dụng reactive để lưu trữ lỗi
  const errors: FormErrors = reactive({})

  /**
   * Thiết lập lỗi mới
   */
  function setErrors(newErrors: Record<string, string | string[]>, append: boolean = false): void {
    // Nếu không phải append, xóa lỗi cũ
    if (!append) {
      clearAll()
    }
    
    if (newErrors && typeof newErrors === 'object') {
      // Hỗ trợ cả format API trả về dạng mảng và dạng chuỗi
      for (const key in newErrors) {
        const error = newErrors[key]
        if (Array.isArray(error)) {
          errors[key] = error[0]  // Lấy lỗi đầu tiên nếu là mảng
        } else {
          errors[key] = error  // Sử dụng nguyên nếu là chuỗi
        }
      }
    }
  }

  /**
   * Thiết lập lỗi từ API
   */
  function setServerErrors(apiErrors: Record<string, string | string[]>): void {
    setErrors(apiErrors)
  }

  /**
   * Xóa lỗi của một trường cụ thể
   */
  function clearError(field: string): void {
    if (field in errors) {
      delete errors[field]
    }
  }

  /**
   * Xóa tất cả lỗi
   */
  function clearAll(): void {
    Object.keys(errors).forEach(key => delete errors[key])
  }
  
  /**
   * Kiểm tra xem có lỗi nào không
   */
  function hasErrors(): boolean {
    return Object.keys(errors).length > 0
  }
  
  /**
   * Thiết lập lỗi cho một trường cụ thể
   */
  function setError(field: string, message: string): void {
    errors[field] = message
  }

  return {
    errors,
    setErrors,
    setServerErrors,
    clearError,
    clearAll,
    hasErrors,
    setError
  }
}
