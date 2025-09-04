<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Tin tức mới nhất</h2>
        <p class="text-xl text-gray-600">Cập nhật những thông tin mới nhất về công nghệ và xu hướng</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="grid md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-6">
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-6 bg-gray-300 rounded mb-4"></div>
            <div class="h-4 bg-gray-300 rounded mb-4"></div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-300 rounded w-20"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- News Grid -->
      <div v-else-if="posts.length > 0" class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(post, index) in posts" 
          :key="post.id"
          class="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200"
        >
          <!-- Post Image -->
          <div class="h-48 relative overflow-hidden">
            <img 
              v-if="post.image" 
              :src="post.image" 
              :alt="post.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            >
            <div 
              v-else
              :class="`h-full bg-gradient-to-br ${getCardGradient(index)} flex items-center justify-center`"
            >
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Post Content -->
          <div class="p-6">
            <!-- Date -->
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ formatDate(post.published_at || post.created_at) }}
            </div>
            
            <!-- Title -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ post.name }}
            </h3>
            
            <!-- Excerpt -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ formatExcerpt(post.excerpt || post.content) }}
            </p>
            
            <!-- Categories -->
            <div v-if="post.categories && post.categories.length > 0" class="mb-3">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="category in post.categories.slice(0, 2)" 
                  :key="category.id"
                  class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {{ category.name }}
                </span>
              </div>
            </div>
            
            <!-- Tags -->
            <div v-if="post.tags && post.tags.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in post.tags.slice(0, 3)" 
                  :key="tag.id"
                  class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  #{{ tag.name }}
                </span>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 font-medium">
                {{ post.view_count || 0 }} lượt xem
              </span>
              <NuxtLink 
                :to="`/home/posts/${post.slug}`" 
                :class="`${getTextColor(index)} text-sm font-medium transition-colors`"
              >
                Đọc thêm →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có tin tức nào</h3>
        <p class="text-gray-600">Hiện tại chưa có tin tức nào được đăng tải.</p>
      </div>
      
      <!-- View All News Button -->
      <div v-if="posts.length > 0" class="text-center mt-8">
        <NuxtLink to="/home/posts" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
          Xem tất cả tin tức
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useApiPosts } from '../composables/useApiPosts.js'

// Props
const props = defineProps({
  limit: {
    type: Number,
    default: 3
  }
})

// Sử dụng API posts composable
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

// Fetch latest posts khi component mount
onMounted(async () => {
  await fetchLatestPosts(props.limit)
})
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
