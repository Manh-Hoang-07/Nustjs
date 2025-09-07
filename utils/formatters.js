// ===== CURRENCY FORMATTING =====

// Format currency function
export function formatCurrency(amount, currency = 'VND', locale = 'vi-VN') {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${amount.toLocaleString()} ${currency}`;
  }
}

// Format number with comma separators
export function formatNumber(number, locale = 'vi-VN') {
  if (number === null || number === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    return number.toString();
  }
}

// Default export for backward compatibility
export default formatCurrency;

// ===== DATE FORMATTING =====

export function formatDate(date, format = 'dd/MM/yyyy') {
  if (!date) return ''
  const d = new Date(date)
  if (format === 'yyyy-MM-dd') {
    return d.toISOString().slice(0, 10)
  }
  // dd/MM/yyyy
  return d.toLocaleDateString('vi-VN')
}
