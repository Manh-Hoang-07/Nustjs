import { useApiClient } from '../composables/api/useApiClient.js'

export async function testApiEndpoints() {
  const apiClient = useApiClient()
  
  console.log('🔍 Testing API endpoints...')
  
  const endpoints = [
    { method: 'GET', url: '/api/me', name: 'Get User Info' },
    { method: 'POST', url: '/api/login', name: 'Login', data: { email: 'test@example.com', password: 'password' } },
    { method: 'POST', url: '/api/register', name: 'Register', data: { name: 'Test User', email: 'test@example.com', password: 'password' } },
    { method: 'POST', url: '/api/logout', name: 'Logout' }
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing: ${endpoint.name}`)
      console.log(`URL: ${endpoint.method} ${endpoint.url}`)
      
      let response
      if (endpoint.method === 'GET') {
        response = await apiClient.get(endpoint.url)
      } else if (endpoint.method === 'POST') {
        response = await apiClient.post(endpoint.url, endpoint.data || {})
      }
      
      console.log(`✅ Success: ${response.status}`)
      console.log('Response:', response.data)
      
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || 'Network Error'}`)
      console.log('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
    }
  }
}

// Test server connectivity
export async function testServerConnectivity() {
  const apiClient = useApiClient()
  
  try {
    console.log('🌐 Testing server connectivity...')
    
    // Test basic connectivity
    const response = await apiClient.get('/')
    console.log('✅ Server is reachable')
    console.log('Response:', response.data)
    
  } catch (error) {
    console.log('❌ Server connectivity failed')
    console.log('Error:', error.message)
    
    if (error.code === 'ECONNABORTED') {
      console.log('💡 Tip: Check if server is running on http://127.0.0.1:8000')
    } else if (!error.response) {
      console.log('💡 Tip: Check network connection and server URL')
    }
  }
} 