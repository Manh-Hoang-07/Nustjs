<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Danh mục: {{ categoryName }}</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Tất cả bài viết trong danh mục {{ categoryName }}
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

          <div v-else-if="posts.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy bài viết</h3>
            <p class="mt-1 text-sm text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>

          <div v-else class="space-y-6">
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
                    <NuxtLink 
                      :to="`/home/posts/${post.slug || post.id}`"
                      class="hover:text-blue-600 transition-colors"
                    >
                      {{ post.name }}
                    </NuxtLink>
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

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8">
            <Pagination 
              :current-page="currentPage"
              :total-pages="totalPages"
              :total-items="totalRecords"
              @page-change="handlePageChange"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 mt-8 lg:mt-0">
          <!-- Categories -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
            <div class="space-y-2">
              <NuxtLink 
                v-for="category in categories" 
                :key="category.id"
                :to="`/home/posts/category/${category.slug || category.id}`"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50 text-blue-700': selectedCategory === category.id }"
              >
                <span>{{ category.name }}</span>
                <span class="text-sm text-gray-500">{{ category.post_count || 0 }}</span>
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
                :to="`/home/posts/tag/${tag.slug || tag.id}`"
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
                  :src="post.image || '/placeholder.jpg'" 
                  :alt="post.name"
                  class="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                >
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 line-clamp-2">
                    <NuxtLink 
                      :to="`/home/posts/${post.slug || post.id}`"
                      class="hover:text-blue-600 transition-colors"
                    >
                      {{ post.name }}
                    </NuxtLink>
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(post.published_at || post.created_at) }}</p>
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
import { useApiPosts } from '../../../composables/useApiPosts.js'
import { useTestApi } from '../../../composables/useTestApi.js'
import Pagination from '../../../components/Core/Navigation/Pagination.vue'

// Page meta
definePageMeta({
  layout: 'home',
  title: 'Danh mục - E-Commerce Platform'
})

// Route params
const route = useRoute()
const categorySlug = route.params.slug

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

// State
const searchQuery = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const totalPages = ref(1)
const totalRecords = ref(0)
const selectedCategory = ref('')

// Computed
const categoryName = computed(() => {
  const category = categories.value.find(c => c.slug === categorySlug || c.id == categorySlug)
  return category?.name || 'Danh mục'
})

const popularTags = computed(() => {
  return tags.value.slice(0, 10)
})

const recentPosts = computed(() => {
  return posts.value.slice(0, 5)
})

// Methods
const loadPosts = async () => {
  try {
    console.log('🔄 Loading posts for category:', categorySlug)
    
    const result = await fetchPosts({ 
      page: currentPage.value,
      limit: 10,
      category: selectedCategory.value,
      search: searchQuery.value,
      sort: sortBy.value
    })
    
    if (result.meta) {
      totalPages.value = result.meta.last_page || 1
      totalRecords.value = result.meta.total || 0
    }
    
    console.log('✅ Posts loaded for category:', posts.value.length, 'posts')
  } catch (err) {
    console.error('❌ Error loading posts for category:', err)
    
    // Fallback với mock data
    const mockData = testWithMockData()
    
    if (mockData && mockData.data) {
      let filteredData = mockData.data
      
      // Filter by category
      if (selectedCategory.value) {
        filteredData = filteredData.filter(post => 
          post.categories && post.categories.some(cat => cat.id == selectedCategory.value)
        )
      }
      
      // Apply search
      if (searchQuery.value) {
        filteredData = filteredData.filter(post => 
          post.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
      }
      
      // Sort
      filteredData = [...filteredData].sort((a, b) => {
        switch (sortBy.value) {
          case 'oldest':
            return new Date(a.published_at || a.created_at) - new Date(b.published_at || b.created_at)
          case 'popular':
            return (b.view_count || 0) - (a.view_count || 0)
          default:
            return new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at)
        }
      })
      
      posts.value = filteredData.map(post => ({
        ...post,
        formattedDate: formatDate(post.published_at || post.created_at),
        formattedExcerpt: formatExcerpt(post.excerpt || post.content)
      }))
    }
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadPosts()
}

// formatDate và formatExcerpt đã được import từ useApiPosts composable

// Watchers
watch([searchQuery, sortBy], () => {
  currentPage.value = 1
  loadPosts()
}, { deep: true })

onMounted(async () => {
  console.log('🎯 Category page mounted:', categorySlug)
  
  // Tìm category ID từ slug
  const mockData = testWithMockData()
  if (mockData && mockData.data) {
    // Extract categories
    const mockCategories = []
    mockData.data.forEach(post => {
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
    })
    categories.value = mockCategories
    
    // Tìm category ID từ slug
    const category = categories.value.find(c => c.slug === categorySlug || c.id == categorySlug)
    if (category) {
      selectedCategory.value = category.id
    }
  }
  
  await loadPosts()
})
</script>

<style scoped>
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