<template>
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
  
  <div v-else-if="error" class="container mx-auto p-4">
    <div class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Lỗi tải dữ liệu
          </h3>
          <div class="mt-2 text-sm text-red-700">
            {{ error }}
          </div>
          <div class="mt-4">
            <button
              @click="loadConfig"
              class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <SystemConfigForm
    v-else-if="config"
    :show="true"
    :config="config"
    :type-enums="typeEnums"
    :group-enums="groupEnums"
    :status-enums="statusEnums"
    :api-errors="apiErrors"
    :on-close="handleClose"
    @updated="handleUpdated"
  />
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/ui/useToast'
import { useAdminSystemConfig } from '@/composables/api/useAdminSystemConfig'
import SystemConfigForm from './form.vue'

const router = useRouter()
const route = useRoute()
const { showSuccess, showError } = useToast()
const { getConfigById, updateConfig, loading, error } = useAdminSystemConfig()

// State
const config = ref(null)
const apiErrors = ref({})

const typeEnums = ref([
  { value: 'string', label: 'Chuỗi' },
  { value: 'integer', label: 'Số nguyên' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'json', label: 'JSON' },
  { value: 'array', label: 'Mảng' },
  { value: 'float', label: 'Số thực' }
])

const groupEnums = ref([
  { value: 'general', label: 'Cài đặt chung', is_public: true },
  { value: 'email', label: 'Cấu hình Email', is_public: false },
  { value: 'database', label: 'Cài đặt Database', is_public: false },
  { value: 'storage', label: 'Cấu hình lưu trữ', is_public: false },
  { value: 'security', label: 'Cài đặt bảo mật', is_public: false },
  { value: 'api', label: 'Cài đặt API', is_public: true },
  { value: 'cache', label: 'Cài đặt Cache', is_public: false },
  { value: 'notification', label: 'Cài đặt thông báo', is_public: false },
  { value: 'payment', label: 'Cài đặt thanh toán', is_public: false },
  { value: 'custom', label: 'Cài đặt tùy chỉnh', is_public: true }
])

const statusEnums = ref([
  { value: 'active', label: 'Hoạt động', class: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Không hoạt động', class: 'bg-red-100 text-red-800' }
])

// Methods
async function loadConfig() {
  const configId = route.params.id
  if (!configId) {
    showError('ID cấu hình không hợp lệ')
    router.push('/admin/system-configs')
    return
  }

  try {
    const configData = await getConfigById(configId)
    if (configData) {
      config.value = configData
    } else {
      showError('Không tìm thấy cấu hình')
      router.push('/admin/system-configs')
    }
  } catch (err) {
    showError('Không thể tải dữ liệu cấu hình')
    router.push('/admin/system-configs')
  }
}

function handleClose() {
  router.push('/admin/system-configs')
}

async function handleUpdated(configData) {
  try {
    await updateConfig(config.value.id, configData)
    showSuccess('Cấu hình đã được cập nhật thành công')
    router.push('/admin/system-configs')
  } catch (err) {
    if (err.response?.data?.errors) {
      apiErrors.value = err.response.data.errors
    } else {
      showError('Không thể cập nhật cấu hình')
    }
  }
}

onMounted(() => {
  loadConfig()
})
</script>

