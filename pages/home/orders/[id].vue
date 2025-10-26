<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            <p v-if="order.state.currentOrder" class="mt-2 text-gray-600">
              Mã đơn hàng: {{ order.state.currentOrder.order_number }}
            </p>
          </div>
          <NuxtLink
            to="/home/orders"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Quay lại danh sách
          </NuxtLink>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="order.errorMessage" class="mb-6">
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
                {{ order.errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="order.isLoading" class="text-center py-12">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
      </div>

      <!-- Order Details -->
      <div v-else-if="order.state.currentOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Status -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Trạng thái đơn hàng</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-1">Trạng thái</p>
                <OrderStatusBadge :status="order.state.currentOrder.status" size="lg" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Thanh toán</p>
                <PaymentStatusBadge :status="order.state.currentOrder.payment_status" size="lg" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Vận chuyển</p>
                <ShippingStatusBadge :status="order.state.currentOrder.shipping_status" size="lg" />
              </div>
            </div>
            
            <!-- Order Timeline -->
            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Lịch sử sử</h3>
              <div class="space-y-3">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg class="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">Đặt hàng thành công</p>
                    <p class="text-sm text-gray-500">{{ formatDate(order.state.currentOrder.created_at) }}</p>
                  </div>
                </div>
                
                <div v-if="order.state.currentOrder.confirmed_at" class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 00-.567.267z" />
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">Đã xác nhận</p>
                    <p class="text-sm text-gray-500">{{ formatDate(order.state.currentOrder.confirmed_at) }}</p>
                  </div>
                </div>
                
                <div v-if="order.state.currentOrder.shipping_status === 'shipped'" class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg class="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-7a1 1 0 00-1-1h-3z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">Đang giao hàng</p>
                    <p class="text-sm text-gray-500">Đơn hàng đang được vận chuyển</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Sản phẩm</h2>
            <div class="space-y-4">
              <OrderItem
                v-for="item in order.state.currentOrder.items"
                :key="item.id"
                :item="item"
              />
            </div>
          </div>

          <!-- Notes -->
          <div v-if="order.state.currentOrder.notes" class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Ghi chú</h2>
            <p class="text-sm text-gray-600">{{ order.state.currentOrder.notes }}</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Customer Info -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Thông tin khách hàng</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-600">Họ tên</p>
                <p class="text-sm font-medium text-gray-900">{{ order.state.currentOrder.customer_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="text-sm font-medium text-gray-900">{{ order.state.currentOrder.customer_email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Điện thoại</p>
                <p class="text-sm font-medium text-gray-900">{{ order.state.currentOrder.customer_phone }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Địa chỉ giao hàng</h2>
            <p class="text-sm text-gray-600">{{ order.state.currentOrder.shipping_address }}</p>
          </div>

          <!-- Order Summary -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tạm tính:</span>
                <span class="font-medium">{{ formatCurrency(order.state.currentOrder.subtotal || 0) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Phí vận chuyển:</span>
                <span class="font-medium">{{ formatCurrency(order.state.currentOrder.shipping_cost || 0) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Thuế:</span>
                <span class="font-medium">{{ formatCurrency(order.state.currentOrder.tax || 0) }}</span>
              </div>
              
              <div class="border-t pt-3">
                <div class="flex justify-between">
                  <span class="text-base font-medium text-gray-900">Tổng cộng:</span>
                  <span class="text-base font-bold text-gray-900">{{ formatCurrency(order.state.currentOrder.total_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mt-4 pt-4 border-t">
              <p class="text-sm text-gray-600">Phương thức thanh toán:</p>
              <p class="text-sm font-medium text-gray-900">{{ getPaymentMethodLabel(order.state.currentOrder.payment_method) }}</p>
            </div>

            <!-- Shipping Method -->
            <div class="mt-3">
              <p class="text-sm text-gray-600">Phương thức vận chuyển:</p>
              <p class="text-sm font-medium text-gray-900">{{ getShippingMethodLabel(order.state.currentOrder.shipping_method) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Thao tác</h2>
            <div class="space-y-3">
              <button
                v-if="order.state.currentOrder.status === 'pending'"
                @click="cancelOrder"
                class="w-full px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
              >
                Hủy đơn hàng
              </button>
              
              <button
                v-if="order.state.currentOrder.payment_status === 'pending'"
                @click="processPayment"
                class="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Thanh toán ngay
              </button>
              
              <button
                @click="printOrder"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                In đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrders } from '~/composables/orders/index'
import type { PaymentMethod, ShippingMethod } from '~/types/orders'
import OrderStatusBadge from '~/components/Orders/Badges/OrderStatusBadge.vue'
import PaymentStatusBadge from '~/components/Orders/Badges/PaymentStatusBadge.vue'
import ShippingStatusBadge from '~/components/Orders/Badges/ShippingStatusBadge.vue'
import OrderItem from '~/pages/home/components/orders/OrderItem.vue'
import LoadingSpinner from '~/components/Core/Loading/LoadingSpinner.vue'
import { formatCurrency, formatDate } from '~/utils/formatters'

definePageMeta({
  layout: 'home',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const order = useOrders()

const getPaymentMethodLabel = (method: PaymentMethod) => {
  const labels = {
    cod: 'Thanh toán khi nhận hàng',
    bank_transfer: 'Chuyển khoản ngân hàng',
    credit_card: 'Thẻ tín dụng',
    debit_card: 'Thẻ ghi nợ',
    ewallet: 'Ví điện tử'
  }
  return labels[method] || method
}

const getShippingMethodLabel = (method: ShippingMethod) => {
  const labels = {
    standard: 'Giao hàng tiêu chuẩn',
    express: 'Giao hàng nhanh',
    overnight: 'Giao hàng trong ngày',
    pickup: 'Nhận tại cửa hàng'
  }
  return labels[method] || method
}


const cancelOrder = async () => {
  if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    try {
      // This would call the cancel order API
      console.log('Cancelling order:', order.state.currentOrder?.id)
      // await orders.cancelOrder(order.state.currentOrder.id)
      router.push('/home/orders')
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }
}

const processPayment = async () => {
  try {
    // This would redirect to payment page or open payment modal
    console.log('Processing payment for order:', order.state.currentOrder?.id)
    // await orders.processPayment(order.state.currentOrder.id, paymentData)
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}

const printOrder = () => {
  window.print()
}

onMounted(() => {
  const orderId = parseInt(route.params.id as string)
  if (orderId) {
    order.fetchOrder(orderId)
  }
})
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>