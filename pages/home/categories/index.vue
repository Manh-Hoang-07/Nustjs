<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Danh mục sản phẩm</h1>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">Khám phá các danh mục sản phẩm đa dạng của chúng tôi</p>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
          @click="viewCategory(category)"
        >
          <div class="relative aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              class="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
            >
            <div v-else class="h-48 w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div class="text-center">
                <svg class="w-16 h-16 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span class="text-blue-500">Không có hình ảnh</span>
              </div>
            </div>
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{{ category.name }}</h3>
            <p v-if="category.description" class="text-gray-600 text-sm mb-4 line-clamp-2">{{ category.description }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                <span class="text-sm font-medium">Xem sản phẩm</span>
                <svg class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Không có danh mục nào</h3>
        <p class="text-gray-600">Hiện tại chưa có danh mục sản phẩm nào</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalApiClient } from '@/composables/api'
import LoadingSpinner from '@/components/Core/Loading/LoadingSpinner.vue'

definePageMeta({
  layout: 'home'
})

const router = useRouter()
const { apiClient } = useGlobalApiClient()

// State
const loading = ref(false)
const categories = ref([])

// Load categories
onMounted(async () => {
  await loadCategories()
})

async function loadCategories() {
  loading.value = true
  try {
    const response = await apiClient.get('/api/product-categories')
    if (response.data?.success) {
      categories.value = response.data.data || []
    } else {
      categories.value = []
    }
  } catch (error) {
    console.error('Error loading categories:', error)
    categories.value = []
  } finally {
    loading.value = false
  }
}

// Flatten category tree for display
function flattenCategories(categories, level = 0) {
  const result = []
  
  for (const category of categories) {
    result.push({
      ...category,
      level
    })
    
    if (category.children && category.children.length > 0) {
      result.push(...flattenCategories(category.children, level + 1))
    }
  }
  
  return result
}

// View category details
function viewCategory(category) {
  router.push(`/home/categories/${category.slug}`)
}
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

/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>

