<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Thanh toán</h1>
        <p class="mt-2 text-gray-600">
          Hoàn tất thông tin để đặt hàng của bạn
        </p>
      </div>

      <!-- Checkout Steps -->
      <div class="mb-8">
        <nav aria-label="Progress">
          <ol class="flex items-center justify-center">
            <li
              v-for="(step, index) in steps"
              :key="step.id"
              class="relative"
              :class="[index !== steps.length - 1 ? 'pr-8 sm:pr-20' : '']"
            >
              <div class="flex items-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full border-2"
                  :class="[
                    currentStepIndex > index
                      ? 'bg-blue-600 border-blue-600'
                      : currentStepIndex === index
                      ? 'border-blue-600 bg-white'
                      : 'border-gray-300 bg-white'
                  ]"
                >
                  <span
                    v-if="currentStepIndex > index"
                    class="text-white"
                  >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span
                    v-else
                    class="text-sm font-medium"
                    :class="[
                      currentStepIndex === index ? 'text-blue-600' : 'text-gray-500'
                    ]"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
                <span
                  class="ml-4 text-sm font-medium"
                  :class="[
                    currentStepIndex > index
                      ? 'text-blue-600'
                      : currentStepIndex === index
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  ]"
                >
                  {{ step.name }}
                </span>
              </div>
              <!-- Step Connector -->
              <div
                v-if="index !== steps.length - 1"
                class="absolute top-5 left-10 h-0.5 w-full"
                :class="[
                  currentStepIndex > index ? 'bg-blue-600' : 'bg-gray-300'
                ]"
              />
            </li>
          </ol>
        </nav>
      </div>

      <!-- Error Message -->
      <div v-if="checkout.errorMessage" class="mb-6">
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
                {{ checkout.errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Step 1: Address -->
          <div v-if="checkout.currentStep === 'address'" class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Thông tin giao hàng</h2>
            <CheckoutAddressForm
              :is-submitting="checkout.isLoading"
              @submit="handleAddressSubmit"
              @cancel="handleCancel"
            />
          </div>

          <!-- Step 2: Payment & Shipping -->
          <div v-else-if="checkout.currentStep === 'payment'" class="space-y-6">
            <!-- Shipping Method -->
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-6">Phương thức vận chuyển</h2>
              <ShippingMethodSelector
                v-model="shippingMethod"
                :shipping-address="checkout.state.address?.shipping_address"
              />
            </div>

            <!-- Payment Method -->
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-6">Phương thức thanh toán</h2>
              <PaymentMethodSelector
                v-model="paymentMethod"
                :total-amount="cartTotal"
                :order-number="orderNumber"
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-between">
              <button
                type="button"
                @click="checkout.previousStep"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                type="button"
                @click="handlePaymentSubmit"
                :disabled="!canProceedToConfirmation || checkout.isLoading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LoadingSpinner v-if="checkout.isLoading" size="sm" class="mr-2" />
                Tiếp tục
              </button>
            </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-else-if="checkout.currentStep === 'confirmation'" class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Xác nhận đơn hàng</h2>
            
            <!-- Order Summary -->
            <div class="space-y-6">
              <!-- Customer Info -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium">Họ tên:</span>
                      <p class="text-gray-600">{{ checkout.state.address?.customer_name }}</p>
                    </div>
                    <div>
                      <span class="font-medium">Email:</span>
                      <p class="text-gray-600">{{ checkout.state.address?.customer_email }}</p>
                    </div>
                    <div>
                      <span class="font-medium">Điện thoại:</span>
                      <p class="text-gray-600">{{ checkout.state.address?.customer_phone }}</p>
                    </div>
                    <div>
                      <span class="font-medium">Địa chỉ:</span>
                      <p class="text-gray-600">{{ checkout.state.address?.shipping_address }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-3">Sản phẩm</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <!-- Cart items would be displayed here -->
                  <div class="text-sm text-gray-600">
                    <!-- This would be populated from cart data -->
                    <p>Hiển thị sản phẩm trong giỏ hàng</p>
                  </div>
                </div>
              </div>

              <!-- Payment & Shipping Info -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-3">Phương thức</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium">Thanh toán:</span>
                      <p class="text-gray-600">{{ getPaymentMethodLabel(paymentMethod) }}</p>
                    </div>
                    <div>
                      <span class="font-medium">Vận chuyển:</span>
                      <p class="text-gray-600">{{ getShippingMethodLabel(shippingMethod) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between mt-8">
              <button
                type="button"
                @click="checkout.previousStep"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                type="button"
                @click="handleConfirmOrder"
                :disabled="checkout.isLoading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LoadingSpinner v-if="checkout.isLoading" size="sm" class="mr-2" />
                Xác nhận đặt hàng
              </button>
            </div>
          </div>

          <!-- Step 4: Complete -->
          <div v-else-if="checkout.currentStep === 'complete'" class="bg-white shadow rounded-lg p-6 text-center">
            <div class="mb-6">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 class="mt-4 text-2xl font-bold text-gray-900">Đặt hàng thành công!</h2>
              <p class="mt-2 text-gray-600">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
              </p>
            </div>

            <div v-if="checkout.orderData" class="mb-6 text-left">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-900 mb-2">Thông tin đơn hàng</h3>
                <div class="space-y-1 text-sm">
                  <p><strong>Mã đơn hàng:</strong> {{ checkout.orderData.order_number }}</p>
                  <p><strong>Tổng tiền:</strong> {{ formatCurrency(checkout.orderData.total_amount) }}</p>
                  <p><strong>Trạng thái:</strong> {{ checkout.orderData.status }}</p>
                </div>
              </div>
            </div>

            <div class="space-x-4">
              <NuxtLink
                to="/home/orders"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Xem đơn hàng của tôi
              </NuxtLink>
              <NuxtLink
                to="/home"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Tiếp tục mua sắm
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6 sticky top-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
            
            <!-- Cart Summary -->
            <div class="space-y-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tạm tính:</span>
                <span class="font-medium">{{ formatCurrency(cartSubtotal) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Phí vận chuyển:</span>
                <span class="font-medium">{{ formatCurrency(shippingCost) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Thuế (10%):</span>
                <span class="font-medium">{{ formatCurrency(tax) }}</span>
              </div>
              
              <div class="border-t pt-4">
                <div class="flex justify-between">
                  <span class="text-base font-medium text-gray-900">Tổng cộng:</span>
                  <span class="text-base font-bold text-gray-900">{{ formatCurrency(cartTotal) }}</span>
                </div>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="mt-6">
              <label for="promo-code" class="block text-sm font-medium text-gray-700">
                Mã khuyến mãi
              </label>
              <div class="mt-1 flex">
                <input
                  id="promo-code"
                  type="text"
                  class="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập mã khuyến mãi"
                />
                <button
                  type="button"
                  class="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckout } from '~/composables/orders/index'
import type { PaymentMethod, ShippingMethod } from '~/types/orders'
import CheckoutAddressForm from '~/pages/home/components/checkout/CheckoutAddressForm.vue'
import ShippingMethodSelector from '~/pages/home/components/checkout/ShippingMethodSelector.vue'
import PaymentMethodSelector from '~/pages/home/components/checkout/PaymentMethodSelector.vue'
import LoadingSpinner from '~/components/Core/Loading/LoadingSpinner.vue'
import { formatCurrency } from '~/utils/formatters'

definePageMeta({
  layout: 'home',
  middleware: 'auth'
})

const router = useRouter()
const checkout = useCheckout({ immediate: true })

// Form state
const shippingMethod = ref<ShippingMethod>('standard')
const paymentMethod = ref<PaymentMethod>('cod')

// Checkout steps
const steps = [
  { id: 'address', name: 'Địa chỉ' },
  { id: 'payment', name: 'Thanh toán' },
  { id: 'confirmation', name: 'Xác nhận' },
  { id: 'complete', name: 'Hoàn thành' }
]

const currentStepIndex = computed(() => {
  return steps.findIndex(step => step.id === checkout.currentStep)
})

// Mock cart data (this would come from cart state)
const cartSubtotal = ref(500000)
const shippingCost = computed(() => {
  const costs = {
    standard: 30000,
    express: 50000,
    overnight: 80000,
    pickup: 0
  }
  return costs[shippingMethod.value] || 0
})

const tax = computed(() => cartSubtotal.value * 0.1)
const cartTotal = computed(() => cartSubtotal.value + shippingCost.value + tax.value)

const orderNumber = computed(() => {
  return checkout.orderData?.order_number || ''
})

const canProceedToConfirmation = computed(() => {
  return shippingMethod.value && paymentMethod.value
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

const handleAddressSubmit = async (addressData: any) => {
  try {
    await checkout.saveAddress(addressData)
    checkout.nextStep()
  } catch (error) {
    console.error('Error saving address:', error)
  }
}

const handlePaymentSubmit = () => {
  if (canProceedToConfirmation.value) {
    checkout.nextStep()
  }
}

const handleConfirmOrder = async () => {
  try {
    // Create order with checkout data
    const orderData = {
      cart_header_id: 'mock-cart-id', // This would come from cart state
      payment_method: paymentMethod.value,
      shipping_method: shippingMethod.value
    }
    
    await checkout.createOrder(orderData)
    checkout.nextStep()
  } catch (error) {
    console.error('Error creating order:', error)
  }
}

const handleCancel = () => {
  router.push('/home/cart')
}
</script>