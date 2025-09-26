import { ref, type Ref } from 'vue'

// ===== TYPES =====

interface FormData {
  [key: string]: any
}

interface FormDataResult {
  form: Ref<FormData>
  prepareData: (formData: FormData, useFormData?: boolean) => FormData | globalThis.FormData
  resetForm: (defaultValues?: FormData) => void
  setFormData: (data: FormData) => void
}

// ===== COMPOSABLE =====

/**
 * Composable để xử lý form data một cách nhất quán
 * Hỗ trợ cả FormData và JSON
 */
export default function useFormData(): FormDataResult {
  const form: Ref<FormData> = ref({})
  
  /**
   * Tạo data để gửi API
   */
  const prepareData = (formData: FormData, useFormData: boolean = false): FormData | globalThis.FormData => {
    if (useFormData) {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          data.append(key, value)
        }
      })
      return data
    } else {
      // Tạo JSON object
      const data: FormData = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          data[key] = value
        }
      })
      return data
    }
  }
  
  /**
   * Reset form về giá trị mặc định
   */
  const resetForm = (defaultValues: FormData = {}): void => {
    form.value = { ...defaultValues }
  }
  
  /**
   * Cập nhật form với dữ liệu từ API
   */
  const setFormData = (data: FormData): void => {
    if (data) {
      form.value = { ...data }
    }
  }
  
  return {
    form,
    prepareData,
    resetForm,
    setFormData
  }
}
