/**
 * Optimization Utilities - Performance, Image, and Debounce
 */

// ===== TYPES =====

interface DebounceOptions {
  immediate?: boolean
  trailing?: boolean
  maxWait?: number
}

interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: string
  fit?: string
}

interface Breakpoints {
  [key: string]: string
}

type DebouncedFunction<T extends (...args: any[]) => any> = T & {
  cancel: () => void
  flush: () => ReturnType<T>
  pending: () => boolean
}

// ===== DEBOUNCE & THROTTLE =====

/**
 * Enhanced debounce function with better performance and options
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { immediate = false, trailing = true, maxWait } = options
  let timeout: NodeJS.Timeout | undefined
  let lastCallTime: number | undefined
  let lastInvokeTime = 0
  let result: ReturnType<T>
  let lastArgs: Parameters<T> | undefined

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs!
    lastInvokeTime = time
    result = func(...args)
    return result
  }

  function startTimer(pendingFunc: () => void, wait: number): NodeJS.Timeout {
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id: NodeJS.Timeout): void {
    clearTimeout(id)
  }

  function leadingEdge(time: number): ReturnType<T> {
    lastInvokeTime = time
    timeout = startTimer(timerExpired, wait)
    return immediate ? invokeFunc(time) : result
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0)
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0)
    const timeSinceLastInvoke = time - lastInvokeTime

    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
            (timeSinceLastCall < 0) || (maxWait !== undefined && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired(): void {
    const time = Date.now()
    if (shouldInvoke(time)) {
      trailingEdge(time)
    } else {
      timeout = startTimer(timerExpired, remainingWait(time))
    }
  }

  function trailingEdge(time: number): ReturnType<T> {
    timeout = undefined

    if (trailing && lastCallTime !== undefined) {
      return invokeFunc(time)
    }
    return result
  }

  function cancel(): void {
    if (timeout !== undefined) {
      cancelTimer(timeout)
    }
    lastInvokeTime = 0
    lastCallTime = undefined
    timeout = undefined
  }

  function flush(): ReturnType<T> {
    return timeout === undefined ? result : trailingEdge(Date.now())
  }

  function pending(): boolean {
    return timeout !== undefined
  }

  function debounced(...args: Parameters<T>): ReturnType<T> {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastCallTime = time
    lastArgs = args

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

  return debounced as DebouncedFunction<T>
}

// ===== IMAGE OPTIMIZATION =====

// Lazy loading observer
let imageObserver: IntersectionObserver | null = null

// Initialize intersection observer for lazy loading
const initImageObserver = (): IntersectionObserver => {
  if (imageObserver) return imageObserver
  
  imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        img.classList.remove('lazy')
        imageObserver?.unobserve(img)
      }
    })
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  })
  
  return imageObserver
}

// Lazy load image
export const lazyLoadImage = (imgElement: HTMLImageElement): void => {
  const observer = initImageObserver()
  observer.observe(imgElement)
}

// Generate responsive image srcset
export const generateSrcSet = (imageUrl: string, sizes: number[] = [320, 640, 960, 1280]): string => {
  if (!imageUrl) return ''
  
  return sizes
    .map(size => `${imageUrl}?w=${size} ${size}w`)
    .join(', ')
}

// Generate responsive image sizes attribute
export const generateSizes = (breakpoints: Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => `(min-width: ${width}) ${width}`)
    .join(', ') + ', 100vw'
}

// Optimize image URL with parameters
export const optimizeImageUrl = (url: string, options: ImageOptimizationOptions = {}): string => {
  if (!url) return ''
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options
  
  const params = new URLSearchParams()
  
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())
  if (quality) params.append('q', quality.toString())
  if (format) params.append('f', format)
  if (fit) params.append('fit', fit)
  
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${params.toString()}`
}

// Generate placeholder for image
export const generatePlaceholder = (width: number, height: number, text: string = ''): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''
  
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