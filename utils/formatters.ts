// ===== TYPES =====

type Currency = 'VND' | 'USD' | 'EUR' | 'GBP'
type Locale = 'vi-VN' | 'en-US' | 'en-GB'

// ===== CURRENCY FORMATTING =====

/**
 * Format currency with proper type safety
 */
export function formatCurrency(
  amount: number | null | undefined, 
  currency: Currency = 'VND', 
  locale: Locale = 'vi-VN'
): string {
  if (amount === null || amount === undefined) return ''
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    // Fallback formatting
    return `${amount.toLocaleString()} ${currency}`
  }
}

/**
 * Format number with comma separators
 */
export function formatNumber(
  number: number | null | undefined, 
  locale: Locale = 'vi-VN'
): string {
  if (number === null || number === undefined) return ''
  
  try {
    return new Intl.NumberFormat(locale).format(number)
  } catch (error) {
    return number.toString()
  }
}

// Default export for backward compatibility
export default formatCurrency

// ===== DATE FORMATTING =====

type DateFormat = 'dd/MM/yyyy' | 'yyyy-MM-dd' | 'MM/dd/yyyy'

/**
 * Format date with type safety
 */
export function formatDate(
  date: string | Date | null | undefined, 
  format: DateFormat = 'dd/MM/yyyy'
): string {
  if (!date) return ''
  
  const d = new Date(date)
  
  if (isNaN(d.getTime())) return ''
  
  switch (format) {
    case 'yyyy-MM-dd':
      return d.toISOString().slice(0, 10)
    case 'MM/dd/yyyy':
      return d.toLocaleDateString('en-US')
    case 'dd/MM/yyyy':
    default:
      return d.toLocaleDateString('vi-VN')
  }
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: string | Date | null | undefined,
  locale: Locale = 'vi-VN'
): string {
  if (!date) return ''
  
  const d = new Date(date)
  
  if (isNaN(d.getTime())) return ''
  
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date | null | undefined,
  locale: Locale = 'vi-VN'
): string {
  if (!date) return ''
  
  const d = new Date(date)
  
  if (isNaN(d.getTime())) return ''
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Vừa xong'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`
  }
  
  return formatDate(d)
}
