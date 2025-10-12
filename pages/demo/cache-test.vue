<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          System Config Cache Test
        </h1>
        
        <!-- Cache Status -->
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-blue-900">Cache Status</h3>
              <p class="text-sm text-blue-700">
                Cache: {{ isCacheValid ? '✅ Hợp lệ' : '❌ Hết hạn' }} | 
                TTL: 10 phút
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-blue-700">
                Last updated: {{ lastUpdated }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- System Info -->
        <div v-if="data" class="bg-gray-50 rounded-lg p-6 mb-6">
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
        
        <!-- Cache Info -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Cache Information</h3>
          <div class="space-y-2 text-sm">
            <p><strong>Cache Key:</strong> system-config-cache</p>
            <p><strong>Storage:</strong> localStorage</p>
            <p><strong>TTL:</strong> 10 phút (600,000ms)</p>
            <p><strong>Cache Size:</strong> {{ cacheSize }}</p>
            <p><strong>Cache Status:</strong> {{ cacheStatus }}</p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-wrap gap-4">
          <button 
            @click="refresh"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Đang tải...' : 'Làm mới' }}
          </button>
          <button 
            @click="clearCache"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Xóa Cache
          </button>
          <button 
            @click="forceRefresh"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Force Refresh
          </button>
          <button 
            @click="checkCache"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Kiểm tra Cache
          </button>
        </div>
        
        <!-- Console Logs -->
        <div class="mt-6 bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
          <h4 class="text-white mb-2">Console Logs:</h4>
          <div class="space-y-1">
            <p v-for="log in logs" :key="log.id" class="text-xs">
              [{{ log.time }}] {{ log.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useGlobalSystemConfig } from '~/composables/system-config'

// Sử dụng global system config composable
const {
  data,
  loading,
  error,
  isCacheValid,
  systemInfo,
  refresh,
  clearCache,
  getConfigValue
} = useGlobalSystemConfig()

// Logs để track cache behavior
const logs = ref<Array<{id: number, time: string, message: string}>>([])

const addLog = (message: string) => {
  logs.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    message
  })
  // Giữ tối đa 10 logs
  if (logs.value.length > 10) {
    logs.value = logs.value.slice(0, 10)
  }
}

// Computed properties
const lastUpdated = computed(() => {
  if (!data.value) return 'Chưa có dữ liệu'
  return new Date().toLocaleString()
})

const cacheSize = computed(() => {
  if (typeof window === 'undefined') return 'N/A'
  try {
    const cached = localStorage.getItem('system-config-cache')
    return cached ? `${Math.round(cached.length / 1024 * 100) / 100} KB` : '0 KB'
  } catch {
    return 'N/A'
  }
})

const cacheStatus = computed(() => {
  if (typeof window === 'undefined') return 'SSR'
  try {
    const cached = localStorage.getItem('system-config-cache')
    if (!cached) return 'Không có cache'
    
    const parsed = JSON.parse(cached)
    const isExpired = Date.now() - parsed.timestamp > parsed.ttl
    return isExpired ? 'Hết hạn' : 'Hợp lệ'
  } catch {
    return 'Lỗi cache'
  }
})

// Methods
const forceRefresh = async () => {
  addLog('🔄 Force refresh initiated...')
  await refresh()
  addLog('✅ Force refresh completed')
}

const checkCache = () => {
  addLog('🔍 Checking cache status...')
  addLog(`Cache valid: ${isCacheValid.value}`)
  addLog(`Cache size: ${cacheSize.value}`)
  addLog(`Cache status: ${cacheStatus.value}`)
}

// Tự động load data khi component mount
onMounted(async () => {
  addLog('🚀 Component mounted, loading system config...')
  await refresh()
  addLog('✅ System config loaded')
})

// Meta tags
useHead({
  title: 'System Config Cache Test',
  meta: [
    { name: 'description', content: 'Test page for system config cache functionality' }
  ]
})
</script>

