<template>
  <div class="api-debugger p-4 bg-gray-100 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">🔧 API Debugger</h3>
    
    <!-- Server Status -->
    <div class="mb-4">
      <h4 class="font-medium mb-2">Server Status</h4>
      <div class="flex items-center space-x-2">
        <div :class="['w-3 h-3 rounded-full', serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500']"></div>
        <span>{{ serverStatus === 'online' ? '🟢 Online' : '🔴 Offline' }}</span>
      </div>
    </div>
    
    <!-- API Base URL -->
    <div class="mb-4">
      <h4 class="font-medium mb-2">API Configuration</h4>
      <div class="bg-white p-2 rounded border">
        <code class="text-sm">{{ apiBaseUrl }}</code>
      </div>
    </div>
    
    <!-- Test Buttons -->
    <div class="mb-4">
      <h4 class="font-medium mb-2">Test Endpoints</h4>
      <div class="space-y-2">
        <button 
          @click="testConnectivity"
          class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Test Connectivity
        </button>
        <button 
          @click="testAuthEndpoints"
          class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 ml-2"
        >
          Test Auth Endpoints
        </button>
      </div>
    </div>
    
    <!-- Results -->
    <div v-if="testResults.length > 0" class="mb-4">
      <h4 class="font-medium mb-2">Test Results</h4>
      <div class="space-y-2">
        <div 
          v-for="result in testResults" 
          :key="result.timestamp"
          class="bg-white p-3 rounded border"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium">{{ result.name }}</span>
            <span :class="result.success ? 'text-green-600' : 'text-red-600'">
              {{ result.success ? '✅' : '❌' }}
            </span>
          </div>
          <div class="text-sm text-gray-600">
            <div>Status: {{ result.status }}</div>
            <div v-if="result.message">Message: {{ result.message }}</div>
            <div v-if="result.data" class="mt-1">
              <details>
                <summary class="cursor-pointer">Response Data</summary>
                <pre class="text-xs mt-1 bg-gray-50 p-2 rounded">{{ JSON.stringify(result.data, null, 2) }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error Log -->
    <div v-if="errorLog.length > 0" class="mb-4">
      <h4 class="font-medium mb-2">Error Log</h4>
      <div class="space-y-2">
        <div 
          v-for="error in errorLog" 
          :key="error.timestamp"
          class="bg-red-50 p-3 rounded border border-red-200"
        >
          <div class="text-sm text-red-800">
            <div class="font-medium">{{ error.message }}</div>
            <div class="text-xs text-red-600 mt-1">{{ error.timestamp }}</div>
            <details class="mt-2">
              <summary class="cursor-pointer text-xs">Error Details</summary>
              <pre class="text-xs mt-1 bg-red-100 p-2 rounded">{{ JSON.stringify(error.details, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApiClient } from '../../composables/api/useApiClient.js'

const apiClient = useApiClient()
const config = useRuntimeConfig()

const serverStatus = ref('checking')
const apiBaseUrl = ref(config.public.apiBase)
const testResults = ref([])
const errorLog = ref([])

// Test server connectivity
const testConnectivity = async () => {
  try {
    const response = await apiClient.get('/')
    serverStatus.value = 'online'
    testResults.value.push({
      name: 'Server Connectivity',
      success: true,
      status: response.status,
      data: response.data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    serverStatus.value = 'offline'
    testResults.value.push({
      name: 'Server Connectivity',
      success: false,
      status: error.response?.status || 'Network Error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
    
    errorLog.value.push({
      message: 'Server connectivity failed',
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        code: error.code
      },
      timestamp: new Date().toISOString()
    })
  }
}

// Test auth endpoints
const testAuthEndpoints = async () => {
  const endpoints = [
    { name: 'Get User Info', method: 'GET', url: '/api/me' },
    { name: 'Login', method: 'POST', url: '/api/login', data: { email: 'test@example.com', password: 'password' } },
    { name: 'Register', method: 'POST', url: '/api/register', data: { name: 'Test User', email: 'test@example.com', password: 'password' } }
  ]
  
  for (const endpoint of endpoints) {
    try {
      let response
      if (endpoint.method === 'GET') {
        response = await apiClient.get(endpoint.url)
      } else if (endpoint.method === 'POST') {
        response = await apiClient.post(endpoint.url, endpoint.data || {})
      }
      
      testResults.value.push({
        name: endpoint.name,
        success: true,
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      testResults.value.push({
        name: endpoint.name,
        success: false,
        status: error.response?.status || 'Network Error',
        message: error.userMessage || error.message,
        timestamp: new Date().toISOString()
      })
      
      errorLog.value.push({
        message: `${endpoint.name} failed`,
        details: {
          url: endpoint.url,
          method: endpoint.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        },
        timestamp: new Date().toISOString()
      })
    }
  }
}

onMounted(() => {
  testConnectivity()
})
</script> 