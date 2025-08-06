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
          manualChunks: {
            // Separate vendor chunks
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-ui': ['@heroicons/vue'],
            'vendor-utils': ['axios', 'pinia'],
            'vendor-editor': ['@ckeditor/ckeditor5-build-decoupled-document'],
            'vendor-multiselect': ['vue-multiselect']
          }
        }
      },
      // Tree shaking
      treeshake: true,
      // Minify
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production'
        }
      }
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
    }
  },

  // Build optimization
  build: {
    // Enable source maps only in development
    sourcemap: process.env.NODE_ENV !== 'production',
    
    // Optimize CSS
    extractCSS: true,
    
    // Optimize images
    transpile: [
      '@heroicons/vue',
      'vue-multiselect'
    ]
  },

  // Performance optimizations
  performance: {
    // Enable performance monitoring
    metrics: process.env.NODE_ENV === 'production'
  },

  // Nitro configuration for SSR optimization
  nitro: {
    // Enable compression
    compressPublicAssets: true,
    
    // Optimize static assets
    static: {
      maxAge: 60 * 60 * 24 * 365 // 1 year
    },
    
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

  // Alias configuration
  alias: {
    '@': '.',
    '~': '.'
  },

  // Experimental features for better performance
  experimental: {
    // Enable view transitions
    viewTransition: true,
    
    // Enable payload extraction
    payloadExtraction: true,
    
    // Enable renderJsonPayloads
    renderJsonPayloads: true
  }
})
