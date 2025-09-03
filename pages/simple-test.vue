<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Simple API Test</h1>
      
      <!-- Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Status</h2>
        <div class="space-y-2">
          <p><strong>Loading:</strong> {{ loading ? 'Yes' : 'No' }}</p>
          <p><strong>Error:</strong> {{ error || 'None' }}</p>
          <p><strong>Posts Count:</strong> {{ posts.length }}</p>
          <p><strong>API Base URL:</strong> {{ apiBaseUrl }}</p>
        </div>
      </div>
      
      <!-- Test Button -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <button 
          @click="testApi"
          :disabled="loading"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Testing...' : 'Test API' }}
        </button>
      </div>
      
      <!-- Console Logs -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Console Logs</h2>
        <div class="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-auto">
          <div v-for="(log, index) in logs" :key="index" class="mb-1">
            {{ log }}
          </div>
        </div>
      </div>
      
      <!-- Posts Display -->
      <div v-if="posts.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Posts ({{ posts.length }})</h2>
        <div class="space-y-4">
          <div 
            v-for="post in posts" 
            :key="post.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <h3 class="font-semibold text-lg">{{ post.name }}</h3>
            <p class="text-gray-600 text-sm">ID: {{ post.id }} | Slug: {{ post.slug }}</p>
            <p class="text-gray-600 text-sm">Published: {{ post.published_at }}</p>
            <div v-if="post.categories && post.categories.length > 0" class="mt-2">
              <span class="text-sm text-blue-600">Categories: </span>
              <span class="text-sm">{{ post.categories.map(c => c.name).join(', ') }}</span>
            </div>
            <div v-if="post.tags && post.tags.length > 0" class="mt-1">
              <span class="text-sm text-green-600">Tags: </span>
              <span class="text-sm">{{ post.tags.map(t => t.name).join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Raw Response -->
      <div v-if="rawResponse" class="bg-white rounded-lg shadow p-6 mt-6">
        <h2 class="text-xl font-semibold mb-4">Raw API Response</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{{ JSON.stringify(rawResponse, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApiPosts } from '../composables/useApiPosts.js'

// Page meta
definePageMeta({
  layout: 'home',
  title: 'Simple Test - E-Commerce Platform'
})

// Sử dụng API posts composable
const { 
  posts,
  loading,
  error,
  fetchPosts
} = useApiPosts()

// Runtime config
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase

// Logs và raw response
const logs = ref([])
const rawResponse = ref(null)

// Helper function để add log
const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push(`[${timestamp}] ${message}`)
  console.log(message)
}

// Test API function
const testApi = async () => {
  try {
    addLog('🚀 Starting API test...')
    addLog(`📍 API Base URL: ${apiBaseUrl}`)
    addLog('📡 Calling fetchPosts...')
    
    const result = await fetchPosts({ limit: 5 })
    
    addLog('✅ API call completed!')
    addLog(`📊 Received ${result.data.length} posts`)
    
    rawResponse.value = result
    
    if (result.data.length > 0) {
      addLog('🎉 Success! Posts data received')
    } else {
      addLog('⚠️ No posts data received')
    }
    
  } catch (err) {
    addLog(`❌ API Error: ${err.message}`)
    addLog(`🔍 Error details: ${JSON.stringify(err.response?.data || err.message)}`)
  }
}

// Auto test khi component mount
onMounted(() => {
  addLog('🎯 Component mounted, starting auto test...')
  testApi()
})
</script>
