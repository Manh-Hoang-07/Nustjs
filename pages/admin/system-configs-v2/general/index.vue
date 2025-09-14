<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cài đặt Chung V2</h1>
      <p class="text-gray-600 mt-1">Cấu hình thông tin cơ bản của website (API V2)</p>
    </div>

    <!-- Form cấu hình chung -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <div v-if="loading" class="space-y-6">
        <SkeletonLoader type="form" />
      </div>
      
      <form v-else @submit.prevent="saveConfig" class="space-y-8">
        <!-- App Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên ứng dụng
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="configForm.app_name"
              type="text"
              placeholder="Laravel App"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên website
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="configForm.site_name"
              type="text"
              placeholder="Website Demo"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Logo và Favicon -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Logo website
            </label>
            <ImageUploader
              v-model="configForm.site_logo"
              :default-url="configForm.site_logo"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Favicon website
            </label>
            <ImageUploader
              v-model="configForm.site_favicon"
              :default-url="configForm.site_favicon"
            />
          </div>
        </div>

        <!-- Thông tin liên hệ -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email liên hệ
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="configForm.site_email"
              type="email"
              placeholder="admin@demo.com"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              v-model="configForm.site_phone"
              type="tel"
              placeholder="0123456789"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Địa chỉ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <input
            v-model="configForm.site_address"
            type="text"
            placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Mô tả website -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mô tả website
          </label>
          <textarea
            v-model="configForm.site_description"
            placeholder="Website bán hàng trực tuyến..."
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Cài đặt hệ thống -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Múi giờ
            </label>
            <select
              v-model="configForm.timezone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ngôn ngữ
            </label>
            <select
              v-model="configForm.language"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số item mỗi trang
            </label>
            <input
              v-model.number="configForm.items_per_page"
              type="number"
              min="1"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Chế độ bảo trì -->
        <div class="flex items-center">
          <input
            v-model="configForm.maintenance_mode"
            type="checkbox"
            id="maintenance_mode"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="maintenance_mode" class="ml-2 block text-sm text-gray-700">
            Bật chế độ bảo trì
          </label>
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
            :disabled="saving"
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
import ImageUploader from '@/components/Core/Image/ImageUploader.vue'

// Use composables
const { apiClient } = useApiClient()
const { showSuccess, showError } = useToast()

// State
const loading = ref(true)
const saving = ref(false)

// Form state
const configForm = reactive({
  app_name: '',
  site_name: '',
  site_logo: '',
  site_favicon: '',
  site_email: '',
  site_phone: '',
  site_address: '',
  site_description: '',
  timezone: 'Asia/Ho_Chi_Minh',
  language: 'vi',
  maintenance_mode: false,
  items_per_page: 20
})

// Fetch data
onMounted(async () => {
  try {
    await fetchConfig()
  } catch (error) {
    console.error('Error fetching config:', error)
    showError('Không thể tải cấu hình')
  } finally {
    loading.value = false
  }
})

// Fetch config from API
async function fetchConfig() {
  try {
    const response = await apiClient.get('/api/config-v2/general')
    if (response.data.success) {
      Object.assign(configForm, response.data.data)
    }
  } catch (error) {
    console.error('Error fetching config:', error)
    throw error
  }
}

// Save config
async function saveConfig() {
  saving.value = true
  try {
    const response = await apiClient.post('/api/admin/config-v2/general', configForm)
    if (response.data.success) {
      showSuccess('Cấu hình chung đã được lưu thành công')
      Object.assign(configForm, response.data.data)
    }
  } catch (error) {
    console.error('Error saving config:', error)
    showError('Không thể lưu cấu hình')
  } finally {
    saving.value = false
  }
}

// Reset form
function resetForm() {
  fetchConfig()
}
</script>
