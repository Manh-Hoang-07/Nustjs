<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          System Config Demo
        </h1>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Đang tải cấu hình hệ thống...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Lỗi khi tải cấu hình
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error.message || 'Có lỗi xảy ra khi tải cấu hình hệ thống' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div v-else-if="data" class="space-y-6">
          <!-- Cache Status -->
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-800">
                  Cache: {{ isCacheValid ? 'Hợp lệ' : 'Hết hạn' }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- System Information -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin Hệ thống</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">Tên hệ thống:</dt>
                <dd class="text-sm text-gray-900 mt-1">{{ systemInfo.name || 'Chưa cấu hình' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Phiên bản:</dt>
                <dd class="text-sm text-gray-900 mt-1">{{ systemInfo.version || 'Chưa cấu hình' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Múi giờ:</dt>
                <dd class="text-sm text-gray-900 mt-1">{{ systemInfo.timezone || 'Chưa cấu hình' }}</dd>
              </div>
            </div>
          </div>
          
          <!-- Raw Data -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Dữ liệu thô</h3>
            <pre class="text-xs text-gray-700 bg-white p-3 rounded border overflow-auto">{{ JSON.stringify(data, null, 2) }}</pre>
          </div>
          
          <!-- Actions -->
          <div class="flex space-x-4">
            <button 
              @click="refresh"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Đang tải...' : 'Làm mới' }}
            </button>
            <button 
              @click="clearCache"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Xóa Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGlobalSystemConfig } from '~/composables/system-config'

// Sử dụng global system config composable
const {
  data,
  loading,
  error,
  isCacheValid,
  systemInfo,
  refresh,
  clearCache
} = useGlobalSystemConfig()

// Tự động load data khi component mount
onMounted(async () => {
  await refresh()
})

// Meta tags
useHead({
  title: 'System Config Demo',
  meta: [
    { name: 'description', content: 'Demo sử dụng System Config với cache 10 phút' }
  ]
})
</script>
