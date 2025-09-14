<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Cài đặt bảo mật</h1>
        <p class="text-gray-600">Cấu hình các thiết lập bảo mật cho hệ thống</p>
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
          <!-- Cài đặt Session -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt Session</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian session (phút) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.session_lifetime"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="120"
                >
                <p class="mt-1 text-sm text-gray-500">
                  Thời gian hết hạn session (tính bằng phút)
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Giới hạn request (phút) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.rate_limit_requests"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                >
                <p class="mt-1 text-sm text-gray-500">
                  Số request tối đa mỗi phút
                </p>
              </div>
            </div>
          </div>

          <!-- Cài đặt đăng nhập -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt đăng nhập</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Số lần đăng nhập sai tối đa <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.max_login_attempts"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                >
                <p class="mt-1 text-sm text-gray-500">
                  Số lần đăng nhập sai trước khi khóa tài khoản
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian khóa tài khoản (phút) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.lockout_duration"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15"
                >
                <p class="mt-1 text-sm text-gray-500">
                  Thời gian khóa tài khoản sau khi đăng nhập sai
                </p>
              </div>
            </div>
          </div>

          <!-- Cài đặt mật khẩu -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt mật khẩu</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Độ dài mật khẩu tối thiểu <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.password_min_length"
                  type="number"
                  required
                  min="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8"
                >
                <p class="mt-1 text-sm text-gray-500">
                  Số ký tự tối thiểu cho mật khẩu
                </p>
              </div>
            </div>

            <div class="mt-6 space-y-4">
              <h4 class="text-sm font-medium text-gray-900">Yêu cầu mật khẩu phải có:</h4>
              
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="formData.require_uppercase"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-900">
                    Chữ hoa (A-Z)
                  </span>
                </label>

                <label class="flex items-center">
                  <input
                    v-model="formData.require_numbers"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-900">
                    Số (0-9)
                  </span>
                </label>

                <label class="flex items-center">
                  <input
                    v-model="formData.require_special_chars"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-900">
                    Ký tự đặc biệt (!@#$%^&*)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Cài đặt xác thực 2 yếu tố -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Xác thực 2 yếu tố</h3>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <label class="flex items-center">
                <input
                  v-model="formData.two_factor_enabled"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm font-medium text-gray-900">
                  Bật xác thực 2 yếu tố (2FA)
                </span>
              </label>
              <p class="mt-2 text-sm text-gray-600">
                Khi bật, người dùng sẽ cần xác thực qua ứng dụng di động hoặc SMS để đăng nhập
              </p>
            </div>
          </div>

          <!-- Cài đặt bảo mật nâng cao -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Bảo mật nâng cao</h3>
            
            <div class="space-y-4">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div class="ml-3">
                    <h4 class="text-sm font-medium text-yellow-800">Cảnh báo bảo mật</h4>
                    <p class="mt-1 text-sm text-yellow-700">
                      Các cài đặt bảo mật này ảnh hưởng đến toàn bộ hệ thống. 
                      Vui lòng cẩn thận khi thay đổi.
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian khóa IP (phút)
                  </label>
                  <input
                    v-model="formData.ip_lockout_duration"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="60"
                  >
                  <p class="mt-1 text-sm text-gray-500">
                    Thời gian khóa IP sau khi vượt quá giới hạn request
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Số lần thử đăng nhập từ IP
                  </label>
                  <input
                    v-model="formData.ip_max_attempts"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                  >
                  <p class="mt-1 text-sm text-gray-500">
                    Số lần thử đăng nhập tối đa từ một IP
                  </p>
                </div>
              </div>
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
              class="px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </span>
              <span v-else>Lưu cài đặt bảo mật</span>
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
import { useSystemConfig } from '@/composables/api'

const {
  loading,
  error,
  fetchConfigsByGroup,
  updateConfigsByGroup
} = useSystemConfig()

// Form data
const formData = ref({
  session_lifetime: 120,
  max_login_attempts: 5,
  lockout_duration: 15,
  password_min_length: 8,
  require_uppercase: true,
  require_numbers: true,
  require_special_chars: true,
  two_factor_enabled: false,
  rate_limit_requests: 100,
  ip_lockout_duration: 60,
  ip_max_attempts: 10
})

// Methods
const loadConfigs = async () => {
  try {
    const response = await fetchConfigsByGroup('security')
    if (response.success && response.data) {
      // Map configs to form data
      response.data.forEach(config => {
        if (formData.value.hasOwnProperty(config.config_key)) {
          if (config.config_type === 'boolean') {
            formData.value[config.config_key] = config.config_value === 'true'
          } else if (config.config_type === 'number') {
            formData.value[config.config_key] = parseInt(config.config_value) || 0
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

    await updateConfigsByGroup('security', configsToUpdate)
    alert('Cài đặt bảo mật đã được lưu thành công!')
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
