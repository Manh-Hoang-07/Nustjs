<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
        <p class="mt-2 text-gray-600">
          Xem lịch sử và trạng thái các đơn hàng của bạn
        </p>
      </div>

      <!-- Filters -->
      <div class="mb-6 bg-white shadow rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">
              Tìm kiếm
            </label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Mã đơn hàng, email..."
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="debouncedSearch"
            />
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option
                v-for="option in ORDER_STATUS_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="payment_status" class="block text-sm font-medium text-gray-700">
              Trạng thái thanh toán
            </label>
            <select
              id="payment_status"
              v-model="filters.payment_status"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option
                v-for="option in PAYMENT_STATUS_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="orders.errorMessage" class="mb-6">
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Đã có lỗi xảy ra
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ orders.errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div v-if="orders.isLoading" class="text-center py-12">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-gray-600">Đang tải đơn hàng...</p>
      </div>

      <div v-else-if="!orders.hasOrders" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Chưa có đơn hàng</h3>
        <p class="mt-1 text-sm text-gray-500">
          Bạn chưa có đơn hàng nào. Bắt đầu mua sắm ngay!
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/home/products"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Xem sản phẩm
          </NuxtLink>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in orders.state.orders"
          :key="order.id"
          class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ order.order_number }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <OrderStatusBadge :status="order.status" />
              <PaymentStatusBadge :status="order.payment_status" />
            </div>
          </div>

          <!-- Order Items Summary -->
          <div class="mb-4">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>{{ order.items?.length || 0 }} sản phẩm</span>
              <span>•</span>
              <span>{{ formatCurrency(order.total_amount) }}</span>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="mb-4 text-sm">
            <p class="text-gray-600">
              <strong>Người nhận:</strong> {{ order.customer_name }}
            </p>
            <p class="text-gray-600">
              <strong>Địa chỉ:</strong> {{ order.shipping_address }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
              <ShippingStatusBadge :status="order.shipping_status" />
            </div>
            <div class="flex space-x-3">
              <NuxtLink
                :to="`/home/orders/${order.id}`"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Xem chi tiết
              </NuxtLink>
              <button
                v-if="order.status === 'pending'"
                @click="cancelOrder(order.id)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="orders.totalPages > 1" class="mt-8">
        <Pagination
          :current-page="orders.currentPage"
          :total-pages="orders.totalPages"
          :total-items="orders.totalOrders"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useOrders } from '~/composables/orders/index'
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from '~/types/orders'
import OrderStatusBadge from '~/components/Orders/Badges/OrderStatusBadge.vue'
import PaymentStatusBadge from '~/components/Orders/Badges/PaymentStatusBadge.vue'
import ShippingStatusBadge from '~/components/Orders/Badges/ShippingStatusBadge.vue'
import LoadingSpinner from '~/components/Core/Loading/LoadingSpinner.vue'
import Pagination from '~/components/Core/Navigation/Pagination.vue'
import { formatCurrency, formatDate } from '~/utils/formatters'

definePageMeta({
  layout: 'home',
  middleware: 'auth'
})

const orders = useOrders({ immediate: true })

// Filters
const filters = reactive({
  search: '',
  status: '',
  payment_status: '',
  shipping_status: '',
  date_from: '',
  date_to: ''
})

let searchTimeout: NodeJS.Timeout | null = null

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  orders.fetchOrders(1, filters)
}

const resetFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.payment_status = ''
  filters.shipping_status = ''
  filters.date_from = ''
  filters.date_to = ''
  orders.fetchOrders(1)
}

const handlePageChange = (page: number) => {
  orders.fetchOrders(page, filters)
}

const cancelOrder = async (orderId: number) => {
  if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    try {
      // This would call the cancel order API
      console.log('Cancelling order:', orderId)
      // await orders.cancelOrder(orderId)
      orders.refreshOrders()
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }
}


onMounted(() => {
  orders.fetchOrders(1, filters)
})
</script>