import { fileURLToPath } from 'node:url'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  // tailwindcss: {},

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://127.0.0.1:8000'
    }
  },

  app: {
    head: {
      title: 'App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Application' }
      ]
    }
  },

  css: [
    '~/assets/css/global.css'
  ],

  // colorMode: {
  //   preference: 'light',
  //   fallback: 'light',
  //   classSuffix: ''
  // },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url))
      }
    },
    build: {
      sourcemap: true,
      minify: true,
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
    sourceMap: false,
    minify: true,
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

})
