<template>
  <div class="container mx-auto p-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner size="large" />
    </div>

    <!-- Category Detail -->
    <div v-else-if="category">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <button
            @click="$router.back()"
            class="mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ category.name }}</h1>
            <div v-if="category.parent" class="text-sm text-gray-600 mt-1">
              Danh mục cha: 
              <button
                @click="viewCategory(category.parent)"
                class="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {{ category.parent.name }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="category.description" class="text-gray-600 mb-6">
          {{ category.description }}
        </div>

        <!-- Category Image -->
        <div v-if="category.image" class="mb-8">
          <img
            :src="category.image"
            :alt="category.name"
            class="w-full h-64 object-cover rounded-lg"
          >
        </div>

        <!-- Subcategories -->
        <div v-if="category.children && category.children.length > 0" class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Danh mục con</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="child in category.children"
              :key="child.id"
              class="bg-white rounded-lg shadow-md p-4 cursor-pointer transition-transform hover:scale-105"
              @click="viewCategory(child)"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    v-if="child.image"
                    :src="child.image"
                    :alt="child.name"
                    class="w-full h-full object-cover"
                  >
                  <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span class="text-xs text-gray-500">N/A</span>
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">{{ child.name }}</h3>
                  <p v-if="child.description" class="text-sm text-gray-600">{{ child.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm sản phẩm</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Nhập tên sản phẩm..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="performSearch"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
            <select
              v-model="sortBy"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="performSearch"
            >
              <option value="name asc">Tên A-Z</option>
              <option value="name desc">Tên Z-A</option>
              <option value="price asc">Giá thấp đến cao</option>
              <option value="price desc">Giá cao đến thấp</option>
              <option value="created_at desc">Mới nhất</option>
            </select>
          </div>

          <!-- Search Button -->
          <div class="flex items-end">
            <button
              @click="performSearch"
              class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <!-- Price Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="minPrice"
                type="number"
                placeholder="Tối thiểu"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <span class="text-gray-500">-</span>
              <input
                v-model="maxPrice"
                type="number"
                placeholder="Tối đa"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Products Loading -->
      <div v-if="productsLoading" class="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ searchQuery ? 'Kết quả tìm kiếm' : 'Sản phẩm trong danh mục' }}
            <span class="text-lg text-gray-600 font-normal">({{ pagination.total }} sản phẩm)</span>
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            @click="viewProduct(product)"
          >
            <!-- Product Image -->
            <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="h-64 w-full object-cover object-center"
              >
              <div v-else class="h-64 w-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500">Không có hình ảnh</span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <!-- Product Name -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>
              
              <!-- Categories -->
              <div v-if="product.categories && product.categories.length > 0" class="mb-2">
                <span
                  v-for="category in product.categories.slice(0, 1)"
                  :key="category.id"
                  class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {{ category.name }}
                </span>
              </div>

              <!-- Price -->
              <div class="mb-3">
                <div class="flex items-baseline space-x-2">
                  <span v-if="product.sale_price" class="text-xl font-bold text-red-600">
                    {{ formatCurrency(product.sale_price) }}
                  </span>
                  <span
                    v-else
                    class="text-xl font-bold text-gray-900"
                  >
                    {{ formatCurrency(product.price) }}
                  </span>
                  <span v-if="product.sale_price" class="text-sm text-gray-500 line-through">
                    {{ formatCurrency(product.price) }}
                  </span>
                </div>
              </div>

              <!-- Stock Status -->
              <div class="flex items-center justify-between">
                <div class="text-sm">
                  <span
                    :class="{
                      'text-green-600 font-medium': product.stock_quantity > 10,
                      'text-yellow-600 font-medium': product.stock_quantity > 0 && product.stock_quantity <= 10,
                      'text-red-600 font-medium': product.stock_quantity === 0
                    }"
                  >
                    {{ getStockText(product.stock_quantity) }}
                  </span>
                </div>
                
                <!-- Featured Badge -->
                <span v-if="product.featured" class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Nổi bật
                </span>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="px-4 pb-4">
              <button
                @click.stop="quickAddToCart(product)"
                class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="product.stock_quantity === 0"
              >
                <span v-if="product.stock_quantity === 0">Hết hàng</span>
                <span v-else>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-12 flex justify-center">
          <Pagination
            :current-page="pagination.current_page"
            :total-pages="pagination.last_page"
            :total-items="pagination.total"
            :loading="productsLoading"
            @page-change="handlePageChange"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
        <p class="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!loading && !category" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy danh mục</h3>
      <p class="text-gray-600 mb-4">Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
      <button
        @click="$router.push('/home/categories')"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Quay lại danh sách danh mục
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalApiClient } from '@/composables/api'
import { useToast } from '@/composables/ui/useToast'
import { formatCurrency } from '@/utils/formatters'
import LoadingSpinner from '@/components/Core/Loading/LoadingSpinner.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const router = useRouter()
const { apiClient } = useGlobalApiClient()
const { showSuccess, showError } = useToast()

// State
const loading = ref(false)
const productsLoading = ref(false)
const category = ref(null)
const products = ref([])
const searchQuery = ref('')
const sortBy = ref('created_at desc')
const minPrice = ref('')
const maxPrice = ref('')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0
})

// Load category data
onMounted(async () => {
  await Promise.all([
    loadCategory(),
    loadProducts()
  ])
})

async function loadCategory() {
  loading.value = true
  try {
    const response = await apiClient.get(`/api/product-categories/${route.params.slug}`)
    if (response.data?.success) {
      category.value = response.data.data
    } else {
      category.value = null
    }
  } catch (error) {
    console.error('Error loading category:', error)
    category.value = null
  } finally {
    loading.value = false
  }
}

async function loadProducts(page = 1) {
  if (!category.value) return
  
  productsLoading.value = true
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: '20',
      sort_by: sortBy.value.split(' ')[0],
      sort_order: sortBy.value.split(' ')[1]
    })

    if (searchQuery.value) {
      params.append('q', searchQuery.value)
    }
    if (minPrice.value) {
      params.append('min_price', minPrice.value)
    }
    if (maxPrice.value) {
      params.append('max_price', maxPrice.value)
    }

    const response = await apiClient.get(`/api/products/by-category/${category.value.id}?${params}`)
    if (response.data?.success) {
      products.value = response.data.data || []
      pagination.value = response.data.meta || pagination.value
    } else {
      products.value = []
    }
  } catch (error) {
    console.error('Error loading products:', error)
    products.value = []
  } finally {
    productsLoading.value = false
  }
}

// Search and filter
function performSearch() {
  loadProducts(1)
}

function handlePageChange(page) {
  loadProducts(page)
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Navigation
function viewCategory(category) {
  router.push(`/home/categories/${category.slug}`)
}

function viewProduct(product) {
  router.push(`/home/products/${product.slug}`)
}

// Get stock text
function getStockText(stockQuantity) {
  if (stockQuantity === 0) {
    return 'Hết hàng'
  } else if (stockQuantity <= 10) {
    return `Chỉ còn ${stockQuantity} sản phẩm`
  } else {
    return 'Còn hàng'
  }
}

// Quick add to cart
async function quickAddToCart(product) {
  if (product.stock_quantity === 0) return
  
  try {
    // TODO: Implement cart API call
    const cartItem = {
      product_id: product.id,
      variant_id: null,
      quantity: 1,
      price: product.sale_price || product.price
    }
    
    console.log('Quick add to cart:', cartItem)
    
    showSuccess('Đã thêm sản phẩm vào giỏ hàng')
  } catch (error) {
    showError('Không thể thêm sản phẩm vào giỏ hàng')
  }
}
</script>