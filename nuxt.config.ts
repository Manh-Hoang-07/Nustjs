// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  // Tailwind CSS configuration - Use default
  tailwindcss: {
    // Use default Tailwind CSS
  },

  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://127.0.0.1:8000'
    }
  },



  // App config
  app: {
    head: {
      title: 'Laravel Nuxt App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Laravel Nuxt Application' }
      ]
    }
  },

  // Color mode
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  // Vite configuration
  vite: {
    resolve: {
      alias: {
        '@': '.',
        '~': '.'
      }
    }
  },

  // Alias configuration
  alias: {
    '@': '.',
    '~': '.'
  }
})
