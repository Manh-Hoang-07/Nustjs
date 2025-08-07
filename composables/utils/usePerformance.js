import { ref, onMounted, onUnmounted } from 'vue'

export function usePerformance() {
  const metrics = ref({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    bundleSize: 0
  })

  const startTime = ref(0)
  const apiTimings = ref([])

  // Helper function để lấy thời gian hiện tại (tương thích SSR)
  const getNow = () => {
    if (process.client && typeof performance !== 'undefined' && performance.now) {
      return performance.now()
    }
    return Date.now()
  }

  // Measure page load time
  const measurePageLoad = () => {
    if (process.client) {
      startTime.value = getNow()
      
      window.addEventListener('load', () => {
        const loadTime = getNow() - startTime.value
        metrics.value.pageLoadTime = loadTime
        
        // Log slow page loads
        if (loadTime > 3000) {
          console.warn(`Slow page load: ${loadTime.toFixed(2)}ms`)
        }
      })
    }
  }

  // Measure API response time
  const measureApiCall = (url) => {
    const start = getNow()
    return () => {
      const duration = getNow() - start
      apiTimings.value.push({ url, duration })
      metrics.value.apiResponseTime = duration
      
      // Log slow API calls
      if (duration > 2000) {
        console.warn(`Slow API call: ${url} took ${duration.toFixed(2)}ms`)
      }
    }
  }

  // Monitor memory usage
  const measureMemoryUsage = () => {
    if (process.client && performance.memory) {
      const memory = performance.memory
      metrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
      
      // Warn if memory usage is high
      if (metrics.value.memoryUsage > 100) {
        console.warn(`High memory usage: ${metrics.value.memoryUsage.toFixed(2)}MB`)
      }
    }
  }

  // Bundle size monitoring
  const measureBundleSize = () => {
    if (process.client) {
      // Estimate bundle size from loaded resources
      const resources = performance.getEntriesByType('resource')
      const totalSize = resources.reduce((sum, resource) => {
        return sum + (resource.transferSize || 0)
      }, 0)
      
      metrics.value.bundleSize = totalSize / 1024 / 1024 // MB
    }
  }

  // Performance monitoring interval
  let monitoringInterval = null

  const startMonitoring = () => {
    if (process.client) {
      measurePageLoad()
      
      // Monitor performance every 30 seconds
      monitoringInterval = setInterval(() => {
        measureMemoryUsage()
        measureBundleSize()
      }, 30000)
    }
  }

  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval)
      monitoringInterval = null
    }
  }

  // Auto cleanup
  onMounted(() => {
    startMonitoring()
  })

  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    metrics,
    measureApiCall,
    startMonitoring,
    stopMonitoring
  }
} 