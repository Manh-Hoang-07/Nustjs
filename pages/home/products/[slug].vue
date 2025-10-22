<template>
  <div class="container mx-auto p-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner size="large" />
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <!-- Product Images -->
      <div>
        <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            :alt="product.name"
            class="h-full w-full object-cover object-center"
          >
          <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">Không có hình ảnh</span>
          </div>
        </div>
        
        <!-- Image Gallery -->
        <div v-if="product.images && product.images.length > 0" class="mt-4 grid grid-cols-4 gap-2">
          <div
            v-for="(image, index) in product.images"
            :key="index"
            class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
            :class="{ 'ring-2 ring-blue-500': selectedImage === image }"
            @click="selectedImage = image"
          >
            <img
              :src="image"
              :alt="`${product.name} - ${index + 1}`"
              class="h-full w-full object-cover object-center"
            >
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <div class="mb-4">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
          <p class="text-gray-600">SKU: {{ product.sku }}</p>
        </div>

        <!-- Price -->
        <div class="mb-6">
          <div class="flex items-baseline space-x-2">
            <span v-if="product.sale_price" class="text-3xl font-bold text-red-600">
              {{ formatCurrency(product.sale_price) }}
            </span>
            <span 
              v-else
              class="text-3xl font-bold text-gray-900"
            >
              {{ formatCurrency(product.price) }}
            </span>
            <span v-if="product.sale_price" class="text-lg text-gray-500 line-through">
              {{ formatCurrency(product.price) }}
            </span>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            Tồn kho: 
            <span :class="{
              'text-green-600 font-medium': product.stock_quantity > 10,
              'text-yellow-600 font-medium': product.stock_quantity > 0 && product.stock_quantity <= 10,
              'text-red-600 font-medium': product.stock_quantity === 0
            }">
              {{ product.stock_quantity }} sản phẩm
            </span>
          </div>
        </div>

        <!-- Categories -->
        <div v-if="product.categories && product.categories.length > 0" class="mb-6">
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="category in product.categories" 
              :key="category.id"
              class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
            >
              {{ category.name }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="product.description" class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Mô tả</h3>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <!-- Variants -->
        <div v-if="product.variants && product.variants.length > 0" class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Lựa chọn</h3>
          <div class="space-y-4">
            <div 
              v-for="variant in product.variants" 
              :key="variant.id"
              class="border rounded-lg p-4 cursor-pointer transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': selectedVariant?.id === variant.id }"
              @click="selectVariant(variant)"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-gray-900">{{ variant.name }}</h4>
                  <p class="text-sm text-gray-500">SKU: {{ variant.sku }}</p>
                  <div v-if="variant.attributes && variant.attributes.length > 0" class="mt-2">
                    <div 
                      v-for="attr in variant.attributes" 
                      :key="attr.attribute.id"
                      class="text-sm text-gray-600"
                    >
                      <span class="font-medium">{{ attr.attribute.name }}:</span> {{ attr.value.value }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium text-gray-900">
                    {{ formatCurrency(variant.sale_price || variant.price) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Tồn kho: {{ variant.stock_quantity }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center border border-gray-300 rounded-md">
              <button
                type="button"
                class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <input
                v-model="quantity"
                type="number"
                min="1"
                :max="maxQuantity"
                class="w-16 px-3 py-2 text-center border-0 focus:outline-none"
              >
              <button
                type="button"
                class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                @click="increaseQuantity"
                :disabled="quantity >= maxQuantity"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <span class="text-sm text-gray-600">
              Còn {{ maxQuantity }} sản phẩm
            </span>
          </div>

          <div class="flex space-x-4">
            <button
              @click="addToCart"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!canAddToCart"
            >
              <span v-if="!canAddToCart">Hết hàng</span>
              <span v-else>Thêm vào giỏ hàng</span>
            </button>
            <button
              @click="buyNow"
              class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!canAddToCart"
            >
              <span v-if="!canAddToCart">Hết hàng</span>
              <span v-else>Mua ngay</span>
            </button>
          </div>
        </div>

        <!-- Specifications -->
        <div v-if="product.weight || product.dimensions" class="mt-8 pt-8 border-t">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Thông số kỹ thuật</h3>
          <dl class="grid grid-cols-1 gap-4">
            <div v-if="product.weight">
              <dt class="text-sm font-medium text-gray-500">Cân nặng</dt>
              <dd class="text-sm text-gray-900">{{ product.weight }}g</dd>
            </div>
            <div v-if="product.dimensions">
              <dt class="text-sm font-medium text-gray-500">Kích thước</dt>
              <dd class="text-sm text-gray-900">
                {{ product.dimensions.length }} × {{ product.dimensions.width }} × {{ product.dimensions.height }} mm
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Product Content -->
    <div v-if="product && product.content" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Chi tiết sản phẩm</h2>
      <div class="bg-white rounded-lg shadow-md p-6">
        <HtmlContent :content="product.content" />
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
          @click="viewProduct(relatedProduct)"
        >
          <!-- Product Image -->
          <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
            <img
              v-if="relatedProduct.image"
              :src="relatedProduct.image"
              :alt="relatedProduct.name"
              class="h-64 w-full object-cover object-center"
            >
            <div v-else class="h-64 w-full bg-gray-200 flex items-center justify-center">
              <span class="text-gray-500">Không có hình ảnh</span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <!-- Product Name -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ relatedProduct.name }}</h3>
            
            <!-- Categories -->
            <div v-if="relatedProduct.categories && relatedProduct.categories.length > 0" class="mb-2">
              <span
                v-for="category in relatedProduct.categories.slice(0, 1)"
                :key="category.id"
                class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {{ category.name }}
              </span>
            </div>

            <!-- Price -->
            <div class="mb-3">
              <div class="flex items-baseline space-x-2">
                <span v-if="relatedProduct.sale_price" class="text-xl font-bold text-red-600">
                  {{ formatCurrency(relatedProduct.sale_price) }}
                </span>
                <span
                  v-else
                  class="text-xl font-bold text-gray-900"
                >
                  {{ formatCurrency(relatedProduct.price) }}
                </span>
                <span v-if="relatedProduct.sale_price" class="text-sm text-gray-500 line-through">
                  {{ formatCurrency(relatedProduct.price) }}
                </span>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="flex items-center justify-between">
              <div class="text-sm">
                <span
                  :class="{
                    'text-green-600 font-medium': relatedProduct.stock_quantity > 10,
                    'text-yellow-600 font-medium': relatedProduct.stock_quantity > 0 && relatedProduct.stock_quantity <= 10,
                    'text-red-600 font-medium': relatedProduct.stock_quantity === 0
                  }"
                >
                  {{ getStockText(relatedProduct.stock_quantity) }}
                </span>
              </div>
              
              <!-- Featured Badge -->
              <span v-if="relatedProduct.featured" class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Nổi bật
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="px-4 pb-4">
            <button
              @click.stop="quickAddToCart(relatedProduct)"
              class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="relatedProduct.stock_quantity === 0"
            >
              <span v-if="relatedProduct.stock_quantity === 0">Hết hàng</span>
              <span v-else>Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!loading && !product" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
      <p class="text-gray-600 mb-4">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
      <button
        @click="$router.push('/home/products')"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Quay lại danh sách sản phẩm
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
import HtmlContent from '@/components/Core/Content/HtmlContent.vue'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const router = useRouter()
const { apiClient } = useGlobalApiClient()
const { showSuccess, showError } = useToast()

// State
const loading = ref(false)
const product = ref(null)
const relatedProducts = ref([])
const selectedImage = ref('')
const selectedVariant = ref(null)
const quantity = ref(1)

// Computed properties
const maxQuantity = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.stock_quantity
  }
  return product.value?.stock_quantity || 0
})

const canAddToCart = computed(() => {
  return maxQuantity.value > 0
})

// Load product data
onMounted(async () => {
  await loadProduct()
})

async function loadProduct() {
  loading.value = true
  try {
    const response = await apiClient.get(`/api/products/${route.params.slug}`)
    if (response.data?.success) {
      product.value = response.data.data
      
      // Set selected image
      if (product.value.image) {
        selectedImage.value = product.value.image
      } else if (product.value.images && product.value.images.length > 0) {
        selectedImage.value = product.value.images[0]
      }
      
      // Load related products
      await loadRelatedProducts()
    } else {
      product.value = null
    }
  } catch (error) {
    console.error('Error loading product:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

async function loadRelatedProducts() {
  if (!product.value?.categories || product.value.categories.length === 0) {
    return
  }
  
  try {
    const categoryId = product.value.categories[0].id
    const response = await apiClient.get(`/api/products/by-category/${categoryId}?limit=8`)
    if (response.data?.success) {
      // Filter out current product
      relatedProducts.value = (response.data.data || []).filter(p => p.id !== product.value.id).slice(0, 4)
    }
  } catch (error) {
    console.error('Error loading related products:', error)
    relatedProducts.value = []
  }
}

// Variant selection
function selectVariant(variant) {
  selectedVariant.value = variant
  quantity.value = 1
  
  // Update selected image if variant has image
  if (variant.image) {
    selectedImage.value = variant.image
  }
}

// Quantity management
function increaseQuantity() {
  if (quantity.value < maxQuantity.value) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Cart actions
async function addToCart() {
  if (!canAddToCart.value) return
  
  try {
    const cartItem = {
      product_id: product.value.id,
      variant_id: selectedVariant.value?.id || null,
      quantity: quantity.value,
      price: selectedVariant.value?.sale_price || selectedVariant.value?.price || product.value.sale_price || product.value.price
    }
    
    // TODO: Implement cart API call
    console.log('Adding to cart:', cartItem)
    
    showSuccess('Đã thêm sản phẩm vào giỏ hàng')
  } catch (error) {
    showError('Không thể thêm sản phẩm vào giỏ hàng')
  }
}

async function buyNow() {
  if (!canAddToCart.value) return
  
  try {
    const cartItem = {
      product_id: product.value.id,
      variant_id: selectedVariant.value?.id || null,
      quantity: quantity.value,
      price: selectedVariant.value?.sale_price || selectedVariant.value?.price || product.value.sale_price || product.value.price
    }
    
    // TODO: Implement buy now logic
    console.log('Buy now:', cartItem)
    
    showSuccess('Đang chuyển đến trang thanh toán...')
    // router.push('/home/checkout')
  } catch (error) {
    showError('Không thể xử lý yêu cầu mua ngay')
  }
}

// Navigation
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