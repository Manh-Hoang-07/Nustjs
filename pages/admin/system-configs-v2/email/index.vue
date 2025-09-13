<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cài đặt Email V2</h1>
      <p class="text-gray-600 mt-1">Cấu hình SMTP và thông tin email (API V2)</p>
    </div>

    <!-- Form cấu hình email -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <div v-if="loading" class="space-y-6">
        <SkeletonLoader type="form" />
      </div>
      
      <form v-else @submit.prevent="saveConfig" class="space-y-8">
        <!-- SMTP Settings -->
        <div class="border-b border-gray-200 pb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt SMTP</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="configForm.smtp_host"
                type="text"
                placeholder="smtp.gmail.com"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="configForm.smtp_port"
                type="number"
                placeholder="587"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Username
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="configForm.smtp_username"
                type="text"
                placeholder="your-email@gmail.com"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Password
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="configForm.smtp_password"
                type="password"
                placeholder="your-app-password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              SMTP Encryption
            </label>
            <select
              v-model="configForm.smtp_encryption"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <!-- Email Settings -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt Email</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email gửi đi
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="configForm.from_email"
                type="email"
                placeholder="noreply@example.com"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên người gửi
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="configForm.from_name"
                type="text"
                placeholder="Laravel App"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Test Email Button -->
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-blue-800">Test Email</h4>
              <p class="text-sm text-blue-600">Kiểm tra cấu hình email có hoạt động không</p>
            </div>
            <button
              type="button"
              @click="testEmail"
              :disabled="testingEmail"
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="testingEmail">Đang test...</span>
              <span v-else>Test Email</span>
            </button>
          </div>
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
import { useApiClient } from '../../../../composables/api/useApiClient.js'
import { useToast } from '../../../../composables/ui/useToast.js'
import SkeletonLoader from '../../../../components/Core/Loading/SkeletonLoader.vue'

// Use composables
const { apiClient } = useApiClient()
const { showSuccess, showError } = useToast()

// State
const loading = ref(true)
const saving = ref(false)
const testingEmail = ref(false)

// Form state
const configForm = reactive({
  smtp_host: '',
  smtp_port: 587,
  smtp_username: '',
  smtp_password: '',
  smtp_encryption: 'tls',
  from_email: '',
  from_name: ''
})

// Fetch data
onMounted(async () => {
  try {
    await fetchConfig()
  } catch (error) {
    console.error('Error fetching config:', error)
    showError('Không thể tải cấu hình email')
  } finally {
    loading.value = false
  }
})

// Fetch config from API
async function fetchConfig() {
  try {
    const response = await apiClient.get('/api/config-v2/email')
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
    const response = await apiClient.post('/api/admin/config-v2/email', configForm)
    if (response.data.success) {
      showSuccess('Cấu hình email đã được lưu thành công')
      Object.assign(configForm, response.data.data)
    }
  } catch (error) {
    console.error('Error saving config:', error)
    showError('Không thể lưu cấu hình email')
  } finally {
    saving.value = false
  }
}

// Test email
async function testEmail() {
  testingEmail.value = true
  try {
    const response = await apiClient.post('/api/admin/config-v2/test-email', {
      to: configForm.from_email,
      subject: 'Test Email - SystemConfigV2',
      message: 'Đây là email test từ SystemConfigV2'
    })
    if (response.data.success) {
      showSuccess('Email test đã được gửi thành công')
    }
  } catch (error) {
    console.error('Error testing email:', error)
    showError('Không thể gửi email test')
  } finally {
    testingEmail.value = false
  }
}

// Reset form
function resetForm() {
  fetchConfig()
}
</script>
