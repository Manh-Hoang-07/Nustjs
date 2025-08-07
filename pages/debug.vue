<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">🔧 Debug Page</h1>
    
    <!-- API Debugger -->
    <ApiDebugger />
    
    <!-- Manual Test -->
    <div class="mt-8 p-4 bg-blue-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">🧪 Manual API Test</h3>
      
      <div class="space-y-4">
        <!-- Login Test -->
        <div class="bg-white p-4 rounded border">
          <h4 class="font-medium mb-2">Login Test</h4>
          <div class="space-y-2">
            <input 
              v-model="loginData.email" 
              type="email" 
              placeholder="Email"
              class="w-full p-2 border rounded"
            />
            <input 
              v-model="loginData.password" 
              type="password" 
              placeholder="Password"
              class="w-full p-2 border rounded"
            />
            <button 
              @click="testLogin"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Login
            </button>
          </div>
          <div v-if="loginResult" class="mt-2 p-2 bg-gray-100 rounded text-sm">
            <pre>{{ JSON.stringify(loginResult, null, 2) }}</pre>
          </div>
        </div>
        
        <!-- Register Test -->
        <div class="bg-white p-4 rounded border">
          <h4 class="font-medium mb-2">Register Test</h4>
          <div class="space-y-2">
            <input 
              v-model="registerData.name" 
              type="text" 
              placeholder="Name"
              class="w-full p-2 border rounded"
            />
            <input 
              v-model="registerData.email" 
              type="email" 
              placeholder="Email"
              class="w-full p-2 border rounded"
            />
            <input 
              v-model="registerData.password" 
              type="password" 
              placeholder="Password"
              class="w-full p-2 border rounded"
            />
            <button 
              @click="testRegister"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Register
            </button>
          </div>
          <div v-if="registerResult" class="mt-2 p-2 bg-gray-100 rounded text-sm">
            <pre>{{ JSON.stringify(registerResult, null, 2) }}</pre>
          </div>
        </div>
        
        <!-- Get User Info Test -->
        <div class="bg-white p-4 rounded border">
          <h4 class="font-medium mb-2">Get User Info Test</h4>
          <button 
            @click="testGetUserInfo"
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Get User Info
          </button>
          <div v-if="userInfoResult" class="mt-2 p-2 bg-gray-100 rounded text-sm">
            <pre>{{ JSON.stringify(userInfoResult, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApiClient } from '../composables/api/useApiClient.js'
import ApiDebugger from '../components/Debug/ApiDebugger.vue'

const apiClient = useApiClient()

const loginData = ref({
  email: 'admin@example.com',
  password: 'password'
})

const registerData = ref({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password'
})

const loginResult = ref(null)
const registerResult = ref(null)
const userInfoResult = ref(null)

const testLogin = async () => {
  try {
    const response = await apiClient.post('/api/login', loginData.value)
    loginResult.value = {
      success: true,
      data: response.data
    }
  } catch (error) {
    loginResult.value = {
      success: false,
      error: {
        status: error.response?.status,
        message: error.userMessage || error.message,
        details: error.debug
      }
    }
  }
}

const testRegister = async () => {
  try {
    const response = await apiClient.post('/api/register', registerData.value)
    registerResult.value = {
      success: true,
      data: response.data
    }
  } catch (error) {
    registerResult.value = {
      success: false,
      error: {
        status: error.response?.status,
        message: error.userMessage || error.message,
        details: error.debug
      }
    }
  }
}

const testGetUserInfo = async () => {
  try {
    const response = await apiClient.get('/api/me')
    userInfoResult.value = {
      success: true,
      data: response.data
    }
  } catch (error) {
    userInfoResult.value = {
      success: false,
      error: {
        status: error.response?.status,
        message: error.userMessage || error.message,
        details: error.debug
      }
    }
  }
}
</script> 