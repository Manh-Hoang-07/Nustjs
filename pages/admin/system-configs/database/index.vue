<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
        <p class="text-gray-600 mt-1">{{ groupDescription }}</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="saveAllConfigs" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          :disabled="saving"
        >
          {{ saving ? 'Đang lưu...' : 'Lưu tất cả' }}
        </button>
      </div>
    </div>

    <!-- Form tĩnh cho cấu hình database -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="saveAllConfigs" class="space-y-6">
        <!-- Database Host -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Database Host
            </label>
            <p class="text-sm text-gray-500">Địa chỉ máy chủ database</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model="configs.db_host"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="localhost"
            />
          </div>
        </div>

        <!-- Database Port -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Database Port
            </label>
            <p class="text-sm text-gray-500">Cổng kết nối database</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.db_port"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3306"
            />
          </div>
        </div>

        <!-- Database Name -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên Database
            </label>
            <p class="text-sm text-gray-500">Tên cơ sở dữ liệu</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model="configs.db_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my_database"
            />
          </div>
        </div>

        <!-- Database Username -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập Database
            </label>
            <p class="text-sm text-gray-500">Username kết nối database</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model="configs.db_username"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="root"
            />
          </div>
        </div>

        <!-- Database Password -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu Database
            </label>
            <p class="text-sm text-gray-500">Password kết nối database</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model="configs.db_password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Database Charset -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Bộ ký tự Database
            </label>
            <p class="text-sm text-gray-500">Charset của database</p>
          </div>
          <div class="md:col-span-2">
            <select
              v-model="configs.db_charset"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="utf8mb4">utf8mb4</option>
              <option value="utf8">utf8</option>
              <option value="latin1">latin1</option>
            </select>
          </div>
        </div>

        <!-- Connection Pool Size -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kích thước Pool
            </label>
            <p class="text-sm text-gray-500">Số kết nối tối đa trong pool</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.db_pool_size"
              type="number"
              min="1"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
            />
          </div>
        </div>

        <!-- Connection Timeout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Timeout kết nối (giây)
            </label>
            <p class="text-sm text-gray-500">Thời gian timeout khi kết nối</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.db_timeout"
              type="number"
              min="5"
              max="300"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>
        </div>

        <!-- Query Log -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ghi log Query
            </label>
            <p class="text-sm text-gray-500">Ghi lại các câu query</p>
          </div>
          <div class="md:col-span-2">
            <label class="flex items-center">
              <input
                v-model="configs.db_query_log"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Bật ghi log query</span>
            </label>
          </div>
        </div>

        <!-- Slow Query Log -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ghi log Query chậm
            </label>
            <p class="text-sm text-gray-500">Ghi lại query chậm hơn ngưỡng</p>
          </div>
          <div class="md:col-span-2">
            <label class="flex items-center">
              <input
                v-model="configs.db_slow_query_log"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Bật ghi log query chậm</span>
            </label>
          </div>
        </div>

        <!-- Slow Query Threshold -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ngưỡng Query chậm (giây)
            </label>
            <p class="text-sm text-gray-500">Thời gian để coi là query chậm</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.db_slow_query_threshold"
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2.0"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: 'admin-layout',
  title: 'Cài đặt Database',
  description: 'Cấu hình các thông số kết nối và quản lý database',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, computed } from 'vue'
import { useToast } from '@/composables/ui/useToast'
import { useApiClient } from '@/composables/api/useApiClient'
import { adminEndpoints } from '@/api/endpoints/admin'

// Props - không cần thiết cho form tĩnh
// const props = defineProps({
//   group: {
//     type: String,
//     default: 'database'
//   }
// })

// Composables
const { showToast } = useToast()
const { apiClient } = useApiClient()

// Reactive data
const saving = ref(false)

// Form data - tĩnh cho nhóm database
const configs = ref({
  db_host: 'localhost',
  db_port: 3306,
  db_name: 'my_database',
  db_username: 'root',
  db_password: '',
  db_charset: 'utf8mb4',
  db_pool_size: 10,
  db_timeout: 30,
  db_query_log: false,
  db_slow_query_log: true,
  db_slow_query_threshold: 2.0
})

// Computed
const pageTitle = computed(() => 'Cài đặt Database')
const groupDescription = computed(() => 'Cấu hình các thông số kết nối và quản lý database')

// Methods
const saveAllConfigs = async () => {
  saving.value = true
  try {
    // Chuyển đổi configs thành format API
    const bulkData = {
      configs: Object.entries(configs.value).map(([key, value]) => ({
        key: key,
        value: String(value)
      }))
    }
    
    // Gọi API bulk update trực tiếp
    const response = await apiClient.post(adminEndpoints.systemConfigs.bulkUpdate, bulkData)
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: 'Thành công',
        message: 'Đã lưu cấu hình database thành công!'
      })
    } else {
      throw new Error(response.data.message || 'Failed to save configs')
    }
  } catch (error) {
    showToast({
      type: 'error',
      title: 'Lỗi',
      message: 'Không thể lưu cấu hình database!'
    })
  } finally {
    saving.value = false
  }
}

// Lifecycle - không cần thiết cho form tĩnh
// onMounted(() => {
//   // Load configs from API if needed
//   // For now, using static data
// })
</script>
