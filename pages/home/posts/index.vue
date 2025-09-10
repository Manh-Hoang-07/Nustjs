<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog & Tin tức</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá những bài viết mới nhất về công nghệ, phát triển web và những xu hướng mới trong ngành
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
                  @input="debouncedFilterChange"
                  type="text" 
                  placeholder="Tìm kiếm bài viết..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <select 
                v-model="selectedCategory"
                @change="handleFilterChange"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <select 
                v-model="sortBy"
                @change="handleFilterChange"
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
                    :src="post.image || '/default.svg'" 
                    :alt="post.name"
                    class="h-48 w-full lg:w-80 object-cover"
                    @error="handleImageError"
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
                  
                  <p class="text-gray-600 mb-4 line-clamp-3">{{ formatExcerpt(post.excerpt || post.description || post.content) }}</p>
                  
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
          <Pagination 
            :current-page="pagination.current_page"
            :total-pages="pagination.last_page"
            :total-items="pagination.total"
            :loading="loading"
            @page-change="handlePageChange"
          />
          
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
                :to="`/home/posts/category/${category.slug || category.id}`"
                class="group flex items-center p-3 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105"
                :class="selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-100'"
              >
                <div class="flex items-center">
                  <div 
                    class="w-2 h-2 rounded-full mr-3 transition-all duration-300"
                    :class="selectedCategory === category.id 
                      ? 'bg-white' 
                      : getCategoryColor(index)"
                  ></div>
                  <span class="font-medium">{{ category.name }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Popular Tags -->
          <div class="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-800">Tags phổ biến</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <NuxtLink 
                v-for="(tag, index) in popularTags" 
                :key="tag.id"
                :to="`/home/posts/tag/${tag.slug || tag.id}`"
                class="group inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                :class="getTagColor(index)"
              >
                <span class="mr-1">#</span>
                {{ tag.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useApiClient } from '../../composables/api/useApiClient.js'
import { useDataTable } from '../../composables/data/useDataTable.js'
import Pagination from '../../components/Core/Navigation/Pagination.vue'
import { debounce } from '../../utils/optimization.js'
import { formatDate } from '../../utils/formatters.js'

// Hàm format excerpt đơn giản
const formatExcerpt = (text, maxLength = 150) => {
  if (!text) return ''
  const cleanText = text.replace(/<[^>]*>/g, '') // Remove HTML tags
  return cleanText.length > maxLength 
    ? cleanText.substring(0, maxLength) + '...'
    : cleanText
}

// Sử dụng API client có sẵn
const apiClient = useApiClient()

// Sử dụng useDataTable cho posts
const {
  items: posts,
  loading,
  error,
  pagination,
  fetchData: fetchPosts,
  updateFilters,
  changePage
} = useDataTable('/api/posts', {
  defaultFilters: {
    search: '',
    category_id: '',
    sort: 'latest'
  },
  pageSize: 10
})

// State cho categories và tags
const categories = ref([])
const tags = ref([])

// Search và filters
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')

// Hàm fetch categories
const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/api/post-categories')
    categories.value = response.data.data || response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Hàm fetch tags
const fetchTags = async () => {
  try {
    const response = await apiClient.get('/api/post-tags')
    tags.value = response.data.data || response.data
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}

// Hàm load data với filters
const loadData = async (params = {}) => {
  const filters = {
    search: searchQuery.value,
    category_id: selectedCategory.value,
    sort: sortBy.value,
    ...params
  }
  
  updateFilters(filters)
}

// Computed
const popularTags = computed(() => {
  return tags.value.slice(0, 10) // Show top 10 tags
})

const recentPosts = computed(() => {
  return posts.value.slice(0, 5) // Show 5 recent posts
})

// Handle filter changes - gọi API khi user thay đổi filter
const handleFilterChange = () => {
  loadData()
}

// Debounced version cho search input
const debouncedFilterChange = debounce(handleFilterChange, 500)

// Handle page change
const handlePageChange = (page) => {
  changePage(page)
}

onMounted(async () => {
  // Load categories và tags trước
  await Promise.all([
    fetchCategories(),
    fetchTags()
  ])
  
  // Load posts với filters hiện tại
  await fetchPosts()
})

// Xử lý lỗi ảnh
const handleImageError = (event) => {
  event.target.src = '/default.svg'
}

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

// Màu sắc cho tags
const getTagColor = (index) => {
  const colors = [
    'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300',
    'bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300',
    'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300',
    'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 hover:from-pink-200 hover:to-pink-300',
    'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 hover:from-indigo-200 hover:to-indigo-300',
    'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300',
    'bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300',
    'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 hover:from-teal-200 hover:to-teal-300',
    'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300',
    'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 hover:from-cyan-200 hover:to-cyan-300'
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