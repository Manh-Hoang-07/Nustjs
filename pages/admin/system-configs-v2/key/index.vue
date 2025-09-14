<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cấu hình theo Key V2</h1>
      <p class="text-gray-600 mt-1">Cập nhật cấu hình theo từng key riêng lẻ (API V2)</p>
    </div>

    <!-- Form cấu hình key -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <div v-if="loading" class="space-y-6">
        <SkeletonLoader type="form" />
      </div>
      
      <form v-else @submit.prevent="saveConfig" class="space-y-8">
        <!-- Key Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Chọn Key cấu hình
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="selectedKey"
            @change="loadKeyValue"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Chọn key cấu hình --</option>
            <optgroup label="Cấu hình chung">
              <option value="app_name">app_name - Tên ứng dụng</option>
              <option value="site_name">site_name - Tên website</option>
              <option value="site_logo">site_logo - Logo website</option>
              <option value="site_favicon">site_favicon - Favicon website</option>
              <option value="site_email">site_email - Email liên hệ</option>
              <option value="site_phone">site_phone - Số điện thoại</option>
              <option value="site_address">site_address - Địa chỉ</option>
              <option value="site_description">site_description - Mô tả website</option>
              <option value="timezone">timezone - Múi giờ</option>
              <option value="language">language - Ngôn ngữ</option>
              <option value="maintenance_mode">maintenance_mode - Chế độ bảo trì</option>
              <option value="items_per_page">items_per_page - Số item mỗi trang</option>
            </optgroup>
            <optgroup label="Cấu hình Email">
              <option value="smtp_host">smtp_host - SMTP Host</option>
              <option value="smtp_port">smtp_port - SMTP Port</option>
              <option value="smtp_username">smtp_username - SMTP Username</option>
              <option value="smtp_password">smtp_password - SMTP Password</option>
              <option value="smtp_encryption">smtp_encryption - SMTP Encryption</option>
              <option value="from_email">from_email - Email gửi đi</option>
              <option value="from_name">from_name - Tên người gửi</option>
            </optgroup>
          </select>
        </div>

        <!-- Current Value Display -->
        <div v-if="selectedKey && currentValue !== null" class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Giá trị hiện tại:</h4>
          <div class="text-sm text-gray-600">
            <span v-if="typeof currentValue === 'boolean'">
              {{ currentValue ? 'Có' : 'Không' }}
            </span>
            <span v-else>{{ currentValue || '(Trống)' }}</span>
          </div>
        </div>

        <!-- Value Input -->
        <div v-if="selectedKey">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Giá trị mới
            <span class="text-red-500">*</span>
          </label>
          
          <!-- Boolean input -->
          <div v-if="isBooleanKey(selectedKey)" class="flex items-center">
            <input
              v-model="configForm.value"
              type="checkbox"
              id="boolean_value"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="boolean_value" class="ml-2 block text-sm text-gray-700">
              {{ configForm.value ? 'Bật' : 'Tắt' }}
            </label>
          </div>
          
          <!-- Number input -->
          <input
            v-else-if="isNumberKey(selectedKey)"
            v-model.number="configForm.value"
            type="number"
            :min="selectedKey === 'smtp_port' ? 1 : 1"
            :max="selectedKey === 'items_per_page' ? 100 : undefined"
            :placeholder="getPlaceholder(selectedKey)"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <!-- Email input -->
          <input
            v-else-if="isEmailKey(selectedKey)"
            v-model="configForm.value"
            type="email"
            :placeholder="getPlaceholder(selectedKey)"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <!-- Select input -->
          <select
            v-else-if="isSelectKey(selectedKey)"
            v-model="configForm.value"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-if="selectedKey === 'timezone'" value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
            <option v-if="selectedKey === 'timezone'" value="UTC">UTC</option>
            <option v-if="selectedKey === 'timezone'" value="America/New_York">America/New_York</option>
            <option v-if="selectedKey === 'language'" value="vi">Tiếng Việt</option>
            <option v-if="selectedKey === 'language'" value="en">English</option>
            <option v-if="selectedKey === 'smtp_encryption'" value="tls">TLS</option>
            <option v-if="selectedKey === 'smtp_encryption'" value="ssl">SSL</option>
            <option v-if="selectedKey === 'smtp_encryption'" value="none">None</option>
          </select>
          
          <!-- Text input -->
          <input
            v-else
            v-model="configForm.value"
            type="text"
            :placeholder="getPlaceholder(selectedKey)"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Nút lưu -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            :disabled="saving || !selectedKey"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving">Đang lưu...</span>
            <span v-else>Lưu cấu hình</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, reactive, onMounted } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'
import { useToast } from '@/composables/ui/useToast'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'

// Use composables
const { apiClient } = useApiClient()
const { showSuccess, showError } = useToast()

// State
const loading = ref(true)
const saving = ref(false)
const selectedKey = ref('')
const currentValue = ref(null)

// Form state
const configForm = reactive({
  key: '',
  value: ''
})

// Fetch data
onMounted(async () => {
  loading.value = false
})

// Load key value
async function loadKeyValue() {
  if (!selectedKey.value) {
    currentValue.value = null
    configForm.key = ''
    configForm.value = ''
    return
  }

  try {
    const response = await apiClient.get(`/api/config-v2/key?key=${selectedKey.value}`)
    if (response.data.success) {
      currentValue.value = response.data.data
      configForm.key = selectedKey.value
      configForm.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading key value:', error)
    showError('Không thể tải giá trị key')
  }
}

// Save config
async function saveConfig() {
  if (!selectedKey.value) {
    showError('Vui lòng chọn key cấu hình')
    return
  }

  saving.value = true
  try {
    const response = await apiClient.post('/api/admin/config-v2/key', {
      key: selectedKey.value,
      value: configForm.value
    })
    if (response.data.success) {
      showSuccess(`Cấu hình ${selectedKey.value} đã được lưu thành công`)
      currentValue.value = response.data.data
      configForm.value = response.data.data
    }
  } catch (error) {
    console.error('Error saving config:', error)
    showError('Không thể lưu cấu hình')
  } finally {
    saving.value = false
  }
}

// Helper functions
function isBooleanKey(key) {
  return key === 'maintenance_mode'
}

function isNumberKey(key) {
  return ['smtp_port', 'items_per_page'].includes(key)
}

function isEmailKey(key) {
  return ['site_email', 'from_email', 'smtp_username'].includes(key)
}

function isSelectKey(key) {
  return ['timezone', 'language', 'smtp_encryption'].includes(key)
}

function getPlaceholder(key) {
  const placeholders = {
    app_name: 'Laravel App',
    site_name: 'Website Demo',
    site_logo: '/images/logo.png',
    site_favicon: '/images/favicon.ico',
    site_email: 'admin@demo.com',
    site_phone: '0123456789',
    site_address: '123 Đường ABC, Quận XYZ, TP.HCM',
    site_description: 'Website bán hàng trực tuyến...',
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_username: 'your-email@gmail.com',
    smtp_password: 'your-app-password',
    from_email: 'noreply@example.com',
    from_name: 'Laravel App'
  }
  return placeholders[key] || ''
}

// Reset form
function resetForm() {
  selectedKey.value = ''
  currentValue.value = null
  configForm.key = ''
  configForm.value = ''
}
</script>
