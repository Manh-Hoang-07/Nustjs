<template>
  <div class="container mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">Test API Connection</h1>
    
    <div class="space-y-4">
      <button 
        @click="testConnection" 
        :disabled="loading"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Testing...' : 'Test API Connection' }}
      </button>
      
      <div v-if="result" class="p-4 bg-gray-100 rounded">
        <h3 class="font-bold">Result:</h3>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      
      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded">
        <h3 class="font-bold">Error:</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApiClient } from '~/composables/api/useApiClient.js'

const { apiClient } = useApiClient()
const loading = ref(false)
const result = ref(null)
const error = ref(null)

const testConnection = async () => {
  loading.value = true
  result.value = null
  error.value = null
  
  try {
    console.log('Testing API connection...')
    const response = await apiClient.get('/api/config-v2/general')
    result.value = response.data
    console.log('API response:', response.data)
  } catch (err) {
    error.value = err.message || 'Unknown error'
    console.error('API error:', err)
  } finally {
    loading.value = false
  }
}
</script>
