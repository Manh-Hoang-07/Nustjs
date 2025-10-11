<template>
  <div class="p-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          <div class="mt-4">
            <button @click="loadConfigs" class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main content -->
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
          <p class="text-gray-600 mt-1">{{ groupDescription }}</p>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="saveAllConfigs" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            :disabled="saving"
          >
            {{ saving ? 'Đang lưu...' : 'Lưu tất cả' }}
          </button>
        </div>
      </div>

      <!-- Form tĩnh cho cấu hình storage -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="saveAllConfigs" class="space-y-6">
          <!-- Storage Disk -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Storage disk mặc định <span class="text-red-500">*</span>
            </label>
              <p class="text-sm text-gray-500">Disk lưu trữ mặc định</p>
            </div>
            <div class="md:col-span-2">
            <select
              v-model="configs.disk"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': validationErrors.disk }"
            >
              <option value="local">Local</option>
              <option value="s3">Amazon S3</option>
              <option value="gcs">Google Cloud Storage</option>
              <option value="azure">Azure Blob</option>
            </select>
            <div v-if="validationErrors.disk" class="mt-1 text-sm text-red-600">
              {{ validationErrors.disk }}
            </div>
            </div>
          </div>

          <!-- Max File Size -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kích thước file tối đa (KB) <span class="text-red-500">*</span>
            </label>
              <p class="text-sm text-gray-500">Kích thước file upload tối đa</p>
            </div>
            <div class="md:col-span-2">
            <input
              v-model.number="configs.max_file_size"
              type="number"
              min="100"
              max="10485760"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': validationErrors.max_file_size }"
              placeholder="10240"
            />
            <div v-if="validationErrors.max_file_size" class="mt-1 text-sm text-red-600">
              {{ validationErrors.max_file_size }}
            </div>
            </div>
          </div>

          <!-- Allowed Extensions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Các định dạng file được phép upload <span class="text-red-500">*</span>
            </label>
              <p class="text-sm text-gray-500">Danh sách extension được phép</p>
            </div>
            <div class="md:col-span-2">
            <textarea
              v-model="configs.allowed_extensions"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': validationErrors.allowed_extensions }"
              placeholder='["jpg","jpeg","png","gif","pdf","doc","docx","xls","xlsx"]'
            ></textarea>
            <div v-if="validationErrors.allowed_extensions" class="mt-1 text-sm text-red-600">
              {{ validationErrors.allowed_extensions }}
            </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: 'admin-layout',
  title: 'Cấu hình lưu trữ',
  description: 'Cấu hình các thông số lưu trữ',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/ui/useToast'
import { useApiClient } from '@/composables/api/useApiClient'
import { adminEndpoints } from '@/api/endpoints/admin'
import { useFormValidation } from '@/composables/utils/useFormValidation'

// Composables
const { showToast } = useToast()
const { apiClient } = useApiClient()

// Reactive data
const saving = ref(false)
const loading = ref(false)
const error = ref(null)

// Form data - sẽ được load từ API
const configs = ref({
  disk: 'local',
  max_file_size: 10240,
  allowed_extensions: '["jpg","jpeg","png","gif","pdf","doc","docx","xls","xlsx"]'
})

// Validation rules
const validationRules = computed(() => ({
  disk: [
    { required: 'Storage disk là bắt buộc' }
  ],
  max_file_size: [
    { required: 'Kích thước file tối đa là bắt buộc' }
  ],
  allowed_extensions: [
    { required: 'Các định dạng file được phép là bắt buộc' }
  ]
}))

// Use form validation composable
const { validationErrors, clearErrors, validateForm } = useFormValidation(configs, validationRules)

// Methods
const saveAllConfigs = async () => {
  // Validate form trước khi lưu
  if (!validateForm()) {
    return
  }

  saving.value = true
  try {
    // Chuyển đổi configs thành format API
    const bulkData = {
      configs: Object.entries(configs.value).map(([key, value]) => ({
        key: key,
        value: String(value)
      }))
    }
    
    // Gọi API bulk update trực tiếp
    const response = await apiClient.post(adminEndpoints.systemConfigs.bulkUpdate, bulkData)
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: 'Thành công',
        message: 'Đã lưu cấu hình thành công!'
      })
    } else {
      throw new Error(response.data.message || 'Failed to save configs')
    }
  } catch (error) {
    showToast({
      type: 'error',
      title: 'Lỗi',
      message: 'Không thể lưu cấu hình!'
    })
  } finally {
    saving.value = false
  }
}

const loadConfigs = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiClient.get(adminEndpoints.systemConfigs.getByGroup('storage'))
    
    if (response.data.success && response.data.data) {
      // Chuyển đổi array configs thành object
      const configsData = {}
      response.data.data.forEach(config => {
        // Chuyển đổi value theo type
        let value = config.value
        if (config.type === 'boolean') {
          value = value === '1' || value === 'true' || value === true
        } else if (config.type === 'integer') {
          value = parseInt(value) || 0
        } else if (config.type === 'float') {
          value = parseFloat(value) || 0
        } else if (config.type === 'array' || config.type === 'json') {
          try {
            value = JSON.parse(value)
          } catch {
            value = value
          }
        }
        configsData[config.key] = value
      })
      
      configs.value = { ...configs.value, ...configsData }
    }
  } catch (err) {
    error.value = err.message || 'Không thể tải cấu hình'
    console.error('Error loading configs:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadConfigs()
})
</script>