<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
      <!-- Customer Name -->
      <div class="sm:col-span-2">
        <FormField
          id="customer_name"
          v-model="form.customer_name"
          label="Họ và tên"
          placeholder="Nhập họ và tên của bạn"
          :error="errors.customer_name"
          required
        />
      </div>

      <!-- Customer Email -->
      <div>
        <FormField
          id="customer_email"
          v-model="form.customer_email"
          label="Email"
          type="email"
          placeholder="email@example.com"
          :error="errors.customer_email"
          required
        />
      </div>

      <!-- Customer Phone -->
      <div>
        <FormField
          id="customer_phone"
          v-model="form.customer_phone"
          label="Số điện thoại"
          placeholder="0123456789"
          :error="errors.customer_phone"
          required
        />
      </div>

      <!-- Shipping Address -->
      <div class="sm:col-span-2">
        <label for="shipping_address" class="block text-sm font-medium text-gray-700">
          Địa chỉ giao hàng <span class="text-red-500">*</span>
        </label>
        <textarea
          id="shipping_address"
          v-model="form.shipping_address"
          rows="3"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Nhập địa chỉ giao hàng chi tiết"
          required
        ></textarea>
        <p v-if="errors.shipping_address" class="mt-1 text-sm text-red-600">
          {{ errors.shipping_address }}
        </p>
      </div>

      <!-- Billing Address -->
      <div class="sm:col-span-2">
        <div class="flex items-center">
          <input
            id="same_as_shipping"
            v-model="sameAsShipping"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="same_as_shipping" class="ml-2 block text-sm text-gray-900">
            Địa chỉ thanh toán giống địa chỉ giao hàng
          </label>
        </div>
      </div>

      <!-- Billing Address (conditional) -->
      <div v-if="!sameAsShipping" class="sm:col-span-2">
        <label for="billing_address" class="block text-sm font-medium text-gray-700">
          Địa chỉ thanh toán
        </label>
        <textarea
          id="billing_address"
          v-model="form.billing_address"
          rows="3"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Nhập địa chỉ thanh toán chi tiết"
        ></textarea>
        <p v-if="errors.billing_address" class="mt-1 text-sm text-red-600">
          {{ errors.billing_address }}
        </p>
      </div>

      <!-- Notes -->
      <div class="sm:col-span-2">
        <label for="notes" class="block text-sm font-medium text-gray-700">
          Ghi chú (tùy chọn)
        </label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="2"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Ghi chú đặc biệt về đơn hàng của bạn"
        ></textarea>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Hủy
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LoadingSpinner v-if="isSubmitting" size="sm" class="mr-2" />
        {{ isSubmitting ? 'Đang lưu...' : 'Lưu và tiếp tục' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { CheckoutAddressRequest } from '~/types/orders'
import FormField from '~/components/Core/Form/FormField.vue'
import LoadingSpinner from '~/components/Core/Loading/LoadingSpinner.vue'

interface Props {
  initialData?: Partial<CheckoutAddressRequest>
  isSubmitting?: boolean
}

interface Emits {
  (e: 'submit', data: CheckoutAddressRequest): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false
})

const emit = defineEmits<Emits>()

// Form state
const form = reactive<CheckoutAddressRequest>({
  customer_name: props.initialData?.customer_name || '',
  customer_email: props.initialData?.customer_email || '',
  customer_phone: props.initialData?.customer_phone || '',
  shipping_address: props.initialData?.shipping_address || '',
  billing_address: props.initialData?.billing_address || '',
  notes: props.initialData?.notes || ''
})

const sameAsShipping = ref(true)
const errors = reactive<Record<string, string>>({})

// Watch for sameAsShipping changes
watch(sameAsShipping, (newValue) => {
  if (newValue) {
    form.billing_address = form.shipping_address
  }
})

// Watch shipping address changes when sameAsShipping is true
watch(() => form.shipping_address, (newAddress) => {
  if (sameAsShipping.value) {
    form.billing_address = newAddress
  }
})

// Validation
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!form.customer_name.trim()) {
    newErrors.customer_name = 'Vui lòng nhập họ và tên'
  }

  if (!form.customer_email.trim()) {
    newErrors.customer_email = 'Vui lòng nhập email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) {
    newErrors.customer_email = 'Email không hợp lệ'
  }

  if (!form.customer_phone.trim()) {
    newErrors.customer_phone = 'Vui lòng nhập số điện thoại'
  } else if (!/^[0-9]{10,11}$/.test(form.customer_phone.replace(/\s/g, ''))) {
    newErrors.customer_phone = 'Số điện thoại không hợp lệ'
  }

  if (!form.shipping_address.trim()) {
    newErrors.shipping_address = 'Vui lòng nhập địa chỉ giao hàng'
  }

  // Clear previous errors and set new ones
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}

// Submit handler
const handleSubmit = () => {
  if (validateForm()) {
    const submitData: CheckoutAddressRequest = {
      ...form,
      billing_address: sameAsShipping.value ? form.shipping_address : form.billing_address
    }
    emit('submit', submitData)
  }
}
</script>