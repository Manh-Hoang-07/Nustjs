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

    <!-- Form tĩnh cho cấu hình payment -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="saveAllConfigs" class="space-y-6">
        <!-- Payment Gateway -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cổng thanh toán
            </label>
            <p class="text-sm text-gray-500">Cổng thanh toán chính</p>
          </div>
          <div class="md:col-span-2">
            <select
              v-model="configs.payment_gateway"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="vnpay">VNPay</option>
              <option value="momo">MoMo</option>
            </select>
          </div>
        </div>

        <!-- Payment Currency -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Đơn vị tiền tệ
            </label>
            <p class="text-sm text-gray-500">Đơn vị tiền tệ mặc định</p>
          </div>
          <div class="md:col-span-2">
            <select
              v-model="configs.payment_currency"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="VND">VND (Việt Nam Đồng)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="JPY">JPY (Japanese Yen)</option>
            </select>
          </div>
        </div>

        <!-- Payment Mode -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Chế độ thanh toán
            </label>
            <p class="text-sm text-gray-500">Chế độ test hoặc live</p>
          </div>
          <div class="md:col-span-2">
            <select
              v-model="configs.payment_mode"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="test">Test Mode</option>
              <option value="live">Live Mode</option>
            </select>
          </div>
        </div>

        <!-- Payment Timeout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Timeout thanh toán (phút)
            </label>
            <p class="text-sm text-gray-500">Thời gian timeout cho giao dịch</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.payment_timeout"
              type="number"
              min="5"
              max="60"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="15"
            />
          </div>
        </div>

        <!-- Payment Retry -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số lần thử lại
            </label>
            <p class="text-sm text-gray-500">Số lần thử lại khi thanh toán thất bại</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.payment_retry"
              type="number"
              min="1"
              max="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3"
            />
          </div>
        </div>

        <!-- Payment Logging -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ghi log thanh toán
            </label>
            <p class="text-sm text-gray-500">Ghi lại các giao dịch thanh toán</p>
          </div>
          <div class="md:col-span-2">
            <label class="flex items-center">
              <input
                v-model="configs.payment_logging"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Bật ghi log thanh toán</span>
            </label>
          </div>
        </div>

        <!-- Payment Webhook -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <p class="text-sm text-gray-500">URL nhận webhook từ cổng thanh toán</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model="configs.payment_webhook_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/webhook/payment"
            />
          </div>
        </div>

        <!-- Payment Refund -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cho phép hoàn tiền
            </label>
            <p class="text-sm text-gray-500">Cho phép hoàn tiền cho khách hàng</p>
          </div>
          <div class="md:col-span-2">
            <label class="flex items-center">
              <input
                v-model="configs.payment_refund"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Cho phép hoàn tiền</span>
            </label>
          </div>
        </div>

        <!-- Payment Refund Days -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số ngày hoàn tiền
            </label>
            <p class="text-sm text-gray-500">Số ngày cho phép hoàn tiền</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.payment_refund_days"
              type="number"
              min="1"
              max="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="7"
            />
          </div>
        </div>

        <!-- Payment Fee -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Phí thanh toán (%)
            </label>
            <p class="text-sm text-gray-500">Phí thanh toán tính theo %</p>
          </div>
          <div class="md:col-span-2">
            <input
              v-model.number="configs.payment_fee"
              type="number"
              min="0"
              max="10"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2.5"
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
  title: 'Cài đặt thanh toán',
  description: 'Cấu hình các thông số thanh toán và cổng thanh toán',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, computed } from 'vue'
import { useToast } from '@/composables/ui/useToast'
import { useGlobalApiClient } from '@/composables/api'

// Props - không cần thiết cho form tĩnh
// const props = defineProps({
//   group: {
//     type: String,
//     default: 'payment'
//   }
// })

// Composables
const { showToast } = useToast()
const { apiClient } = useGlobalApiClient()

// Reactive data
const saving = ref(false)

// Form data - tĩnh cho nhóm payment
const configs = ref({
  payment_gateway: 'stripe',
  payment_currency: 'VND',
  payment_mode: 'test',
  payment_timeout: 15,
  payment_retry: 3,
  payment_logging: true,
  payment_webhook_url: '',
  payment_refund: true,
  payment_refund_days: 7,
  payment_fee: 2.5
})

// Computed
const pageTitle = computed(() => 'Cài đặt thanh toán')
const groupDescription = computed(() => 'Cấu hình các thông số thanh toán và cổng thanh toán')

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
    
    // Gọi API bulk update
    await apiClient.put('/api/admin/system-configs/bulk-update', { configs: bulkData })
    
    showToast({
      type: 'success',
      title: 'Thành công',
      message: 'Đã lưu cấu hình thanh toán thành công!'
    })
  } catch (error) {
    showToast({
      type: 'error',
      title: 'Lỗi',
      message: 'Không thể lưu cấu hình thanh toán!'
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
