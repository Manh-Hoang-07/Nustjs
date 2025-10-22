<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Chi tiết sản phẩm</h1>
      <div class="flex space-x-2">
        <button
          @click="editProduct"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Chỉnh sửa
        </button>
        <button
          @click="onClose"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Đóng
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner size="large" />
    </div>

    <div v-else-if="product" class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Product Header -->
      <div class="p-6 border-b">
        <div class="flex items-start space-x-6">
          <!-- Product Image -->
          <div class="flex-shrink-0">
            <img 
              v-if="product.image" 
              :src="product.image" 
              :alt="product.name"
              class="w-32 h-32 object-cover rounded-lg"
            >
            <div 
              v-else
              class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <span class="text-gray-500">Không có hình ảnh</span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900">{{ product.name }}</h2>
            <p class="text-sm text-gray-500 mt-1">SKU: {{ product.sku }}</p>
            
            <div class="mt-4 flex items-center space-x-4">
              <span 
                class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full" 
                :class="getStatusClass(product.status)"
              >
                {{ getStatusLabel(product.status) }}
              </span>
              <span 
                v-if="product.featured"
                class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
              >
                Nổi bật
              </span>
            </div>

            <div class="mt-4">
              <div class="flex items-baseline space-x-2">
                <span v-if="product.sale_price" class="text-2xl font-bold text-red-600">
                  {{ formatCurrency(product.sale_price) }}
                </span>
                <span 
                  v-else
                  class="text-2xl font-bold text-gray-900"
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
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin chi tiết</h3>
            
            <!-- Description -->
            <div v-if="product.description" class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</h4>
              <p class="text-gray-600">{{ product.description }}</p>
            </div>

            <!-- Content -->
            <div v-if="product.content" class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết</h4>
              <div class="prose max-w-none">
                <HtmlContent :content="product.content" />
              </div>
            </div>

            <!-- Specifications -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Thông số kỹ thuật</h4>
              <dl class="grid grid-cols-2 gap-4">
                <div v-if="product.weight">
                  <dt class="text-sm text-gray-500">Cân nặng</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ product.weight }}g</dd>
                </div>
                <div v-if="product.dimensions?.length">
                  <dt class="text-sm text-gray-500">Kích thước</dt>
                  <dd class="text-sm font-medium text-gray-900">
                    {{ product.dimensions.length }} × {{ product.dimensions.width }} × {{ product.dimensions.height }} mm
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Categories -->
            <div v-if="product.categories && product.categories.length > 0" class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Danh mục</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="category in product.categories" 
                  :key="category.id"
                  class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {{ category.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
            
            <!-- Image Gallery -->
            <div v-if="product.images && product.images.length > 0" class="grid grid-cols-2 gap-4">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                class="relative group"
              >
                <img 
                  :src="image" 
                  :alt="`${product.name} - ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    @click="viewImage(image)"
                    class="opacity-0 group-hover:opacity-100 text-white bg-blue-600 rounded px-2 py-1 text-sm"
                  >
                    Xem
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm">
              Không có hình ảnh bổ sung
            </div>

            <!-- Variants -->
            <div v-if="product.variants && product.variants.length > 0" class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Biến thể sản phẩm</h3>
              <div class="space-y-3">
                <div 
                  v-for="variant in product.variants" 
                  :key="variant.id"
                  class="border rounded-lg p-4"
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
          </div>
        </div>

        <!-- Timestamps -->
        <div class="mt-8 pt-6 border-t">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span class="font-medium">Ngày tạo:</span> {{ formatDate(product.created_at) }}
            </div>
            <div>
              <span class="font-medium">Cập nhật lần cuối:</span> {{ formatDate(product.updated_at) }}
            </div>
            <div v-if="product.createdUser">
              <span class="font-medium">Người tạo:</span> {{ product.createdUser.name }}
            </div>
            <div v-if="product.updatedUser">
              <span class="font-medium">Người cập nhật:</span> {{ product.updatedUser.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-500">Không tìm thấy sản phẩm</p>
    </div>

    <!-- Image Modal -->
    <Modal v-if="selectedImage" :show="!!selectedImage" @close="selectedImage = null">
      <div class="p-4">
        <img :src="selectedImage" alt="Product image" class="max-w-full max-h-96 mx-auto">
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGlobalApiClient } from '@/composables/api'
import { formatCurrency, formatDate } from '@/utils/formatters'
import LoadingSpinner from '@/components/Core/Loading/LoadingSpinner.vue'
import HtmlContent from '@/components/Core/Content/HtmlContent.vue'
import Modal from '@/components/Core/Modal/Modal.vue'

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  },
  statusEnums: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'close'])

const { apiClient } = useGlobalApiClient()

// State
const loading = ref(false)
const product = ref(null)
const selectedImage = ref(null)

// Fetch product data
onMounted(async () => {
  await fetchProduct()
})

async function fetchProduct() {
  loading.value = true
  try {
    const response = await apiClient.get(`/api/admin/products/${props.productId}`)
    if (response.data?.success) {
      product.value = response.data.data
    } else {
      product.value = null
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

// Status helper functions
function getStatusLabel(status) {
  const found = (props.statusEnums || []).find(s => s.value === status)
  return found?.label || status || 'Không xác định'
}

function getStatusClass(status) {
  const found = (props.statusEnums || []).find(s => s.value === status)
  return found?.class || found?.badge_class || found?.color_class || 'bg-gray-100 text-gray-800'
}


// Actions
function editProduct() {
  emit('edit', product.value)
}

function onClose() {
  emit('close')
}

function viewImage(image) {
  selectedImage.value = image
}
</script>