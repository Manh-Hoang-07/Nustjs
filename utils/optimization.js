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
export function throttle(func, wait, options = {}) {
  const { leading = true, trailing = true } = options
  return debounce(func, wait, { leading, trailing, maxWait: wait })
}

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
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Preload multiple images
export const preloadImages = (srcs) => {
  return Promise.all(srcs.map(src => preloadImage(src)))
}

// Get image dimensions
export const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      })
    }
    img.src = URL.createObjectURL(file)
  })
}

// Compress image before upload
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, {
          type: `image/${format}`,
          lastModified: Date.now()
        }))
      }, `image/${format}`, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

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
export const isImageLoaded = (src) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

// Get dominant color from image
export const getDominantColor = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      const colorCounts = {}
      
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]
        const rgb = `${r},${g},${b}`
        
        colorCounts[rgb] = (colorCounts[rgb] || 0) + 1
      }
      
      const dominantColor = Object.keys(colorCounts).reduce((a, b) => 
        colorCounts[a] > colorCounts[b] ? a : b
      )
      
      resolve(dominantColor)
    }
    
    img.onerror = () => resolve(null)
    img.src = imageUrl
  })
}

// ===== PERFORMANCE MONITORING =====

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = []
    this.isEnabled = process.env.NODE_ENV !== 'production'
  }

  // Start timing an operation
  startTimer(name) {
    if (!this.isEnabled) return
    
    const startTime = performance.now()
    this.metrics.set(name, { startTime, endTime: null, duration: null })
    
    return () => this.endTimer(name)
  }

  // End timing an operation
  endTimer(name) {
    if (!this.isEnabled) return
    
    const metric = this.metrics.get(name)
    if (!metric) return
    
    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime
    
    this.logMetric(name, metric.duration)
    this.notifyObservers(name, metric.duration)
  }

  // Measure component render time
  measureComponentRender(componentName, callback) {
    if (!this.isEnabled) {
      return callback()
    }
    
    const endTimer = this.startTimer(`component-render-${componentName}`)
    
    try {
      const result = callback()
      endTimer()
      return result
    } catch (error) {
      endTimer()
      throw error
    }
  }

  // Measure API call performance
  measureApiCall(endpoint, apiCall) {
    if (!this.isEnabled) {
      return apiCall()
    }
    
    const endTimer = this.startTimer(`api-call-${endpoint}`)
    
    return apiCall()
      .then(result => {
        endTimer()
        return result
      })
      .catch(error => {
        endTimer()
        throw error
      })
  }

  // Measure DOM operation
  measureDomOperation(operationName, operation) {
    if (!this.isEnabled) {
      return operation()
    }
    
    const endTimer = this.startTimer(`dom-operation-${operationName}`)
    
    try {
      const result = operation()
      endTimer()
      return result
    } catch (error) {
      endTimer()
      throw error
    }
  }

  // Get performance metrics
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // Get average duration for a metric
  getAverageDuration(name) {
    const metrics = Array.from(this.metrics.values())
      .filter(metric => metric.duration !== null)
    
    if (metrics.length === 0) return 0
    
    const totalDuration = metrics.reduce((sum, metric) => sum + metric.duration, 0)
    return totalDuration / metrics.length
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear()
  }

  // Log metric to console
  logMetric(name, duration) {
    if (!this.isEnabled) return
    
    // Performance measurement completed
  }

  // Add observer for performance events
  addObserver(callback) {
    this.observers.push(callback)
  }

  // Remove observer
  removeObserver(callback) {
    const index = this.observers.indexOf(callback)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  // Notify observers
  notifyObservers(name, duration) {
    this.observers.forEach(callback => {
      try {
        callback(name, duration)
      } catch (error) {
        console.error('Performance observer error:', error)
      }
    })
  }

  // Enable/disable monitoring
  setEnabled(enabled) {
    this.isEnabled = enabled
  }

  // Get memory usage
  getMemoryUsage() {
    if (!performance.memory) return null
    
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    }
  }

  // Get navigation timing
  getNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (!navigation) return null
    
    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      load: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart
    }
  }

  // Get resource timing
  getResourceTiming() {
    const resources = performance.getEntriesByType('resource')
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType
    }))
  }

  // Monitor long tasks
  monitorLongTasks(callback) {
    if (!this.isEnabled) return
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // 50ms threshold
          callback(entry)
        }
      })
    })
    
    observer.observe({ entryTypes: ['longtask'] })
    return observer
  }

  // Monitor layout shifts
  monitorLayoutShifts(callback) {
    if (!this.isEnabled) return
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.value > 0.1) { // 0.1 threshold
          callback(entry)
        }
      })
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
    return observer
  }

  // Monitor first input delay
  monitorFirstInput(callback) {
    if (!this.isEnabled) return
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        callback(entry)
      })
    })
    
    observer.observe({ entryTypes: ['first-input'] })
    return observer
  }

  // Generate performance report
  generateReport() {
    const report = {
      metrics: this.getMetrics(),
      memory: this.getMemoryUsage(),
      navigation: this.getNavigationTiming(),
      resources: this.getResourceTiming(),
      timestamp: new Date().toISOString()
    }
    
    return report
  }

  // Send performance data to analytics
  sendToAnalytics(data) {
    if (!this.isEnabled) return
    
    // Send to your analytics service
    
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'performance',
        event_label: data.name,
        value: Math.round(data.duration)
      })
    }
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor()

// Vue plugin
export const PerformancePlugin = {
  install(app) {
    app.config.globalProperties.$performance = performanceMonitor
    
    // Monitor component render times
    app.mixin({
      mounted() {
        const componentName = this.$options.name || this.$options.__file || 'Unknown'
        performanceMonitor.measureComponentRender(componentName, () => {
          // Component is already mounted, so we just log the timing
        })
      }
    })
  }
}

// Export utilities
export const measureTime = (name, operation) => {
  return performanceMonitor.measureDomOperation(name, operation)
}

export const measureApiCall = (endpoint, apiCall) => {
  return performanceMonitor.measureApiCall(endpoint, apiCall)
}

export const measureComponentRender = (componentName, callback) => {
  return performanceMonitor.measureComponentRender(componentName, callback)
}

export const getPerformanceMetrics = () => {
  return performanceMonitor.getMetrics()
}

export const getPerformanceReport = () => {
  return performanceMonitor.generateReport()
}

export default performanceMonitor
