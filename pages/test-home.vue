<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Test Trang Home</h1>
        <p class="text-gray-600">Kiểm tra section tin tức trên trang home</p>
      </div>
    </div>

    <!-- API Status -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :class="loading ? 'bg-yellow-400' : 'bg-green-400'"></div>
            <span class="text-sm font-medium">{{ loading ? 'Loading...' : 'Ready' }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :class="error ? 'bg-red-400' : 'bg-green-400'"></div>
            <span class="text-sm font-medium">{{ error ? 'Error' : 'No Error' }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-blue-400"></div>
            <span class="text-sm font-medium">{{ posts.length }} posts</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Buttons -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex space-x-4">
          <button 
            @click="testApi"
            :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Test API
          </button>
          <button 
            @click="useMockData"
            class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Use Mock Data
          </button>
          <button 
            @click="clearData"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          >
            Clear Data
          </button>
        </div>
      </div>
    </div>

    <!-- News Section Component -->
    <div class="py-8">
      <NewsSection :limit="3" />
    </div>

    <!-- Debug Info -->
    <div class="bg-white shadow-sm border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <details class="cursor-pointer">
          <summary class="font-medium text-gray-900">Debug Info</summary>
          <div class="mt-4 space-y-2 text-sm">
            <p><strong>Loading:</strong> {{ loading }}</p>
            <p><strong>Error:</strong> {{ error || 'None' }}</p>
            <p><strong>Posts Count:</strong> {{ posts.length }}</p>
            <p><strong>API Base URL:</strong> {{ apiBaseUrl }}</p>
            <div v-if="posts.length > 0" class="mt-4">
              <p><strong>Posts Data:</strong></p>
              <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">{{ JSON.stringify(posts, null, 2) }}</pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApiPosts } from '../composables/useApiPosts.js'
import { useTestApi } from '../composables/useTestApi.js'

// Page meta
definePageMeta({
  layout: 'home',
  title: 'Test Home - E-Commerce Platform'
})

// Sử dụng composables
const { 
  posts,
  loading,
  error,
  fetchLatestPosts,
  formatDate,
  formatExcerpt,
  getCardGradient,
  getTextColor
} = useApiPosts()

const { testWithMockData } = useTestApi()

// Runtime config
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase

// Test functions
const testApi = async () => {
  try {
    console.log('🚀 Testing API from home page...')
    await fetchLatestPosts(3)
    console.log('✅ API test successful from home page')
  } catch (error) {
    console.error('❌ API test failed from home page:', error)
  }
}

const useMockData = () => {
  console.log('🧪 Using mock data from home page...')
  const mockData = testWithMockData()
  
  if (mockData && mockData.data) {
    posts.value = mockData.data.slice(0, 3).map(post => ({
      ...post,
      formattedDate: formatDate(post.published_at || post.created_at),
      formattedExcerpt: formatExcerpt(post.excerpt || post.content),
      cardGradient: getCardGradient(post.id),
      textColor: getTextColor(post.id)
    }))
    console.log('✅ Mock data applied to home page')
  }
}

const clearData = () => {
  posts.value = []
  console.log('🗑️ Data cleared from home page')
}

// Auto test khi component mount
onMounted(() => {
  console.log('🎯 Home test page mounted, testing API...')
  testApi()
})
</script>
