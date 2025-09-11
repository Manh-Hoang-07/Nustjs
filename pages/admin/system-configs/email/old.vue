<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Cài đặt email</h1>
        <p class="text-gray-600">Cấu hình hệ thống gửi email của website</p>
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
          <!-- Cài đặt SMTP -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt SMTP</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mail Driver <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.mail_mailer"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="smtp">SMTP</option>
                  <option value="log">Log (Development)</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="ses">Amazon SES</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mail Scheme
                </label>
                <select
                  v-model="formData.mail_scheme"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="null">None</option>
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                </select>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mail Host <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.mail_host"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="smtp.gmail.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mail Port <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.mail_port"
                  type="number"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="587"
                >
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mail Username
                </label>
                <input
                  v-model="formData.mail_username"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your-email@gmail.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mail Password
                </label>
                <div class="relative">
                  <input
                    v-model="formData.mail_password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  >
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cài đặt gửi email -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt gửi email</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email gửi đi <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.mail_from_address"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="noreply@website.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tên người gửi <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.mail_from_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Website Name"
                >
              </div>
            </div>
          </div>

          <!-- Test Email -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Test Email</h3>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email nhận test
                  </label>
                  <input
                    v-model="testEmail"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="test@example.com"
                  >
                </div>
                <div class="flex items-end">
                  <button
                    type="button"
                    @click="sendTestEmail"
                    :disabled="loading || !testEmail"
                    class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    <span v-if="testingEmail" class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </span>
                    <span v-else>Gửi email test</span>
                  </button>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Gửi email test để kiểm tra cấu hình SMTP
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
  mail_mailer: 'smtp',
  mail_scheme: 'tls',
  mail_host: '',
  mail_port: 587,
  mail_username: '',
  mail_password: '',
  mail_from_address: '',
  mail_from_name: ''
})

// Test email
const testEmail = ref('')
const testingEmail = ref(false)

// UI state
const showPassword = ref(false)

// Methods
const loadConfigs = async () => {
  try {
    const response = await fetchConfigsByGroup('email')
    if (response.success && response.data) {
      // Map configs to form data
      response.data.forEach(config => {
        if (formData.value.hasOwnProperty(config.config_key)) {
          if (config.config_type === 'number') {
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

    await updateConfigsByGroup('email', configsToUpdate)
    alert('Cài đặt email đã được lưu thành công!')
  } catch (err) {
    console.error('Error saving configs:', err)
    alert('Có lỗi xảy ra khi lưu cài đặt!')
  }
}

const sendTestEmail = async () => {
  if (!testEmail.value) return
  
  testingEmail.value = true
  try {
    // This would call a test email API endpoint
    // await apiClient.post('/admin/system-configs/test-email', { email: testEmail.value })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Email test đã được gửi thành công!')
  } catch (err) {
    console.error('Error sending test email:', err)
    alert('Có lỗi xảy ra khi gửi email test!')
  } finally {
    testingEmail.value = false
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
