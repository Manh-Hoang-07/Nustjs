<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Danh mục sản phẩm</h1>
      <p class="text-gray-600">Khám phá các danh mục sản phẩm của chúng tôi</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner size="large" />
    </div>

    <!-- Categories Grid -->
    <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
        @click="viewCategory(category)"
      >
        <div class="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-100">
          <img
            v-if="category.image"
            :src="category.image"
            :alt="category.name"
            class="h-48 w-full object-cover"
          >
          <div v-else class="h-48 w-full bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">Không có hình ảnh</span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
          <p v-if="category.description" class="text-gray-600 text-sm mb-4">{{ category.description }}</p>
          <div class="flex items-center text-blue-600 hover:text-blue-800">
            <span class="text-sm font-medium">Xem sản phẩm</span>
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không có danh mục nào</h3>
      <p class="text-gray-600">Hiện tại chưa có danh mục sản phẩm nào</p>
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
