<template>
  <Modal v-model="modalVisible" :title="formTitle">
    <form @submit.prevent="validateAndSubmit" class="space-y-4">
      <!-- Thông tin cơ bản -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
        
        <!-- Tên sản phẩm -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span class="text-red-500">*</span></label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-500': validationErrors.name || apiErrors.name }"
          />
          <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</p>
          <p v-else-if="apiErrors.name" class="mt-1 text-sm text-red-600">{{ apiErrors.name[0] }}</p>
        </div>

        <!-- Slug -->
        <div class="mt-4">
          <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            id="slug"
            v-model="formData.slug"
            type="text"
            placeholder="tu-dong-tao-neu-khong-nhap"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-500': validationErrors.slug || apiErrors.slug }"
          />
          <p v-if="validationErrors.slug" class="mt-1 text-sm text-red-600">{{ validationErrors.slug }}</p>
          <p v-else-if="apiErrors.slug" class="mt-1 text-sm text-red-600">{{ apiErrors.slug[0] }}</p>
        </div>

        <!-- SKU -->
        <div class="mt-4">
          <label for="sku" class="block text-sm font-medium text-gray-700 mb-1">SKU <span class="text-red-500">*</span></label>
          <input
            id="sku"
            v-model="formData.sku"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-500': validationErrors.sku || apiErrors.sku }"
          />
          <p v-if="validationErrors.sku" class="mt-1 text-sm text-red-600">{{ validationErrors.sku }}</p>
          <p v-else-if="apiErrors.sku" class="mt-1 text-sm text-red-600">{{ apiErrors.sku[0] }}</p>
        </div>

        <!-- Mô tả ngắn -->
        <div class="mt-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            placeholder="Mô tả ngắn về sản phẩm..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-500': validationErrors.description || apiErrors.description }"
          ></textarea>
          <p v-if="validationErrors.description" class="mt-1 text-sm text-red-600">{{ validationErrors.description }}</p>
          <p v-else-if="apiErrors.description" class="mt-1 text-sm text-red-600">{{ apiErrors.description[0] }}</p>
        </div>

        <!-- Nội dung chi tiết -->
        <div class="mt-4">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết</label>
          <CKEditor
            v-model="formData.content"
            :height="'300px'"
            :placeholder="'Nhập nội dung chi tiết về sản phẩm...'"
            :upload-url="'/api/upload/image'"
            :max-file-size="5242880"
            :allowed-image-types="['image/jpeg', 'image/png', 'image/gif', 'image/webp']"
            :show-word-count="true"
            :enable-full-screen="true"
            class="w-full"
          />
          <p v-if="validationErrors.content" class="mt-1 text-sm text-red-600">{{ validationErrors.content }}</p>
          <p v-else-if="apiErrors.content" class="mt-1 text-sm text-red-600">{{ apiErrors.content[0] }}</p>
        </div>
      </div>

      <!-- Giá và tồn kho -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Giá và tồn kho</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Giá gốc -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Giá gốc (VND) <span class="text-red-500">*</span></label>
            <input
              id="price"
              v-model="formData.price"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': validationErrors.price || apiErrors.price }"
            />
            <p v-if="validationErrors.price" class="mt-1 text-sm text-red-600">{{ validationErrors.price }}</p>
            <p v-else-if="apiErrors.price" class="mt-1 text-sm text-red-600">{{ apiErrors.price[0] }}</p>
          </div>

          <!-- Giá khuyến mãi -->
          <div>
            <label for="sale_price" class="block text-sm font-medium text-gray-700 mb-1">Giá khuyến mãi (VND)</label>
            <input
              id="sale_price"
              v-model="formData.sale_price"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': validationErrors.sale_price || apiErrors.sale_price }"
            />
            <p v-if="validationErrors.sale_price" class="mt-1 text-sm text-red-600">{{ validationErrors.sale_price }}</p>
            <p v-else-if="apiErrors.sale_price" class="mt-1 text-sm text-red-600">{{ apiErrors.sale_price[0] }}</p>
          </div>

          <!-- Số lượng tồn kho -->
          <div>
            <label for="stock_quantity" class="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho <span class="text-red-500">*</span></label>
            <input
              id="stock_quantity"
              v-model="formData.stock_quantity"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': validationErrors.stock_quantity || apiErrors.stock_quantity }"
            />
            <p v-if="validationErrors.stock_quantity" class="mt-1 text-sm text-red-600">{{ validationErrors.stock_quantity }}</p>
            <p v-else-if="apiErrors.stock_quantity" class="mt-1 text-sm text-red-600">{{ apiErrors.stock_quantity[0] }}</p>
          </div>

          <!-- Cân nặng -->
          <div>
            <label for="weight" class="block text-sm font-medium text-gray-700 mb-1">Cân nặng (g)</label>
            <input
              id="weight"
              v-model="formData.weight"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': validationErrors.weight || apiErrors.weight }"
            />
            <p v-if="validationErrors.weight" class="mt-1 text-sm text-red-600">{{ validationErrors.weight }}</p>
            <p v-else-if="apiErrors.weight" class="mt-1 text-sm text-red-600">{{ apiErrors.weight[0] }}</p>
          </div>
        </div>

        <!-- Kích thước -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Kích thước (mm)</label>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="length" class="block text-sm text-gray-600 mb-1">Dài</label>
              <input
                id="length"
                v-model="formData.dimensions.length"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                :class="{ 'border-red-500': validationErrors['dimensions.length'] || apiErrors['dimensions.length'] }"
              />
              <p v-if="validationErrors['dimensions.length']" class="mt-1 text-sm text-red-600">{{ validationErrors['dimensions.length'] }}</p>
              <p v-else-if="apiErrors['dimensions.length']" class="mt-1 text-sm text-red-600">{{ apiErrors['dimensions.length'][0] }}</p>
            </div>
            <div>
              <label for="width" class="block text-sm text-gray-600 mb-1">Rộng</label>
              <input
                id="width"
                v-model="formData.dimensions.width"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                :class="{ 'border-red-500': validationErrors['dimensions.width'] || apiErrors['dimensions.width'] }"
              />
              <p v-if="validationErrors['dimensions.width']" class="mt-1 text-sm text-red-600">{{ validationErrors['dimensions.width'] }}</p>
              <p v-else-if="apiErrors['dimensions.width']" class="mt-1 text-sm text-red-600">{{ apiErrors['dimensions.width'][0] }}</p>
            </div>
            <div>
              <label for="height" class="block text-sm text-gray-600 mb-1">Cao</label>
              <input
                id="height"
                v-model="formData.dimensions.height"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                :class="{ 'border-red-500': validationErrors['dimensions.height'] || apiErrors['dimensions.height'] }"
              />
              <p v-if="validationErrors['dimensions.height']" class="mt-1 text-sm text-red-600">{{ validationErrors['dimensions.height'] }}</p>
              <p v-else-if="apiErrors['dimensions.height']" class="mt-1 text-sm text-red-600">{{ apiErrors['dimensions.height'][0] }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hình ảnh -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
        
        <!-- Hình ảnh chính -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hình ảnh chính</label>
          <ImageUploader
            v-model="formData.image"
            :defaultUrl="imageUrl"
            @remove="formData.image = null"
          />
          <p v-if="validationErrors.image" class="mt-1 text-sm text-red-600">{{ validationErrors.image }}</p>
          <p v-else-if="apiErrors.image" class="mt-1 text-sm text-red-600">{{ apiErrors.image[0] }}</p>
        </div>

        <!-- Thư viện hình ảnh -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Thư viện hình ảnh</label>
          <ImageUploader
            v-model="formData.images"
            :multiple="true"
            :defaultUrls="imageUrls"
            @remove="removeImage"
          />
          <p v-if="validationErrors.images" class="mt-1 text-sm text-red-600">{{ validationErrors.images }}</p>
          <p v-else-if="apiErrors.images" class="mt-1 text-sm text-red-600">{{ apiErrors.images[0] }}</p>
        </div>
      </div>

      <!-- Danh mục và trạng thái -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Danh mục và trạng thái</h3>
        
        <!-- Danh mục -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <SearchableMultiSelect
            v-model="formData.category_ids"
            :search-api="adminEndpoints.productCategories?.list || '/api/admin/product-categories'"
            :label-field="'name'"
            placeholder="Chọn danh mục"
            :error="validationErrors.category_ids || apiErrors.category_ids"
          />
          <p v-if="validationErrors.category_ids" class="mt-1 text-sm text-red-600">{{ validationErrors.category_ids }}</p>
          <p v-else-if="apiErrors.category_ids" class="mt-1 text-sm text-red-600">{{ apiErrors.category_ids[0] }}</p>
        </div>

        <!-- Trạng thái -->
        <div class="mt-4">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <SearchableSelect
            id="status"
            v-model="formData.status"
            :search-api="statusApi"
            label-field="label"
            value-field="value"
            placeholder="-- Chọn trạng thái --"
            :error="validationErrors.status || apiErrors.status"
          />
          <p v-if="validationErrors.status" class="mt-1 text-sm text-red-600">{{ validationErrors.status }}</p>
          <p v-else-if="apiErrors.status" class="mt-1 text-sm text-red-600">{{ apiErrors.status[0] }}</p>
        </div>

        <!-- Nổi bật -->
        <div class="mt-4 flex items-center">
          <input
            v-model="formData.featured"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label class="ml-2 text-sm text-gray-700">Sản phẩm nổi bật</label>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="onClose"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Hủy
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Đang xử lý...' : (product ? 'Cập nhật' : 'Thêm mới') }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed, reactive, watch, nextTick } from 'vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import ImageUploader from '@/components/Core/Image/ImageUploader.vue'
import SearchableSelect from '@/components/Core/Select/SearchableSelect.vue'
import SearchableMultiSelect from '@/components/Core/Select/SearchableMultiSelect.vue'
import CKEditor from '@/components/Core/Content/CKEditor.vue'
import { adminEndpoints } from '@/api/endpoints'
import { useFormValidation } from '@/composables/utils/useFormValidation'

const props = defineProps({
  show: Boolean,
  product: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  categoryEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

// API cho enum trạng thái
const statusApi = adminEndpoints.adminEnums('product_status')

// Form title
const formTitle = computed(() => props.product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới')

// Modal visibility
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

// Image URLs for ImageUploader
const imageUrl = computed(() => {
  if (props.product?.image) {
    return props.product.image
  }
  return null
})

const imageUrls = computed(() => {
  if (props.product?.images && Array.isArray(props.product.images)) {
    return props.product.images
  }
  return []
})

// Form data
const formData = reactive({
  name: '',
  slug: '',
  sku: '',
  description: '',
  content: '',
  price: '',
  sale_price: '',
  stock_quantity: '',
  weight: '',
  dimensions: {
    length: '',
    width: '',
    height: ''
  },
  image: null,
  images: [],
  category_ids: [],
  status: 'active',
  featured: false
})

// Form state
const isSubmitting = ref(false)

// Validation rules
const validationRules = computed(() => ({
  name: [
    { required: 'Tên sản phẩm là bắt buộc' }
  ],
  sku: [
    { required: 'SKU là bắt buộc' }
  ],
  price: [
    { required: 'Giá gốc là bắt buộc' }
  ],
  stock_quantity: [
    { required: 'Số lượng tồn kho là bắt buộc' }
  ]
}))

// Use form validation composable
const { validationErrors, clearErrors, validateForm } = useFormValidation(ref(formData), validationRules)

// Watch product prop to update form data
watch(() => props.product, async (newVal) => {
  if (newVal) {
    formData.name = newVal.name || ''
    formData.slug = newVal.slug || ''
    formData.sku = newVal.sku || ''
    formData.description = newVal.description || ''
    formData.content = newVal.content || ''
    formData.price = newVal.price || ''
    formData.sale_price = newVal.sale_price || ''
    formData.stock_quantity = newVal.stock_quantity || ''
    formData.weight = newVal.weight || ''
    formData.dimensions = {
      length: newVal.dimensions?.length || '',
      width: newVal.dimensions?.width || '',
      height: newVal.dimensions?.height || ''
    }
    formData.image = (newVal.image && !newVal.image.includes('via.placeholder')) ? newVal.image : null
    formData.images = newVal.images && Array.isArray(newVal.images) ? newVal.images.filter(img => !img.includes('via.placeholder')) : []
    
    // Xử lý categories
    if (newVal.categories && Array.isArray(newVal.categories)) {
      formData.category_ids = newVal.categories.map(cat => cat.id)
    } else {
      formData.category_ids = []
    }
    
    formData.status = newVal.status !== undefined ? newVal.status : 'active'
    formData.featured = newVal.featured || false
    
    // Đảm bảo DOM được cập nhật
    await nextTick()
  } else {
    // Khi tạo mới, set giá trị mặc định
    resetForm()
    clearErrors()
  }
}, { immediate: true })

// Reset form
function resetForm() {
  formData.name = ''
  formData.slug = ''
  formData.sku = ''
  formData.description = ''
  formData.content = ''
  formData.price = ''
  formData.sale_price = ''
  formData.stock_quantity = ''
  formData.weight = ''
  formData.dimensions = {
    length: '',
    width: '',
    height: ''
  }
  formData.image = null
  formData.images = []
  formData.category_ids = []
  formData.status = 'active'
  formData.featured = false
}

// Remove image from gallery
function removeImage(index) {
  if (formData.images && Array.isArray(formData.images)) {
    formData.images.splice(index, 1)
  }
}

// Validate and submit form
function validateAndSubmit() {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Clean up dimensions object
    const dimensions = {}
    if (formData.dimensions.length) dimensions.length = parseFloat(formData.dimensions.length)
    if (formData.dimensions.width) dimensions.width = parseFloat(formData.dimensions.width)
    if (formData.dimensions.height) dimensions.height = parseFloat(formData.dimensions.height)
    
    // Create submit data
    const submitData = {
      name: formData.name,
      slug: formData.slug || undefined,
      sku: formData.sku,
      description: formData.description,
      content: formData.content,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : undefined,
      stock_quantity: parseInt(formData.stock_quantity),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      dimensions: Object.keys(dimensions).length > 0 ? dimensions : undefined,
      image: formData.image,
      images: formData.images,
      category_ids: formData.category_ids,
      status: formData.status,
      featured: formData.featured
    }
    
    emit('submit', submitData)
  } finally {
    isSubmitting.value = false
  }
}

// Close modal
function onClose() {
  emit('cancel')
}
</script>