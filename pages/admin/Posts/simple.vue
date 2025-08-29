<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Simple Posts Test</h1>
        <p class="text-gray-600 mt-2">Test page đơn giản để kiểm tra useCrudAdmin</p>
      </div>
    </div>

    <!-- Test Content -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Test Results:</h2>
      
      <div class="space-y-4">
        <div>
          <strong>Loading:</strong> {{ loading }}
        </div>
        
        <div>
          <strong>Posts Count:</strong> {{ posts ? posts.length : 'posts is null' }}
        </div>
        
        <div>
          <strong>API Errors:</strong> {{ apiErrors ? Object.keys(apiErrors).length : 'apiErrors is null' }}
        </div>
      </div>
      
      <button 
        @click="testFetch"
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Test Fetch
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout'
})

import { ref, onMounted } from 'vue'
import useCrudAdmin from '../../composables/data/useCrudAdmin.js'

const { 
  items: posts, 
  loading, 
  apiErrors,
  fetchItems: fetchAdminPosts
} = useCrudAdmin({
  endpoints: {
    list: '/api/admin/posts',
    create: '/api/admin/posts',
    update: '/api/admin/posts',
    delete: '/api/admin/posts'
  },
  resourceName: 'bài viết'
})

const testFetch = async () => {
  try {
    console.log('Testing fetch...')
    await fetchAdminPosts()
    console.log('Fetch completed')
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

onMounted(() => {
  console.log('Simple test page mounted')
  console.log('Posts:', posts)
  console.log('Loading:', loading)
})
</script>
