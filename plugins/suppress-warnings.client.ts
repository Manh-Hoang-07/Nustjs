// ===== TYPES =====

type ConsoleWarnFunction = (...args: any[]) => void

// ===== PLUGIN =====

export default defineNuxtPlugin(() => {
  // Suppress experimental features warnings
  const originalWarn: ConsoleWarnFunction = console.warn
  
  console.warn = function(...args: any[]): void {
    const message = args[0]
    
    // Suppress Suspense experimental warning
    if (typeof message === 'string' && message.includes('Suspense') && message.includes('experimental')) {
      return
    }
    
    // Suppress other experimental features warnings
    if (typeof message === 'string' && message.includes('experimental') && message.includes('API will likely change')) {
      return
    }
    
    // Suppress Vue 3 transition warnings
    if (typeof message === 'string' && message.includes('transition') && message.includes('experimental')) {
      return
    }
    
    // Suppress Nuxt specific warnings
    if (typeof message === 'string' && message.includes('Nuxt') && message.includes('experimental')) {
      return
    }
    
    // Call original warn for other messages
    // originalWarn.apply(console, args)
  }
})
