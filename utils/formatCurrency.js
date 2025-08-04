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

export default formatCurrency; 