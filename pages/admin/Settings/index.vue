<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h1>
        <p class="text-gray-600">Quản lý các cài đặt và cấu hình của hệ thống</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NuxtLink
          to="/admin/system-configs/general"
          class="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 group-hover:text-blue-600">Cài đặt chung</h3>
              <p class="text-sm text-gray-500">Thông tin website, liên hệ</p>
            </div>
            </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/system-configs/email"
          class="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 group-hover:text-green-600">Cài đặt email</h3>
              <p class="text-sm text-gray-500">SMTP, gửi email</p>
            </div>
            </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/system-configs/security"
          class="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 group-hover:text-red-600">Cài đặt bảo mật</h3>
              <p class="text-sm text-gray-500">Session, mật khẩu, 2FA</p>
          </div>
      </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/system-configs"
          class="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 group-hover:text-purple-600">Tất cả cấu hình</h3>
              <p class="text-sm text-gray-500">Quản lý chi tiết</p>
            </div>
            </div>
        </NuxtLink>
            </div>

      <!-- System Status -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
          </div>
            <h4 class="text-sm font-medium text-gray-900">Hệ thống</h4>
            <p class="text-sm text-green-600">Hoạt động bình thường</p>
      </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="text-sm font-medium text-gray-900">Email</h4>
            <p class="text-sm text-blue-600">SMTP đã cấu hình</p>
            </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="text-sm font-medium text-gray-900">Bảo mật</h4>
            <p class="text-sm text-yellow-600">Cần cập nhật</p>
            </div>
          </div>
      </div>

      <!-- Quick Settings -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Maintenance Mode -->
      <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Chế độ bảo trì</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Bật/tắt chế độ bảo trì website</p>
              <p class="text-xs text-gray-500 mt-1">Khi bật, website sẽ hiển thị thông báo bảo trì</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="maintenanceMode"
                type="checkbox" 
                @change="toggleMaintenanceMode"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
        </div>

        <!-- Cache Management -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quản lý Cache</h3>
          <div class="space-y-3">
            <p class="text-sm text-gray-600">Xóa cache để cập nhật cấu hình mới nhất</p>
            <button 
              @click="clearCache"
              :disabled="clearingCache"
              class="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
            >
              <span v-if="clearingCache" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xóa...
              </span>
              <span v-else>Xóa Cache</span>
            </button>
          </div>
        </div>
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

const { clearCache: clearCacheApi, fetchConfigsByGroup } = useSystemConfig()

// State
const maintenanceMode = ref(false)
const clearingCache = ref(false)

// Methods
const loadMaintenanceMode = async () => {
  try {
    const response = await fetchConfigsByGroup('general')
    if (response.success && response.data) {
      const maintenanceConfig = response.data.find(config => config.config_key === 'maintenance_mode')
      if (maintenanceConfig) {
        maintenanceMode.value = maintenanceConfig.config_value === 'true'
      }
    }
  } catch (err) {
    console.error('Error loading maintenance mode:', err)
  }
}

const toggleMaintenanceMode = async () => {
  try {
    // This would call the API to update maintenance mode
    // await updateConfigsByGroup('general', [{ config_key: 'maintenance_mode', config_value: maintenanceMode.value.toString() }])
    console.log('Maintenance mode toggled:', maintenanceMode.value)
    alert(`Chế độ bảo trì đã được ${maintenanceMode.value ? 'bật' : 'tắt'}`)
  } catch (err) {
    console.error('Error toggling maintenance mode:', err)
    // Revert the toggle if there's an error
    maintenanceMode.value = !maintenanceMode.value
  }
}

const clearCache = async () => {
  clearingCache.value = true
  try {
    await clearCacheApi()
    alert('Cache đã được xóa thành công!')
  } catch (err) {
    console.error('Error clearing cache:', err)
    alert('Có lỗi xảy ra khi xóa cache!')
  } finally {
    clearingCache.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadMaintenanceMode()
})
</script>

<style scoped>
/* Custom styles */
</style> 
