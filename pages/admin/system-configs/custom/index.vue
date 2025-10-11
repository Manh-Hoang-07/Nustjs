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

      <!-- Form tĩnh cho cấu hình custom -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="saveAllConfigs" class="space-y-6">
          <!-- Maintenance Mode -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Chế độ bảo trì
              </label>
              <p class="text-sm text-gray-500">Bật/tắt chế độ bảo trì hệ thống</p>
            </div>
            <div class="md:col-span-2">
              <label class="flex items-center">
                <input
                  v-model="configs.maintenance_mode"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Bật chế độ bảo trì</span>
              </label>
            </div>
          </div>

          <!-- Maintenance Message -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thông báo bảo trì
              </label>
              <p class="text-sm text-gray-500">Thông báo hiển thị khi bảo trì</p>
            </div>
            <div class="md:col-span-2">
            <textarea
              v-model="configs.maintenance_message"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': validationErrors.maintenance_message }"
              placeholder="Hệ thống đang bảo trì, vui lòng quay lại sau!"
            ></textarea>
            <div v-if="validationErrors.maintenance_message" class="mt-1 text-sm text-red-600">
              {{ validationErrors.maintenance_message }}
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
  title: 'Cài đặt tùy chỉnh',
  description: 'Cấu hình các thông số tùy chỉnh',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/ui/useToast'
import { useApiClient } from '@/composables/api/useApiClient'
import { adminEndpoints } from '@/api/endpoints/admin'

// Composables
const { showToast } = useToast()
const { apiClient } = useApiClient()

// Reactive data
const saving = ref(false)
const loading = ref(false)
const error = ref(null)
const validationErrors = ref({})

// Form data - sẽ được load từ API
const configs = ref({
  maintenance_mode: false,
  maintenance_message: 'Hệ thống đang bảo trì, vui lòng quay lại sau!'
})

// Validation rules
const validationRules = computed(() => ({
  maintenance_message: [
    { required: 'Thông báo bảo trì là bắt buộc' }
  ]
}))

// Clear errors
function clearErrors() {
  Object.keys(validationErrors.value).forEach(key => delete validationErrors.value[key])
}

// Validate form
function validateForm() {
  clearErrors()
  let valid = true
  const rules = validationRules.value
  
  for (const field in rules) {
    for (const rule of rules[field]) {
      if (rule.required && !configs.value[field]) {
        validationErrors.value[field] = rule.required
        valid = false
        break
      }
    }
  }
  
  return valid
}

// Methods
const saveAllConfigs = async () => {
  // Validate form trước khi lưu
  if (!validateForm()) {
    showToast({
      type: 'error',
      title: 'Lỗi validation',
      message: 'Vui lòng kiểm tra lại các trường bắt buộc!'
    })
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
    const response = await apiClient.get(adminEndpoints.systemConfigs.getByGroup('custom'))
    
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