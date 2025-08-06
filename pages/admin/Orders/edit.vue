<template>
  <div>
    <OrderForm 
      v-if="showModal"
      :show="showModal"
      :order="order"
      :api-errors="apiErrors"
      :status-options="statusOptions"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import OrderForm from './form.vue'
import endpoints from '../../../api/endpoints.js'
import { ref, reactive, watch, onMounted } from 'vue'
import { getEnumSync } from '../../../constants/enums.js'
import { useApiClient } from '../../../composables/api/useApiClient.js'


const api = useApiClient()

const props = defineProps({
  show: Boolean,
  order: Object,
  onClose: Function
})
const emit = defineEmits(['updated'])

const showModal = ref(false)
const apiErrors = reactive({})
const statusOptions = ref({})
const loading = ref(false)

watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    fetchStatusOptions()
    
    // Fetch order details if needed
    if (props.order?.id) {
      fetchOrderDetails()
    }
  } else {
    loading.value = false
  }
}, { immediate: true })

async function fetchOrderDetails() {
  if (!props.order?.id) return
  
  loading.value = true
  try {
    const response = await api.get(`/api/admin/orders/${props.order.id}`)
    // Update order data if needed
  } catch (error) {
    // Fallback to props data if API fails
  } finally {
    loading.value = false
  }
}

function fetchStatusOptions() {
  const enumData = getEnumSync('order_status')
  statusOptions.value = enumData.map(item => ({
    value: item.value,
    label: item.label
  }))
}

async function handleSubmit(formData) {
  try {
    if (!props.order) return;
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    const dataWithMethod = {
      ...formData,
      _method: 'PUT'
    }
    await api.post(endpoints.orders.update(props.order.id), dataWithMethod)
    emit('updated')
    props.onClose()
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors
      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          apiErrors[field] = errors[field][0]
        } else {
          apiErrors[field] = errors[field]
        }
      }
    }
  }
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script> 
