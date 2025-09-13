<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cài đặt Bảo mật</h1>
      <p class="text-gray-600 mt-1">Cấu hình các thông số bảo mật của hệ thống</p>
    </div>

    <!-- Form cấu hình bảo mật -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <div v-if="loading" class="space-y-6">
        <SkeletonLoader type="form" />
      </div>
      
      <form v-else @submit.prevent="saveAllConfigs" class="space-y-8">
        <!-- Cài đặt xác thực -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Cài đặt xác thực</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Thời gian hết hạn token -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thời gian hết hạn token (phút)
              </label>
              <input
                v-model="configForm.token_expiry"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="60"
              />
            </div>

            <!-- Số lần đăng nhập sai tối đa -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số lần đăng nhập sai tối đa
              </label>
              <input
                v-model="configForm.max_login_attempts"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
              />
            </div>

            <!-- Thời gian khóa tài khoản (phút) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thời gian khóa tài khoản (phút)
              </label>
              <input
                v-model="configForm.lockout_duration"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="15"
              />
            </div>

            <!-- Yêu cầu xác thực 2FA -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu xác thực 2FA
              </label>
              <select
                v-model="configForm.require_2fa"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Cài đặt mật khẩu -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Cài đặt mật khẩu</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Độ dài tối thiểu mật khẩu -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Độ dài tối thiểu mật khẩu
              </label>
              <input
                v-model="configForm.min_password_length"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8"
              />
            </div>

            <!-- Yêu cầu chữ hoa -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu chữ hoa
              </label>
              <select
                v-model="configForm.require_uppercase"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>

            <!-- Yêu cầu chữ thường -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu chữ thường
              </label>
              <select
                v-model="configForm.require_lowercase"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>

            <!-- Yêu cầu số -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu số
              </label>
              <select
                v-model="configForm.require_numbers"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>

            <!-- Yêu cầu ký tự đặc biệt -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu ký tự đặc biệt
              </label>
              <select
                v-model="configForm.require_special_chars"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>

            <!-- Thời gian hết hạn mật khẩu (ngày) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thời gian hết hạn mật khẩu (ngày)
              </label>
              <input
                v-model="configForm.password_expiry_days"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="90"
              />
            </div>
          </div>
        </div>

        <!-- Cài đặt phiên đăng nhập -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Cài đặt phiên đăng nhập</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Thời gian hết hạn phiên (phút) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thời gian hết hạn phiên (phút)
              </label>
              <input
                v-model="configForm.session_timeout"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
              />
            </div>

            <!-- Cho phép đăng nhập đồng thời -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cho phép đăng nhập đồng thời
              </label>
              <select
                v-model="configForm.allow_concurrent_login"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>
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
import { useDataTable } from '../../../../composables/data/useDataTable.js'
import { useSystemConfig } from '../../../../composables/api'
import { useToast } from '../../../../composables/ui/useToast.js'
import SkeletonLoader from '../../../../components/Core/Loading/SkeletonLoader.vue'

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters, 
  fetchData, 
  updateFilters, 
  deleteItem 
} = useDataTable('/api/admin/system-configs', {
  defaultFilters: {
    search: '',
    group: 'security',
    status: '',
    sort_by: 'created_at_desc'
  }
})

const { updateConfigsByGroup } = useSystemConfig()
const { showSuccess, showError } = useToast()

// State
const selectedConfig = ref(null)
const saving = ref(false)

// Form state
const configForm = reactive({
  token_expiry: '',
  max_login_attempts: '',
  lockout_duration: '',
  require_2fa: 'false',
  min_password_length: '',
  require_uppercase: 'false',
  require_lowercase: 'false',
  require_numbers: 'false',
  require_special_chars: 'false',
  password_expiry_days: '',
  session_timeout: '',
  allow_concurrent_login: 'false'
})

// Fetch data
onMounted(async () => {
  await fetchData()
  loadConfigToForm()
})

// Load config data to form
function loadConfigToForm() {
  if (items.value && items.value.length > 0) {
    items.value.forEach(config => {
      switch (config.config_key) {
        case 'token_expiry':
          configForm.token_expiry = config.config_value || ''
          break
        case 'max_login_attempts':
          configForm.max_login_attempts = config.config_value || ''
          break
        case 'lockout_duration':
          configForm.lockout_duration = config.config_value || ''
          break
        case 'require_2fa':
          configForm.require_2fa = config.config_value || 'false'
          break
        case 'min_password_length':
          configForm.min_password_length = config.config_value || ''
          break
        case 'require_uppercase':
          configForm.require_uppercase = config.config_value || 'false'
          break
        case 'require_lowercase':
          configForm.require_lowercase = config.config_value || 'false'
          break
        case 'require_numbers':
          configForm.require_numbers = config.config_value || 'false'
          break
        case 'require_special_chars':
          configForm.require_special_chars = config.config_value || 'false'
          break
        case 'password_expiry_days':
          configForm.password_expiry_days = config.config_value || ''
          break
        case 'session_timeout':
          configForm.session_timeout = config.config_value || ''
          break
        case 'allow_concurrent_login':
          configForm.allow_concurrent_login = config.config_value || 'false'
          break
      }
    })
  }
}

// Save all configs
async function saveAllConfigs() {
  saving.value = true
  try {
    const configs = {
      token_expiry: configForm.token_expiry,
      max_login_attempts: configForm.max_login_attempts,
      lockout_duration: configForm.lockout_duration,
      require_2fa: configForm.require_2fa,
      min_password_length: configForm.min_password_length,
      require_uppercase: configForm.require_uppercase,
      require_lowercase: configForm.require_lowercase,
      require_numbers: configForm.require_numbers,
      require_special_chars: configForm.require_special_chars,
      password_expiry_days: configForm.password_expiry_days,
      session_timeout: configForm.session_timeout,
      allow_concurrent_login: configForm.allow_concurrent_login
    }
    
    await updateConfigsByGroup('security', configs)
    showSuccess('Cấu hình bảo mật đã được lưu thành công')
    await fetchData()
  } catch (error) {
    showError('Không thể lưu cấu hình bảo mật')
  } finally {
    saving.value = false
  }
}

// Reset form
function resetForm() {
  loadConfigToForm()
}
</script>

<style>
/* Cho phép cuộn ngang table khi màn hình nhỏ */
.table-responsive {
  overflow-x: auto;
}
</style>