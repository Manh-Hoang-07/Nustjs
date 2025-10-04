import type { FormData, FormErrors } from './types'

/**
 * Utility functions cho form validation và data processing
 */

/**
 * Kiểm tra xem một giá trị có rỗng không
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Vietnamese format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Validate required fields
 */
export function validateRequired(data: FormData, requiredFields: string[]): FormErrors {
  const errors: FormErrors = {}
  
  requiredFields.forEach(field => {
    if (isEmpty(data[field])) {
      errors[field] = 'Trường này là bắt buộc'
    }
  })
  
  return errors
}

/**
 * Validate email fields
 */
export function validateEmails(data: FormData, emailFields: string[]): FormErrors {
  const errors: FormErrors = {}
  
  emailFields.forEach(field => {
    if (data[field] && !isEmpty(data[field]) && !isValidEmail(data[field])) {
      errors[field] = 'Email không hợp lệ'
    }
  })
  
  return errors
}

/**
 * Validate phone fields
 */
export function validatePhones(data: FormData, phoneFields: string[]): FormErrors {
  const errors: FormErrors = {}
  
  phoneFields.forEach(field => {
    if (data[field] && !isEmpty(data[field]) && !isValidPhone(data[field])) {
      errors[field] = 'Số điện thoại không hợp lệ'
    }
  })
  
  return errors
}

/**
 * Sanitize form data - loại bỏ các ký tự không mong muốn
 */
export function sanitizeFormData(data: FormData): FormData {
  const sanitized: FormData = {}
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = value.trim()
    } else {
      sanitized[key] = value
    }
  })
  
  return sanitized
}

/**
 * Deep clone form data
 */
export function cloneFormData(data: FormData): FormData {
  return JSON.parse(JSON.stringify(data))
}

/**
 * Merge form data với data mới
 */
export function mergeFormData(original: FormData, newData: Partial<FormData>): FormData {
  return { ...original, ...newData }
}
