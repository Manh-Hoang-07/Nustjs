<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Test Trang Posts</h1>
        <p class="text-gray-600">Kiểm tra trang posts với API thực tế</p>
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
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-purple-400"></div>
            <span class="text-sm font-medium">{{ categories.length }} categories</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
            <span class="text-sm font-medium">{{ tags.length }} tags</span>
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

    <!-- Posts List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm p-6">
          <div class="animate-pulse">
            <div class="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <div v-else-if="posts.length > 0" class="space-y-6">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div class="lg:flex">
            <div class="lg:flex-shrink-0">
              <img 
                :src="post.image || '/placeholder.jpg'" 
                :alt="post.name"
                class="h-48 w-full lg:w-80 object-cover"
              >
            </div>
            <div class="p-6 lg:flex-1">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <span v-if="post.categories && post.categories.length > 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                  {{ post.categories[0].name }}
                </span>
                <time :datetime="post.published_at || post.created_at">{{ formatDate(post.published_at || post.created_at) }}</time>
                <span class="mx-2">•</span>
                <span>5 phút đọc</span>
              </div>
              
              <h2 class="text-xl font-semibold text-gray-900 mb-3">
                {{ post.name }}
              </h2>
              
              <p class="text-gray-600 mb-4 line-clamp-3">{{ formatExcerpt(post.excerpt || post.content) }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span class="text-xs font-medium text-gray-600">A</span>
                  </div>
                  <span class="text-sm text-gray-700">Admin</span>
                </div>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {{ post.view_count || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Không có bài viết nào</h3>
        <p class="mt-1 text-sm text-gray-500">Hãy thử test API hoặc sử dụng mock data.</p>
      </div>
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
            <p><strong>Categories Count:</strong> {{ categories.length }}</p>
            <p><strong>Tags Count:</strong> {{ tags.length }}</p>
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
  title: 'Test Posts - E-Commerce Platform'
})

// Sử dụng composables
const { 
  posts,
  loading,
  error,
  fetchPosts,
  formatDate,
  formatExcerpt
} = useApiPosts()

const { testWithMockData } = useTestApi()

// Mock data cho categories và tags
const categories = ref([])
const tags = ref([])

// Test functions
const testApi = async () => {
  try {
    console.log('🚀 Testing API from posts page...')
    const result = await fetchPosts({ limit: 10 })
    console.log('✅ API test successful from posts page')
    
    // Extract categories and tags from posts
    extractCategoriesAndTags()
  } catch (error) {
    console.error('❌ API test failed from posts page:', error)
  }
}

const useMockData = () => {
  console.log('🧪 Using mock data from posts page...')
  const mockData = testWithMockData()
  
  if (mockData && mockData.data) {
    posts.value = mockData.data.map(post => ({
      ...post,
      formattedDate: formatDate(post.published_at || post.created_at),
      formattedExcerpt: formatExcerpt(post.excerpt || post.content)
    }))
    console.log('✅ Mock data applied to posts page')
    
    // Extract categories and tags from posts
    extractCategoriesAndTags()
  }
}

const clearData = () => {
  posts.value = []
  categories.value = []
  tags.value = []
  console.log('🗑️ Data cleared from posts page')
}

const extractCategoriesAndTags = () => {
  const mockCategories = []
  const mockTags = []
  
  posts.value.forEach(post => {
    // Extract categories
    if (post.categories && post.categories.length > 0) {
      post.categories.forEach(cat => {
        if (!mockCategories.find(c => c.id === cat.id)) {
          mockCategories.push({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            post_count: 1
          })
        }
      })
    }
    
    // Extract tags
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => {
        if (!mockTags.find(t => t.id === tag.id)) {
          mockTags.push({
            id: tag.id,
            name: tag.name,
            slug: tag.slug
          })
        }
      })
    }
  })
  
  categories.value = mockCategories
  tags.value = mockTags
  
  console.log('✅ Categories and tags extracted:', {
    categories: categories.value.length,
    tags: tags.value.length
  })
}

// Auto test khi component mount
onMounted(() => {
  console.log('🎯 Posts test page mounted, testing API...')
  testApi()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
