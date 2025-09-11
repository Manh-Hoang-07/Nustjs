<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Cài đặt chung</h1>
        <p class="text-gray-600">Cấu hình thông tin cơ bản của website</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="saveConfigs" class="space-y-6">
          <!-- Thông tin website -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin website</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tên website <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.site_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên website"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả website
                </label>
                <input
                  v-model="formData.site_description"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả ngắn về website"
                >
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Logo website
                </label>
                <div class="flex items-center space-x-4">
                  <input
                    v-model="formData.site_logo"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/images/logo.png"
                  >
                  <button
                    type="button"
                    class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Chọn file
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div class="flex items-center space-x-4">
                  <input
                    v-model="formData.site_favicon"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/images/favicon.ico"
                  >
                  <button
                    type="button"
                    class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Chọn file
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Thông tin liên hệ -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email liên hệ
                </label>
                <input
                  v-model="formData.site_email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@website.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  v-model="formData.site_phone"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0123456789"
                >
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                v-model="formData.site_address"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
              ></textarea>
            </div>
          </div>

          <!-- Cài đặt hệ thống -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt hệ thống</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Múi giờ <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.timezone"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                  <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                  <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                  <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Đơn vị tiền tệ <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.currency"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="VND">VND - Việt Nam Đồng</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="THB">THB - Thai Baht</option>
                </select>
              </div>
            </div>

            <div class="mt-6">
              <label class="flex items-center">
                <input
                  v-model="formData.maintenance_mode"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-900">
                  Bật chế độ bảo trì website
                </span>
              </label>
              <p class="mt-1 text-sm text-gray-500">
                Khi bật, website sẽ hiển thị thông báo bảo trì cho người dùng
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </span>
              <span v-else>Lưu cài đặt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, onMounted } from 'vue'
import { useSystemConfig } from '../../../composables/api'

const {
  loading,
  error,
  fetchConfigsByGroup,
  updateConfigsByGroup
} = useSystemConfig()

// Form data
const formData = ref({
  site_name: '',
  site_description: '',
  site_logo: '',
  site_favicon: '',
  site_address: '',
  site_phone: '',
  site_email: '',
  timezone: 'Asia/Ho_Chi_Minh',
  currency: 'VND',
  maintenance_mode: false
})

// Methods
const loadConfigs = async () => {
  try {
    const response = await fetchConfigsByGroup('general')
    if (response.success && response.data) {
      // Map configs to form data
      response.data.forEach(config => {
        if (formData.value.hasOwnProperty(config.config_key)) {
          if (config.config_type === 'boolean') {
            formData.value[config.config_key] = config.config_value === 'true'
          } else {
            formData.value[config.config_key] = config.config_value
          }
        }
      })
    }
  } catch (err) {
    console.error('Error loading configs:', err)
  }
}

const saveConfigs = async () => {
  try {
    const configsToUpdate = Object.keys(formData.value).map(key => ({
      config_key: key,
      config_value: formData.value[key].toString()
    }))

    await updateConfigsByGroup('general', configsToUpdate)
    alert('Cài đặt đã được lưu thành công!')
  } catch (err) {
    console.error('Error saving configs:', err)
    alert('Có lỗi xảy ra khi lưu cài đặt!')
  }
}

const resetForm = () => {
  loadConfigs()
}

// Lifecycle
onMounted(() => {
  loadConfigs()
})
</script>
