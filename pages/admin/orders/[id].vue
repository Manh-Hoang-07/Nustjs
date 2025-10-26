<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            <p v-if="orderManagement.state.currentOrder" class="mt-2 text-gray-600">
              Mã đơn hàng: {{ orderManagement.state.currentOrder.order_number }}
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="printOrder"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              In đơn hàng
            </button>
            <NuxtLink
              to="/admin/orders"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Quay lại
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="orderManagement.errorMessage" class="mb-6">
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
                {{ orderManagement.errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="orderManagement.isLoading" class="text-center py-12">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
      </div>

      <!-- Order Details -->
      <div v-else-if="orderManagement.state.currentOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Status & Actions -->
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-medium text-gray-900">Trạng thái đơn hàng</h2>
              <div class="flex items-center space-x-2">
                <OrderStatusBadge :status="orderManagement.state.currentOrder.status" size="lg" />
                <PaymentStatusBadge :status="orderManagement.state.currentOrder.payment_status" size="lg" />
                <ShippingStatusBadge :status="orderManagement.state.currentOrder.shipping_status" size="lg" />
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-if="orderManagement.state.currentOrder.status === 'pending'"
                @click="confirmOrder"
                :disabled="actionLoading"
                class="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <LoadingSpinner v-if="actionLoading" size="sm" class="mr-2" />
                Xác nhận
              </button>
              
              <button
                v-if="orderManagement.state.currentOrder.status === 'confirmed'"
                @click="markAsPreparing"
                :disabled="actionLoading"
                class="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                <LoadingSpinner v-if="actionLoading" size="sm" class="mr-2" />
                Chuẩn bị
              </button>
              
              <button
                v-if="orderManagement.state.currentOrder.status === 'preparing'"
                @click="markAsShipped"
                :disabled="actionLoading"
                class="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <LoadingSpinner v-if="actionLoading" size="sm" class="mr-2" />
                Giao hàng
              </button>
              
              <button
                v-if="orderManagement.state.currentOrder.status === 'shipped'"
                @click="markAsDelivered"
                :disabled="actionLoading"
                class="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <LoadingSpinner v-if="actionLoading" size="sm" class="mr-2" />
                Đã giao
              </button>
              
              <button
                v-if="['pending', 'confirmed'].includes(orderManagement.state.currentOrder.status)"
                @click="cancelOrder"
                :disabled="actionLoading"
                class="px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
              >
                <LoadingSpinner v-if="actionLoading" size="sm" class="mr-2" />
                Hủy
              </button>
              
              <button
                @click="recalculateOrder"
                :disabled="actionLoading"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <LoadingSpinner v-if="actionLoading" size="sm" class="mr-2" />
                Tính lại
              </button>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-gray-900">Sản phẩm</h2>
              <button
                @click="showAddItemModal = true"
                class="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm sản phẩm
              </button>
            </div>
            <div class="space-y-4">
              <OrderItem
                v-for="item in orderManagement.state.currentOrder.items"
                :key="item.id"
                :item="item"
                :show-actions="true"
                @edit="editItem"
                @delete="deleteItem"
              />
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Lịch sử sử</h2>
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
                  <p class="text-sm text-gray-500">{{ formatDate(orderManagement.state.currentOrder.created_at) }}</p>
                </div>
              </div>
              
              <div v-if="orderManagement.state.currentOrder.confirmed_at" class="flex items-start">
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
                  <p class="text-sm text-gray-500">{{ formatDate(orderManagement.state.currentOrder.confirmed_at) }}</p>
                </div>
              </div>
            </div>
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
                <p class="text-sm font-medium text-gray-900">{{ orderManagement.state.currentOrder.customer_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="text-sm font-medium text-gray-900">{{ orderManagement.state.currentOrder.customer_email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Điện thoại</p>
                <p class="text-sm font-medium text-gray-900">{{ orderManagement.state.currentOrder.customer_phone }}</p>
              </div>
              <div v-if="orderManagement.state.currentOrder.user">
                <p class="text-sm text-gray-600">Tài khoản</p>
                <p class="text-sm font-medium text-gray-900">{{ orderManagement.state.currentOrder.user.name }}</p>
                <p class="text-xs text-gray-500">{{ orderManagement.state.currentOrder.user.email }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Địa chỉ giao hàng</h2>
            <p class="text-sm text-gray-600">{{ orderManagement.state.currentOrder.shipping_address }}</p>
          </div>

          <!-- Order Summary -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tạm tính:</span>
                <span class="font-medium">{{ formatCurrency(orderManagement.state.currentOrder.subtotal || 0) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Phí vận chuyển:</span>
                <span class="font-medium">{{ formatCurrency(orderManagement.state.currentOrder.shipping_cost || 0) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Thuế:</span>
                <span class="font-medium">{{ formatCurrency(orderManagement.state.currentOrder.tax || 0) }}</span>
              </div>
              
              <div class="border-t pt-3">
                <div class="flex justify-between">
                  <span class="text-base font-medium text-gray-900">Tổng cộng:</span>
                  <span class="text-base font-bold text-gray-900">{{ formatCurrency(orderManagement.state.currentOrder.total_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mt-4 pt-4 border-t">
              <p class="text-sm text-gray-600">Phương thức thanh toán:</p>
              <p class="text-sm font-medium text-gray-900">{{ getPaymentMethodLabel(orderManagement.state.currentOrder.payment_method) }}</p>
            </div>

            <!-- Shipping Method -->
            <div class="mt-3">
              <p class="text-sm text-gray-600">Phương thức vận chuyển:</p>
              <p class="text-sm font-medium text-gray-900">{{ getShippingMethodLabel(orderManagement.state.currentOrder.shipping_method) }}</p>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="orderManagement.state.currentOrder.notes" class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Ghi chú</h2>
            <p class="text-sm text-gray-600">{{ orderManagement.state.currentOrder.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <Modal
      v-if="showAddItemModal"
      @close="showAddItemModal = false"
      title="Thêm sản phẩm vào đơn hàng"
    >
      <form @submit.prevent="handleAddItem" class="space-y-4">
        <div>
          <label for="product_id" class="block text-sm font-medium text-gray-700">
            Sản phẩm
          </label>
          <select
            id="product_id"
            v-model="newItem.product_id"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Chọn sản phẩm</option>
            <!-- This would be populated from products API -->
          </select>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700">
              Số lượng
            </label>
            <input
              id="quantity"
              v-model.number="newItem.quantity"
              type="number"
              min="1"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">
              Giá
            </label>
            <input
              id="price"
              v-model.number="newItem.price"
              type="number"
              min="0"
              step="1000"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showAddItemModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="actionLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <LoadingSpinner v-if="actionLoading" size="sm" class="mr-2" />
            Thêm
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderManagement } from '~/composables/orders/index'
import type { PaymentMethod, ShippingMethod, OrderItem as OrderItemType } from '~/types/orders'
import OrderStatusBadge from '~/components/Orders/Badges/OrderStatusBadge.vue'
import PaymentStatusBadge from '~/components/Orders/Badges/PaymentStatusBadge.vue'
import ShippingStatusBadge from '~/components/Orders/Badges/ShippingStatusBadge.vue'
import OrderItem from '~/pages/admin/components/orders/OrderItem.vue'
import LoadingSpinner from '~/components/Core/Loading/LoadingSpinner.vue'
import Modal from '~/components/Core/Modal/Modal.vue'

definePageMeta({
  layout: 'admin-layout',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const orderManagement = useOrderManagement({ immediate: false })

// State
const actionLoading = ref(false)
const showAddItemModal = ref(false)
const newItem = ref({
  product_id: 0,
  quantity: 1,
  price: 0
})

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Order actions
const confirmOrder = async () => {
  if (!orderManagement.state.currentOrder) return
  
  actionLoading.value = true
  try {
    await orderManagement.confirmOrder(orderManagement.state.currentOrder.id, {
      note: 'Đã xác nhận đơn hàng'
    })
  } catch (error) {
    console.error('Error confirming order:', error)
  } finally {
    actionLoading.value = false
  }
}

const markAsPreparing = async () => {
  if (!orderManagement.state.currentOrder) return
  
  actionLoading.value = true
  try {
    await orderManagement.updateOrderStatus(orderManagement.state.currentOrder.id, {
      status: 'preparing'
    })
  } catch (error) {
    console.error('Error updating order status:', error)
  } finally {
    actionLoading.value = false
  }
}

const markAsShipped = async () => {
  if (!orderManagement.state.currentOrder) return
  
  const trackingNumber = prompt('Nhập mã vận đơn:')
  if (!trackingNumber) return
  
  actionLoading.value = true
  try {
    await orderManagement.updateShippingStatus(orderManagement.state.currentOrder.id, {
      shipping_status: 'shipped',
      tracking_number: trackingNumber
    })
  } catch (error) {
    console.error('Error updating shipping status:', error)
  } finally {
    actionLoading.value = false
  }
}

const markAsDelivered = async () => {
  if (!orderManagement.state.currentOrder) return
  
  actionLoading.value = true
  try {
    await orderManagement.updateShippingStatus(orderManagement.state.currentOrder.id, {
      shipping_status: 'delivered'
    })
  } catch (error) {
    console.error('Error updating shipping status:', error)
  } finally {
    actionLoading.value = false
  }
}

const cancelOrder = async () => {
  if (!orderManagement.state.currentOrder) return
  
  const reason = prompt('Lý do hủy đơn hàng:')
  if (!reason) return
  
  actionLoading.value = true
  try {
    await orderManagement.cancelOrder(orderManagement.state.currentOrder.id, { reason })
  } catch (error) {
    console.error('Error cancelling order:', error)
  } finally {
    actionLoading.value = false
  }
}

const recalculateOrder = async () => {
  if (!orderManagement.state.currentOrder) return
  
  actionLoading.value = true
  try {
    await orderManagement.recalculateOrder(orderManagement.state.currentOrder.id)
  } catch (error) {
    console.error('Error recalculating order:', error)
  } finally {
    actionLoading.value = false
  }
}

// Item actions
const editItem = (item: OrderItemType) => {
  // This would open edit modal
  console.log('Edit item:', item)
}

const deleteItem = async (item: OrderItemType) => {
  if (!orderManagement.state.currentOrder) return
  
  if (confirm(`Xóa sản phẩm "${item.product_name}" khỏi đơn hàng?`)) {
    actionLoading.value = true
    try {
      await orderManagement.deleteOrderItem(orderManagement.state.currentOrder.id, item.id)
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      actionLoading.value = false
    }
  }
}

const handleAddItem = async () => {
  if (!orderManagement.state.currentOrder) return
  
  actionLoading.value = true
  try {
    await orderManagement.addOrderItem(orderManagement.state.currentOrder.id, newItem.value)
    showAddItemModal.value = false
    newItem.value = { product_id: 0, quantity: 1, price: 0 }
  } catch (error) {
    console.error('Error adding item:', error)
  } finally {
    actionLoading.value = false
  }
}

const printOrder = () => {
  window.print()
}

onMounted(() => {
  const orderId = parseInt(route.params.id as string)
  if (orderId) {
    orderManagement.fetchOrder(orderId)
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