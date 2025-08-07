export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  tailwindcss: {},

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://127.0.0.1:8000'
    }
  },

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

  css: [
    '~/assets/css/global.css'
  ],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  vite: {
    resolve: {
      alias: {
        '@': '.',
        '~': '.'
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('@ckeditor')) {
              return 'ckeditor'
            }
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
      chunkSizeWarningLimit: 1500
    },
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
    ssr: {
      noExternal: ['@ckeditor/ckeditor5-build-decoupled-document']
    },
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false
    }
  },

  nitro: {
    compressPublicAssets: true,
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

  vue: {
    compilerOptions: {
      hoistStatic: false
    }
  },

  alias: {
    '@': '.',
    '~': '.'
  }
})
