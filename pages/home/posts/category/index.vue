<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ categoryName }}</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá những bài viết mới nhất trong danh mục {{ categoryName.toLowerCase() }}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-8">
          <!-- Search and Filters -->
          <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Tìm kiếm bài viết..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <select 
                v-model="sortBy"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="popular">Phổ biến</option>
              </select>
            </div>
          </div>

          <!-- Posts Grid -->
          <div v-if="loading" class="space-y-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm p-6">
              <div class="animate-pulse">
                <div class="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy bài viết</h3>
            <p class="mt-1 text-sm text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>

          <div v-else class="space-y-6">
            <article 
              v-for="post in filteredPosts" 
              :key="post.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div class="lg:flex">
                <div class="lg:flex-shrink-0">
                  <img 
                    :src="post.featured_image || '/placeholder.jpg'" 
                    :alt="post.title"
                    class="h-48 w-full lg:w-80 object-cover"
                  >
                </div>
                <div class="p-6 lg:flex-1">
                  <div class="flex items-center text-sm text-gray-500 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                      {{ categoryName }}
                    </span>
                    <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                    <span class="mx-2">•</span>
                    <span>{{ post.read_time || '5 phút đọc' }}</span>
                  </div>
                  
                  <h2 class="text-xl font-semibold text-gray-900 mb-3">
                    <NuxtLink 
                      :to="`/posts/${post.slug || post.id}`"
                      class="hover:text-blue-600 transition-colors"
                    >
                      {{ post.title }}
                    </NuxtLink>
                  </h2>
                  
                  <p class="text-gray-600 mb-4 line-clamp-3">{{ post.excerpt }}</p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img 
                        :src="post.author?.avatar || '/avatar-placeholder.jpg'" 
                        :alt="post.author?.name"
                        class="h-8 w-8 rounded-full mr-3"
                      >
                      <span class="text-sm text-gray-700">{{ post.author?.name || 'Admin' }}</span>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        {{ post.views || 0 }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                        {{ post.likes || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8">
            <Pagination 
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 mt-8 lg:mt-0">
          <!-- Categories -->
          <div class="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-800">Danh mục</h3>
            </div>
            <div class="space-y-2">
              <NuxtLink 
                v-for="(category, index) in categories" 
                :key="category.id"
                :to="`/posts/category/${category.slug || category.id}`"
                class="group flex items-center p-3 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105"
                :class="currentCategoryId === category.id 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-100'"
              >
                <div class="flex items-center">
                  <div 
                    class="w-2 h-2 rounded-full mr-3 transition-all duration-300"
                    :class="currentCategoryId === category.id 
                      ? 'bg-white' 
                      : getCategoryColor(index)"
                  ></div>
                  <span class="font-medium">{{ category.name }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Popular Tags -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Tags phổ biến</h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink 
                v-for="tag in popularTags" 
                :key="tag.id"
                :to="`/posts/tag/${tag.slug || tag.id}`"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                {{ tag.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Recent Posts -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Bài viết gần đây</h3>
            <div class="space-y-4">
              <article 
                v-for="post in recentPosts" 
                :key="post.id"
                class="flex space-x-3"
              >
                <img 
                  :src="post.featured_image || '/placeholder.jpg'" 
                  :alt="post.title"
                  class="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                >
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 line-clamp-2">
                    <NuxtLink 
                      :to="`/posts/${post.slug || post.id}`"
                      class="hover:text-blue-600 transition-colors"
                    >
                      {{ post.title }}
                    </NuxtLink>
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(post.created_at) }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts } from '../../../composables/usePosts.js'
import Pagination from '../../../components/Core/Navigation/Pagination.vue'

const route = useRoute()
const { 
  posts, 
  categories, 
  tags, 
  loading, 
  error,
  fetchPublicPosts, 
  fetchCategories, 
  fetchTags 
} = usePosts()

// State
const searchQuery = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const totalPages = ref(1)

// Computed
const currentCategoryId = computed(() => route.params.slug)
const categoryName = computed(() => {
  const category = categories.value.find(c => c.slug === currentCategoryId.value || c.id === currentCategoryId.value)
  return category?.name || 'Danh mục'
})

const filteredPosts = computed(() => {
  let filtered = posts.value.filter(post => 
    post.category_id === currentCategoryId.value || 
    post.category?.slug === currentCategoryId.value
  )
  
  if (searchQuery.value) {
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Sort posts
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'popular':
        return (b.views || 0) - (a.views || 0)
      default: // latest
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })
  
  return filtered
})

const popularTags = computed(() => {
  return tags.value.slice(0, 10) // Show top 10 tags
})

const recentPosts = computed(() => {
  return posts.value.slice(0, 5) // Show 5 recent posts
})

// Methods
const loadPosts = async () => {
  try {
    await fetchPublicPosts({ 
      page: currentPage.value,
      category: currentCategoryId.value,
      search: searchQuery.value,
      sort: sortBy.value
    })
  } catch (err) {
    console.error('Error loading posts:', err)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadPosts()
}

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString))
}

// Watchers
watch([searchQuery, sortBy], () => {
  currentPage.value = 1
  loadPosts()
})

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchTags(),
    loadPosts()
  ])
})

// Màu sắc cho categories
const getCategoryColor = (index) => {
  const colors = [
    'bg-gradient-to-r from-blue-400 to-blue-500',
    'bg-gradient-to-r from-green-400 to-green-500', 
    'bg-gradient-to-r from-purple-400 to-purple-500',
    'bg-gradient-to-r from-pink-400 to-pink-500',
    'bg-gradient-to-r from-indigo-400 to-indigo-500',
    'bg-gradient-to-r from-yellow-400 to-yellow-500',
    'bg-gradient-to-r from-red-400 to-red-500',
    'bg-gradient-to-r from-teal-400 to-teal-500'
  ]
  return colors[index % colors.length]
}

// Page meta
definePageMeta({
  layout: 'home'
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
