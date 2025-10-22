<template>
  <Modal v-model="modalVisible" :title="formTitle">
    <form @submit.prevent="validateAndSubmit" class="space-y-4">
      <!-- Thông tin cơ bản -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
        
        <!-- Sản phẩm -->
        <div>
          <label for="product_id" class="block text-sm font-medium text-gray-700 mb-1">Sản phẩm <span class="text-red-500">*</span></label>
          <SearchableSelect
            id="product_id"
            v-model="formData.product_id"
            :search-api="adminEndpoints.products?.list || '/api/admin/products'"
            label-field="name"
            value-field="id"
            placeholder="Chọn sản phẩm"
            :disabled="!!variant"
            :error="validationErrors.product_id || apiErrors.product_id"
          />
          <p v-if="validationErrors.product_id" class="mt-1 text-sm text-red-600">{{ validationErrors.product_id }}</p>
          <p v-else-if="apiErrors.product_id" class="mt-1 text-sm text-red-600">{{ apiErrors.product_id[0] }}</p>
        </div>

        <!-- Tên biến thể -->
        <div class="mt-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Tên biến thể <span class="text-red-500">*</span></label>
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
      </div>

      <!-- Thuộc tính -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Thuộc tính</h3>
        
        <div class="space-y-4">
          <div 
            v-for="(attributeValue, index) in formData.attribute_values" 
            :key="index"
            class="flex items-center space-x-4"
          >
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Thuộc tính</label>
              <SearchableSelect
                v-model="attributeValue.attribute_id"
                :search-api="adminEndpoints.productAttributes?.list || '/api/admin/product-attributes'"
                label-field="name"
                value-field="id"
                placeholder="Chọn thuộc tính"
                :error="validationErrors[`attribute_values.${index}.attribute_id`] || apiErrors[`attribute_values.${index}.attribute_id`]"
                @update:model-value="loadAttributeValues(index)"
              />
              <p v-if="validationErrors[`attribute_values.${index}.attribute_id`]" class="mt-1 text-sm text-red-600">
                {{ validationErrors[`attribute_values.${index}.attribute_id`] }}
              </p>
              <p v-else-if="apiErrors[`attribute_values.${index}.attribute_id`]" class="mt-1 text-sm text-red-600">
                {{ apiErrors[`attribute_values.${index}.attribute_id`][0] }}
              </p>
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá trị</label>
              <SearchableSelect
                v-model="attributeValue.value_id"
                :search-api="getAttributeValueApi(index)"
                label-field="value"
                value-field="id"
                placeholder="Chọn giá trị"
                :disabled="!attributeValue.attribute_id"
                :error="validationErrors[`attribute_values.${index}.value_id`] || apiErrors[`attribute_values.${index}.value_id`]"
              />
              <p v-if="validationErrors[`attribute_values.${index}.value_id`]" class="mt-1 text-sm text-red-600">
                {{ validationErrors[`attribute_values.${index}.value_id`] }}
              </p>
              <p v-else-if="apiErrors[`attribute_values.${index}.value_id`]" class="mt-1 text-sm text-red-600">
                {{ apiErrors[`attribute_values.${index}.value_id`][0] }}
              </p>
            </div>
            
            <div class="pt-6">
              <button
                type="button"
                @click="removeAttributeValue(index)"
                class="px-3 py-2 text-red-600 hover:text-red-800 focus:outline-none"
                :disabled="formData.attribute_values.length <= 1"
              >
                Xóa
              </button>
            </div>
          </div>
          
          <button
            type="button"
            @click="addAttributeValue"
            class="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            + Thêm thuộc tính
          </button>
        </div>
      </div>

      <!-- Hình ảnh -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hình ảnh biến thể</label>
          <ImageUploader
            v-model="formData.image"
            :defaultUrl="imageUrl"
            @remove="formData.image = null"
          />
          <p v-if="validationErrors.image" class="mt-1 text-sm text-red-600">{{ validationErrors.image }}</p>
          <p v-else-if="apiErrors.image" class="mt-1 text-sm text-red-600">{{ apiErrors.image[0] }}</p>
        </div>
      </div>

      <!-- Trạng thái -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Trạng thái</h3>
        
        <div>
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
          {{ isSubmitting ? 'Đang xử lý...' : (variant ? 'Cập nhật' : 'Thêm mới') }}
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
import { adminEndpoints } from '@/api/endpoints'
import { useFormValidation } from '@/composables/utils/useFormValidation'
import { useGlobalApiClient } from '@/composables/api'

const props = defineProps({
  show: Boolean,
  variant: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  productEnums: {
    type: Array,
    default: () => []
  },
  attributeEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const { apiClient } = useGlobalApiClient()

// API cho enum trạng thái
const statusApi = adminEndpoints.adminEnums('product_status')

// Form title
const formTitle = computed(() => props.variant ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới')

// Modal visibility
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

// Image URLs for ImageUploader
const imageUrl = computed(() => {
  if (props.variant?.image) {
    return props.variant.image
  }
  return null
})

// Attribute value options cache
const attributeValueOptions = ref({})

// Form data
const formData = reactive({
  product_id: '',
  name: '',
  sku: '',
  price: '',
  sale_price: '',
  stock_quantity: '',
  weight: '',
  attribute_values: [
    { attribute_id: '', value_id: '' }
  ],
  image: null,
  status: 'active'
})

// Form state
const isSubmitting = ref(false)

// Validation rules
const validationRules = computed(() => ({
  product_id: [
    { required: 'Sản phẩm là bắt buộc' }
  ],
  name: [
    { required: 'Tên biến thể là bắt buộc' }
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

// Watch variant prop to update form data
watch(() => props.variant, async (newVal) => {
  if (newVal) {
    formData.product_id = newVal.product_id || ''
    formData.name = newVal.name || ''
    formData.sku = newVal.sku || ''
    formData.price = newVal.price || ''
    formData.sale_price = newVal.sale_price || ''
    formData.stock_quantity = newVal.stock_quantity || ''
    formData.weight = newVal.weight || ''
    formData.image = (newVal.image && !newVal.image.includes('via.placeholder')) ? newVal.image : null
    
    // Xử lý attributes
    if (newVal.attributes && Array.isArray(newVal.attributes)) {
      formData.attribute_values = newVal.attributes.map(attr => ({
        attribute_id: attr.attribute.id,
        value_id: attr.value.id
      }))
    } else {
      formData.attribute_values = [{ attribute_id: '', value_id: '' }]
    }
    
    formData.status = newVal.status !== undefined ? newVal.status : 'active'
    
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
  formData.product_id = ''
  formData.name = ''
  formData.sku = ''
  formData.price = ''
  formData.sale_price = ''
  formData.stock_quantity = ''
  formData.weight = ''
  formData.attribute_values = [{ attribute_id: '', value_id: '' }]
  formData.image = null
  formData.status = 'active'
  attributeValueOptions.value = {}
}

// Attribute value management
function addAttributeValue() {
  formData.attribute_values.push({ attribute_id: '', value_id: '' })
}

function removeAttributeValue(index) {
  if (formData.attribute_values.length > 1) {
    formData.attribute_values.splice(index, 1)
  }
}

async function loadAttributeValues(index) {
  const attributeId = formData.attribute_values[index].attribute_id
  if (!attributeId) {
    return
  }
  
  // Reset value when attribute changes
  formData.attribute_values[index].value_id = ''
  
  // Load attribute values if not cached
  if (!attributeValueOptions.value[attributeId]) {
    try {
      const response = await apiClient.get(`/api/admin/product-attributes/${attributeId}/values`)
      if (response.data?.success) {
        attributeValueOptions.value[attributeId] = response.data.data || []
      } else {
        attributeValueOptions.value[attributeId] = []
      }
    } catch (error) {
      console.error('Error loading attribute values:', error)
      attributeValueOptions.value[attributeId] = []
    }
  }
}

function getAttributeValueApi(index) {
  const attributeId = formData.attribute_values[index].attribute_id
  if (!attributeId) return null
  
  return `/api/admin/product-attributes/${attributeId}/values`
}

// Validate and submit form
function validateAndSubmit() {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Filter out empty attribute values
    const attributeValues = formData.attribute_values.filter(
      av => av.attribute_id && av.value_id
    )
    
    // Create submit data
    const submitData = {
      product_id: parseInt(formData.product_id),
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : undefined,
      stock_quantity: parseInt(formData.stock_quantity),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      attribute_values: attributeValues,
      image: formData.image,
      status: formData.status
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