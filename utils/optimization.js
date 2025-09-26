/**
 * Optimization Utilities - Performance, Image, and Debounce
 */

// ===== DEBOUNCE & THROTTLE =====

/**
 * Enhanced debounce function with better performance and options
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} options - Additional options
 * @param {boolean} options.immediate - If true, trigger the function on the leading edge
 * @param {boolean} options.trailing - If true, trigger the function on the trailing edge
 * @param {number} options.maxWait - Maximum time to wait before forcing execution
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait, options = {}) {
  const { immediate = false, trailing = true, maxWait } = options
  let timeout
  let lastCallTime
  let lastInvokeTime = 0
  let result

  function invokeFunc(time) {
    const args = arguments
    const thisArg = this

    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, wait) {
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    clearTimeout(id)
  }

  function leadingEdge(time) {
    lastInvokeTime = time
    timeout = startTimer(timerExpired, wait)
    return immediate ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
            (timeSinceLastCall < 0) || (maxWait !== undefined && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timeout = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timeout = undefined

    if (trailing && lastCallTime !== undefined) {
      return invokeFunc(time)
    }
    return result
  }

  function cancel() {
    if (timeout !== undefined) {
      cancelTimer(timeout)
    }
    lastInvokeTime = 0
    lastCallTime = undefined
    timeout = undefined
  }

  function flush() {
    return timeout === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timeout !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastCallTime = time

    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxWait !== undefined) {
        timeout = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeout === undefined) {
      timeout = startTimer(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending

  return debounced
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle
 * @param {Object} options - Additional options
 * @returns {Function} - The throttled function
 */
// Removed throttle (unused)

// ===== IMAGE OPTIMIZATION =====

// Lazy loading observer
let imageObserver = null

// Initialize intersection observer for lazy loading
const initImageObserver = () => {
  if (imageObserver) return imageObserver
  
  imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove('lazy')
        imageObserver.unobserve(img)
      }
    })
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  })
  
  return imageObserver
}

// Lazy load image
export const lazyLoadImage = (imgElement) => {
  const observer = initImageObserver()
  observer.observe(imgElement)
}

// Generate responsive image srcset
export const generateSrcSet = (imageUrl, sizes = [320, 640, 960, 1280]) => {
  if (!imageUrl) return ''
  
  return sizes
    .map(size => `${imageUrl}?w=${size} ${size}w`)
    .join(', ')
}

// Generate responsive image sizes attribute
export const generateSizes = (breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => `(min-width: ${width}) ${width}`)
    .join(', ') + ', 100vw'
}

// Optimize image URL with parameters
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return ''
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options
  
  const params = new URLSearchParams()
  
  if (width) params.append('w', width)
  if (height) params.append('h', height)
  if (quality) params.append('q', quality)
  if (format) params.append('f', format)
  if (fit) params.append('fit', fit)
  
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${params.toString()}`
}

// Preload critical images
// Removed preload/compress helpers (unused): preloadImage(s), getImageDimensions, compressImage

// Generate placeholder for image
export const generatePlaceholder = (width, height, text = '') => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = width
  canvas.height = height
  
  // Background
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, width, height)
  
  // Text
  if (text) {
    ctx.fillStyle = '#9ca3af'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2)
  }
  
  return canvas.toDataURL()
}

// Check if image is loaded
// Removed image helpers (unused): isImageLoaded, getDominantColor

// ===== PERFORMANCE MONITORING =====

// Removed performance monitor (unused): PerformanceMonitor, PerformancePlugin, measure*, default export
