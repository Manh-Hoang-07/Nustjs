// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  
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

  // Global CSS
  css: [
    '~/assets/css/global.css'
  ],

  // Color mode
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  // Vite configuration for bundle optimization
  vite: {
    resolve: {
      alias: {
        '@': '.',
        '~': '.'
      }
    },
    build: {
      // Optimize bundle size
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Tách CKEditor thành chunk riêng
            if (id.includes('@ckeditor')) {
              return 'ckeditor'
            }
            // Tách vendor libraries
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vendor-vue'
              if (id.includes('@heroicons')) return 'vendor-ui'
              if (id.includes('axios') || id.includes('pinia')) return 'vendor-utils'
              if (id.includes('vue-multiselect')) return 'vendor-multiselect'
              return 'vendor'
            }
          }
        }
      },
      // Tăng limit để tránh warning không cần thiết
      chunkSizeWarningLimit: 1500
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        '@heroicons/vue'
      ],
      exclude: [
        '@ckeditor/ckeditor5-build-decoupled-document'
      ]
    },
    // Performance optimizations
    ssr: {
      noExternal: ['@ckeditor/ckeditor5-build-decoupled-document']
    },
    // Suppress experimental features warnings
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false
    }
  },

  // Nitro configuration for SSR optimization
  nitro: {
    // Enable compression
    compressPublicAssets: true,
    
    // Route rules for caching
    routeRules: {
      '/admin/**': { 
        headers: { 
          'cache-control': 'no-cache' 
        } 
      },
      '/api/**': { 
        headers: { 
          'cache-control': 'no-cache' 
        } 
      }
    }
  },

  // Vue configuration to avoid experimental features
  vue: {
    compilerOptions: {
      // Disable experimental features
      hoistStatic: false
    }
  },

  // Alias configuration
  alias: {
    '@': '.',
    '~': '.'
  }
})
