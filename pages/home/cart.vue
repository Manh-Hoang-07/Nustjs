<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center">
              <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
              Giỏ hàng của bạn
            </h1>
            <p class="mt-1 text-gray-600">{{ itemsCount }} sản phẩm trong giỏ hàng</p>
          </div>
          <NuxtLink
            to="/home/products"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Tiếp tục mua sắm
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-lg shadow-md">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-red-800">Đã xảy ra lỗi</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ errorMessage }}</p>
            </div>
            <button @click="initializeCart" class="mt-3 text-sm font-medium text-red-600 hover:text-red-500 underline">
              Thử lại
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Content -->
      <div v-else-if="!isEmpty" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 class="text-xl font-bold text-white flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Sản phẩm ({{ itemsCount }})
              </h2>
            </div>
            
            <div class="divide-y divide-gray-100">
              <CartItem
                v-for="item in items"
                :key="item.id"
                :item="item"
                @update-quantity="handleUpdateQuantity"
                @remove="handleRemoveItem"
              />
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
            <div class="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
              <h2 class="text-xl font-bold text-white flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Tổng đơn hàng
              </h2>
            </div>
            
            <div class="px-6 py-6 space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-gray-600 font-medium">Tạm tính</span>
                <span class="text-lg font-semibold text-gray-900">{{ formatCurrency(subtotal) }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-gray-600 font-medium">Thuế (10%)</span>
                <span class="text-lg font-semibold text-gray-900">{{ formatCurrency(tax) }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-gray-600 font-medium">Phí vận chuyển</span>
                <span class="text-lg font-semibold text-gray-900">{{ formatCurrency(shippingCost) }}</span>
              </div>
              
              <div class="pt-4 border-t-2 border-gray-200">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-gray-900">Tổng cộng</span>
                  <span class="text-2xl font-bold text-blue-600">{{ formatCurrency(totalAmount) }}</span>
                </div>
              </div>
            </div>
            
            <div class="px-6 py-6 space-y-3 bg-gray-50">
              <NuxtLink
                to="/home/checkout"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center block shadow-lg flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
                Tiến hành thanh toán
              </NuxtLink>
              
              <button
                @click="handleClearCart"
                class="w-full bg-red-50 text-red-600 py-3 px-6 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Xóa giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div v-else class="text-center py-20">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
          <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h3>
        <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
        <NuxtLink
          to="/home/products"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
          </svg>
          Bắt đầu mua sắm
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCart } from '~/composables/cart'
import { useToast } from '~/composables/ui/useToast'
import CartItem from '~/components/Cart/Items/CartItem.vue'
import { formatCurrency } from '~/utils/formatters'
import type { UpdateCartItemRequest } from '~/types/cart'

// Page metadata
definePageMeta({
  title: 'Giỏ hàng',
  description: 'Quản lý giỏ hàng của bạn'
})

// Use cart composable
const {
  items,
  itemsCount,
  subtotal,
  tax,
  shippingCost,
  totalAmount,
  isEmpty,
  isLoading,
  errorMessage,
  updateCartItem,
  removeFromCart,
  clearCart,
  initializeCart
} = useCart()

// Use toast
const { showSuccess, showError } = useToast()

// Handle update quantity
const handleUpdateQuantity = async (itemId: string, quantity: number) => {
  try {
    const request: UpdateCartItemRequest = { quantity }
    await updateCartItem(itemId, request)
    showSuccess('Cập nhật số lượng thành công')
  } catch (error) {
    showError('Không thể cập nhật số lượng sản phẩm')
  }
}

// Handle remove item
const handleRemoveItem = async (itemId: string) => {
  try {
    await removeFromCart(itemId)
    showSuccess('Xóa sản phẩm khỏi giỏ hàng thành công')
  } catch (error) {
    showError('Không thể xóa sản phẩm khỏi giỏ hàng')
  }
}

// Handle clear cart
const handleClearCart = async () => {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
    try {
      await clearCart()
      showSuccess('Xóa giỏ hàng thành công')
    } catch (error) {
      showError('Không thể xóa giỏ hàng')
    }
  }
}

// Initialize cart on page load
onMounted(() => {
  initializeCart()
})
</script>