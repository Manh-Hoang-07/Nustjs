<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      Phương thức thanh toán <span class="text-red-500">*</span>
    </label>
    
    <div class="space-y-3">
      <div
        v-for="method in paymentMethods"
        :key="method.value"
        class="relative flex items-start"
      >
        <div class="flex items-center h-5">
          <input
            :id="`payment-${method.value}`"
            v-model="selectedMethod"
            :value="method.value"
            name="payment_method"
            type="radio"
            class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            @change="handleMethodChange"
          />
        </div>
        <div class="ml-3 text-sm">
          <label :for="`payment-${method.value}`" class="font-medium text-gray-700 cursor-pointer">
            {{ method.label }}
          </label>
          <p v-if="method.description" class="text-gray-500">
            {{ method.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Payment Details Form (conditional) -->
    <div v-if="showPaymentDetails" class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Thông tin thanh toán</h4>
      
      <!-- Credit Card Form -->
      <div v-if="selectedMethod === 'credit_card' || selectedMethod === 'debit_card'" class="space-y-4">
        <div>
          <label for="card_number" class="block text-sm font-medium text-gray-700">
            Số thẻ
          </label>
          <input
            id="card_number"
            v-model="paymentDetails.card_number"
            type="text"
            placeholder="1234 5678 9012 3456"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @input="formatCardNumber"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="expiry" class="block text-sm font-medium text-gray-700">
              Ngày hết hạn
            </label>
            <input
              id="expiry"
              v-model="paymentDetails.expiry"
              type="text"
              placeholder="MM/YY"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="formatExpiry"
            />
          </div>
          
          <div>
            <label for="cvv" class="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              id="cvv"
              v-model="paymentDetails.cvv"
              type="text"
              placeholder="123"
              maxlength="4"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label for="cardholder_name" class="block text-sm font-medium text-gray-700">
            Tên chủ thẻ
          </label>
          <input
            id="cardholder_name"
            v-model="paymentDetails.cardholder_name"
            type="text"
            placeholder="NGUYEN VAN A"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Bank Transfer Info -->
      <div v-else-if="selectedMethod === 'bank_transfer'" class="space-y-3">
        <div class="bg-white p-4 rounded border border-gray-200">
          <h5 class="font-medium text-gray-900 mb-2">Thông tin chuyển khoản</h5>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Ngân hàng:</strong> Vietcombank</p>
            <p><strong>Số tài khoản:</strong> 1234567890</p>
            <p><strong>Chủ tài khoản:</strong> CÔNG TY ABC</p>
            <p><strong>Nội dung:</strong> Thanh toán đơn hàng {{ orderNumber }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-500">
          Vui lòng chuyển khoản và chúng tôi sẽ xác nhận sau khi nhận được thanh toán.
        </p>
      </div>

      <!-- E-wallet Options -->
      <div v-else-if="selectedMethod === 'ewallet'" class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="wallet in eWalletOptions"
            :key="wallet.value"
            type="button"
            :class="[
              'p-3 border rounded-lg text-sm font-medium transition-colors',
              selectedEWallet === wallet.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            ]"
            @click="selectedEWallet = wallet.value"
          >
            {{ wallet.label }}
          </button>
        </div>
      </div>

      <!-- COD Info -->
      <div v-else-if="selectedMethod === 'cod'" class="space-y-3">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Thanh toán khi nhận hàng (COD)</strong><br>
            Bạn sẽ thanh toán khi nhận được sản phẩm. Vui lòng chuẩn bị đủ số tiền {{ formatCurrency(totalAmount) }}.
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PaymentMethod } from '~/types/orders'
import { PAYMENT_METHOD_OPTIONS } from '~/types/orders'
import { formatCurrency } from '~/utils/formatters'

interface Props {
  modelValue: PaymentMethod
  totalAmount?: number
  orderNumber?: string
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: PaymentMethod): void
  (e: 'payment-details-change', details: any): void
}

const props = withDefaults(defineProps<Props>(), {
  totalAmount: 0,
  orderNumber: ''
})

const emit = defineEmits<Emits>()

const selectedMethod = ref<PaymentMethod>(props.modelValue)
const selectedEWallet = ref<string>('')
const paymentDetails = ref<any>({})

const paymentMethods = computed(() => PAYMENT_METHOD_OPTIONS.map(option => ({
  ...option,
  description: getPaymentDescription(option.value)
})))

const eWalletOptions = [
  { value: 'momo', label: 'MoMo' },
  { value: 'zalopay', label: 'ZaloPay' },
  { value: 'vnpay', label: 'VNPay' }
]

const showPaymentDetails = computed(() => {
  return ['credit_card', 'debit_card', 'bank_transfer', 'ewallet', 'cod'].includes(selectedMethod.value)
})

const getPaymentDescription = (method: PaymentMethod): string => {
  switch (method) {
    case 'cod':
      return 'Thanh toán khi nhận hàng'
    case 'bank_transfer':
      return 'Chuyển khoản ngân hàng'
    case 'credit_card':
      return 'Thẻ tín dụng/ghi nợ'
    case 'ewallet':
      return 'Ví điện tử'
    default:
      return ''
  }
}


const formatCardNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\s/g, '')
  const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  target.value = formattedValue
  paymentDetails.value.card_number = formattedValue
}

const formatExpiry = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  target.value = value
  paymentDetails.value.expiry = value
}

const handleMethodChange = () => {
  emit('update:modelValue', selectedMethod.value)
  emit('payment-details-change', getPaymentDetails())
}

const getPaymentDetails = () => {
  if (selectedMethod.value === 'credit_card' || selectedMethod.value === 'debit_card') {
    return {
      ...paymentDetails.value,
      card_number: paymentDetails.value.card_number?.replace(/\s/g, ''),
      type: selectedMethod.value
    }
  } else if (selectedMethod.value === 'ewallet') {
    return {
      provider: selectedEWallet.value,
      type: 'ewallet'
    }
  } else {
    return {
      type: selectedMethod.value
    }
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedMethod.value = newValue
})

watch(selectedMethod, () => {
  emit('payment-details-change', getPaymentDetails())
})

watch(selectedEWallet, () => {
  emit('payment-details-change', getPaymentDetails())
})
</script>