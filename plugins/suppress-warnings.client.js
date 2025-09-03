export default defineNuxtPlugin(() => {
  // Suppress experimental features warnings
  const originalWarn = console.warn
  console.warn = function(...args) {
    const message = args[0]
    
    // Suppress Suspense experimental warning
    if (typeof message === 'string' && message.includes('Suspense') && message.includes('experimental')) {
      return
    }
    
    // Suppress other experimental features warnings
    if (typeof message === 'string' && message.includes('experimental') && message.includes('API will likely change')) {
      return
    }
    
    // Call original warn for other messages
    //originalWarn.apply(console, args)
  }
}) 