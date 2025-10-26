<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner size="large" />
    </div>

    <!-- Category Detail -->
    <div v-else-if="category">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0">
          <div class="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center">
            <button
              @click="$router.back()"
              class="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
            <div class="flex items-center justify-center gap-3 mb-4">
              <i v-if="category.icon" :class="category.icon + ' text-3xl md:text-4xl'"></i>
              <h1 class="text-4xl md:text-5xl font-bold">{{ category.name }}</h1>
              <span
                class="px-3 py-1 text-xs font-semibold rounded-full border"
                :class="category.status === 'active'
                  ? 'bg-green-500/20 text-green-100 border-green-400/40'
                  : 'bg-gray-500/20 text-gray-100 border-gray-400/40'"
              >
                {{ category.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động' }}
              </span>
            </div>
            <div v-if="category.parent" class="text-blue-100 mb-4">
              Danh mục cha:
              <button
                @click="viewCategory(category.parent)"
                class="text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
              >
                {{ category.parent.name }}
              </button>
            </div>
            <p v-if="category.description" class="text-xl text-blue-100 max-w-2xl mx-auto">
              {{ category.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Category Image -->
      <div v-if="category.image" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="rounded-xl overflow-hidden shadow-lg">
          <img
            :src="resolveImage(category.image)"
            :alt="category.name"
            class="w-full h-64 md:h-96 object-cover"
          >
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Subcategories -->
        <div v-if="category.children && category.children.length > 0" class="mb-12">
          <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Danh mục con</h2>
            <div class="h-1 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 ml-4 rounded-full"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="child in category.children"
              :key="child.id"
              class="group bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
              @click="viewCategory(child)"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img
                    v-if="child.image"
                    :src="child.image"
                    :alt="child.name"
                    class="w-full h-full object-cover"
                  >
                  <div v-else class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">{{ child.name }}</h3>
                  <p v-if="child.description" class="text-sm text-gray-600 mt-1 line-clamp-2">{{ child.description }}</p>
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

        <div v-if="!category.children || category.children.length === 0" class="mb-12">
          <div class="flex items-center mb-2">
            <h2 class="text-2xl font-bold text-gray-900">Danh mục con</h2>
            <div class="h-1 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 ml-4 rounded-full"></div>
          </div>
          <div class="text-gray-600">Danh mục này chưa có danh mục con.</div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm sản phẩm</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                class="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
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
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <span class="text-gray-500">-</span>
                <input
                  v-model="maxPrice"
                  type="number"
                  placeholder="Tối đa"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div class="h-1 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 ml-4 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
            @click="viewProduct(product)"
          >
            <!-- Product Image -->
            <div class="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="h-64 w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              >
              <div v-else class="h-64 w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span class="text-blue-500">Không có hình ảnh</span>
              </div>
              <!-- Featured Badge -->
              <div v-if="product.featured" class="absolute top-3 right-3">
                <span class="px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full shadow-lg">
                  Nổi bật
                </span>
              </div>
              <!-- Overlay gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <!-- Product Name -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ product.name }}</h3>
              
              <!-- Categories -->
              <div v-if="product.categories && product.categories.length > 0" class="mb-2">
                <span
                  v-for="category in product.categories.slice(0, 1)"
                  :key="category.id"
                  class="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full"
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
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="px-4 pb-4">
              <button
                @click.stop="quickAddToCart(product)"
                class="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
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
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
        <p class="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!loading && !category" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy danh mục</h3>
        <p class="text-gray-600 mb-6">Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
        <button
          @click="$router.push('/home/categories')"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          Quay lại danh sách danh mục
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalApiClient } from '@/composables/api'
import { publicEndpoints } from '@/api/endpoints'
import { useToast } from '@/composables/ui/useToast'
import { formatCurrency } from '@/utils/formatters'
import { useCart } from '~/composables/cart/index'
import LoadingSpinner from '@/components/Core/Loading/LoadingSpinner.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const router = useRouter()
const { apiClient } = useGlobalApiClient()
const { showSuccess, showError } = useToast()
const cart = useCart({ immediate: true })

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

// React when route slug changes (navigate between categories without full reload)
watch(() => route.params.slug, async (newSlug, oldSlug) => {
  if (newSlug === oldSlug) return
  // Reset state for new category
  products.value = []
  category.value = null
  pagination.value = {
    ...pagination.value,
    current_page: 1,
    total: 0
  }
  await loadCategory()
  await loadProducts(1)
  // Scroll to top for better UX
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

async function loadCategory() {
  loading.value = true
  try {
    const url = publicEndpoints.productCategories.showBySlug(String(route.params.slug)) + '?relations=parent,children'
    const response = await apiClient.get(url)
    const payload = response.data?.data ?? response.data
    category.value = payload || null
  } catch (error) {
    console.error('Error loading category:', error)
    category.value = null
  } finally {
    loading.value = false
  }
}

async function loadProducts(page = 1) {
  const slug = String(route.params.slug || '')
  if (!slug) return

  productsLoading.value = true
  try {
    const params = new URLSearchParams({ page: String(page), per_page: '20' })
    const sortParts = String(sortBy.value || '').split(' ')
    if (sortParts[0]) params.set('sort_by', sortParts[0])
    if (sortParts[1]) params.set('sort_order', sortParts[1])
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (minPrice.value) params.append('min_price', String(minPrice.value))
    if (maxPrice.value) params.append('max_price', String(maxPrice.value))

    const url = `${publicEndpoints.productCategories.productsBySlug(slug)}?${params.toString()}`
    const response = await apiClient.get(url)
    const payload = response.data

    function firstArrayDeep(obj, depth = 0) {
      if (Array.isArray(obj)) return obj
      if (!obj || typeof obj !== 'object' || depth > 3) return null
      const keys = ['data', 'items', 'products', 'rows', 'list', 'results']
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i]
        if (Array.isArray(obj[k])) return obj[k]
      }
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
        var val = obj[key]
        var found = firstArrayDeep(val, depth + 1)
        if (Array.isArray(found)) return found
      }
      return null
    }

    function findMetaDeep(obj, depth = 0) {
      if (!obj || typeof obj !== 'object' || depth > 3) return null
      if (obj.meta) return obj.meta
      if (obj.data && obj.data.meta) return obj.data.meta
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
        var val = obj[key]
        var m = findMetaDeep(val, depth + 1)
        if (m) return m
      }
      return null
    }

    function findLinksDeep(obj, depth = 0) {
      if (!obj || typeof obj !== 'object' || depth > 3) return null
      if (Array.isArray(obj.links)) return obj.links
      if (obj.data && Array.isArray(obj.data.links)) return obj.data.links
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
        var val = obj[key]
        var l = findLinksDeep(val, depth + 1)
        if (Array.isArray(l)) return l
      }
      return null
    }

    var list = firstArrayDeep(payload) || []
    products.value = list

    var meta = findMetaDeep(payload)
    if (meta) {
      pagination.value.current_page = Number(meta.current_page != null ? meta.current_page : (meta.currentPage != null ? meta.currentPage : page))
      pagination.value.last_page = Number(meta.last_page != null ? meta.last_page : (meta.lastPage != null ? meta.lastPage : 1))
      pagination.value.per_page = Number(meta.per_page != null ? meta.per_page : (meta.perPage != null ? meta.perPage : 20))
      pagination.value.total = Number(meta.total != null ? meta.total : list.length)
    } else {
      var links = findLinksDeep(payload) || []
      if (Array.isArray(links) && links.length > 0) {
        var currentLink = links.find(function(l){ return l && l.active; })
        if (currentLink && currentLink.label != null) {
          var cp2 = parseInt(String(currentLink.label), 10)
          if (!Number.isNaN(cp2)) pagination.value.current_page = cp2
        }
        var numericLinks = links.filter(function(l){
          return l && (typeof l.label === 'string' ? /^\d+$/.test(l.label) : typeof l.label === 'number')
        })
        if (numericLinks.length > 0) {
          var maxLabel = Math.max.apply(null, numericLinks.map(function(l){ return Number(l.label); }))
          if (Number.isFinite(maxLabel)) pagination.value.last_page = maxLabel
        }
      }
      pagination.value.total = list.length
    }
  } catch (error) {
    console.error('Error loading products:', error)
    products.value = []
    pagination.value.total = 0
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

// Helpers
function resolveImage(path) {
  if (!path) return '';
  if (typeof path !== 'string') return '';
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith('/') ? path : '/' + path;
}

// Quick add to cart
async function quickAddToCart(product) {
  if (product.stock_quantity === 0) return
  
  try {
    const cartItem = {
      product_id: product.id,
      variant_id: null,
      quantity: 1,
      price: Number(product.sale_price || product.price)
    }
    
    await cart.addToCart(cartItem)
  } catch (error) {
    showError('Không thể thêm sản phẩm vào giỏ hàng')
  }
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