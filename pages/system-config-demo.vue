<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8">Demo System Config</h1>
      
      <!-- Loading state -->
      <div v-if="isConfigLoading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2">Đang tải cấu hình hệ thống...</p>
      </div>

      <!-- Config loaded -->
      <div v-else-if="isConfigLoaded" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-2xl font-bold mb-4">Thông tin hệ thống</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold mb-3">Thông tin cơ bản</h3>
              <div class="space-y-2">
                <p><strong>Tên website:</strong> {{ siteInfo.name }}</p>
                <p><strong>Email:</strong> {{ siteInfo.email || 'Chưa cấu hình' }}</p>
                <p><strong>Số điện thoại:</strong> {{ siteInfo.phone || 'Chưa cấu hình' }}</p>
                <p><strong>Địa chỉ:</strong> {{ siteInfo.address || 'Chưa cấu hình' }}</p>
                <p><strong>Mô tả:</strong> {{ siteInfo.description || 'Chưa cấu hình' }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-3">Mạng xã hội</h3>
              <div v-if="Object.keys(socialLinks).length > 0" class="space-y-2">
                <p v-if="socialLinks.facebook"><strong>Facebook:</strong> {{ socialLinks.facebook }}</p>
                <p v-if="socialLinks.twitter"><strong>Twitter:</strong> {{ socialLinks.twitter }}</p>
                <p v-if="socialLinks.instagram"><strong>Instagram:</strong> {{ socialLinks.instagram }}</p>
                <p v-if="socialLinks.youtube"><strong>YouTube:</strong> {{ socialLinks.youtube }}</p>
              </div>
              <p v-else class="text-gray-500">Chưa cấu hình mạng xã hội</p>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-3">Raw Config Data</h3>
            <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(contactInfo, null, 2) }}</pre>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Actions</h2>
          <div class="space-x-4">
            <button 
              @click="refreshConfig"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Config
            </button>
            <button 
              @click="loadConfig(true)"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Force Reload
            </button>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="text-center">
        <p class="text-red-600">Không thể tải cấu hình hệ thống</p>
        <button 
          @click="loadConfig(true)"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSystemConfigInfo } from '@/composables/system/useSystemConfig'

const { 
  siteInfo, 
  contactInfo, 
  socialLinks, 
  isConfigLoaded, 
  isConfigLoading, 
  refreshConfig, 
  loadConfig 
} = useSystemConfigInfo()

// Set page title
useHead({
  title: 'System Config Demo'
})
</script>
