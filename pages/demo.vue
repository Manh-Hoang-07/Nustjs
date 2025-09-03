<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Demo Tin Tức</h1>
      
      <!-- API Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Trạng thái API</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold" :class="loading ? 'text-yellow-600' : 'text-green-600'">
              {{ loading ? '⏳' : '✅' }}
            </div>
            <div class="text-sm text-gray-600">Loading</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold" :class="error ? 'text-red-600' : 'text-green-600'">
              {{ error ? '❌' : '✅' }}
            </div>
            <div class="text-sm text-gray-600">Error</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ posts.length }}</div>
            <div class="text-sm text-gray-600">Posts</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ apiBaseUrl }}</div>
            <div class="text-sm text-gray-600">API Base</div>
          </div>
        </div>
      </div>
      
      <!-- Test Buttons -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Test API</h2>
        <div class="flex gap-4">
          <button 
            @click="testRealApi"
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Testing...' : 'Test Real API' }}
          </button>
          <button 
            @click="useMockData"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Use Mock Data
          </button>
          <button 
            @click="clearData"
            class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Data
          </button>
        </div>
      </div>
      
      <!-- News Section Component -->
      <NewsSection :limit="6" />
      
      <!-- Raw Data Debug -->
      <div v-if="debugData" class="bg-white rounded-lg shadow p-6 mt-8">
        <h2 class="text-xl font-semibold mb-4">Debug Data</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{{ JSON.stringify(debugData, null, 2) }}</pre>
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
  title: 'Demo - E-Commerce Platform'
})

// Sử dụng composables
const { 
  posts,
  loading,
  error,
  fetchLatestPosts
} = useApiPosts()

const { testPostsApi, testWithMockData } = useTestApi()

// Runtime config
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase

// Debug data
const debugData = ref(null)

// Test functions
const testRealApi = async () => {
  try {
    console.log('🚀 Testing real API...')
    const result = await testPostsApi()
    debugData.value = result
    console.log('✅ Real API test successful:', result)
  } catch (err) {
    console.error('❌ Real API test failed:', err)
    debugData.value = { error: err.message }
  }
}

const useMockData = () => {
  console.log('🧪 Using mock data...')
  const mockData = testWithMockData()
  debugData.value = mockData
  
  // Cập nhật posts với mock data
  if (mockData && mockData.data) {
    posts.value = mockData.data.slice(0, 6).map(post => ({
      ...post,
      formattedDate: formatDate(post.published_at || post.created_at),
      formattedExcerpt: formatExcerpt(post.excerpt || post.content),
      cardGradient: getCardGradient(post.id),
      textColor: getTextColor(post.id)
    }))
  }
}

const clearData = () => {
  posts.value = []
  debugData.value = null
  console.log('🗑️ Data cleared')
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatExcerpt = (content, maxLength = 150) => {
  if (!content) return ''
  const text = content.replace(/<[^>]*>/g, '')
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const getCardGradient = (index) => {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600', 
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600'
  ]
  return gradients[index % gradients.length]
}

const getTextColor = (index) => {
  const colors = [
    'text-blue-600 hover:text-blue-800',
    'text-green-600 hover:text-green-800',
    'text-purple-600 hover:text-purple-800',
    'text-pink-600 hover:text-pink-800',
    'text-yellow-600 hover:text-yellow-800',
    'text-red-600 hover:text-red-800'
  ]
  return colors[index % colors.length]
}

// Auto test khi component mount
onMounted(() => {
  console.log('🎯 Demo page mounted, testing API...')
  testRealApi()
})
</script>
