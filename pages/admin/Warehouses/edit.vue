<template>
  <div>
    <WarehouseForm 
      v-if="showModal"
      :show="showModal"
      :warehouse="warehouseData"
      :api-errors="apiErrors"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import WarehouseForm from './form.vue'
import endpoints from '../../../api/endpoints.js'
import { ref, reactive, watch } from 'vue'
import { useApiClient } from '../../../composables/api/useApiClient.js'


const api = useApiClient()

const props = defineProps({
  show: Boolean,
  warehouse: Object,
  onClose: Function
})
const emit = defineEmits(['updated'])

const showModal = ref(false)
const warehouseData = ref(null)
const loading = ref(false)
const apiErrors = reactive({})

watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    
    // Luôn fetch dữ liệu chi tiết từ API khi mở modal
    if (props.warehouse?.id) {
      fetchWarehouseDetails()
    }
  } else {
    warehouseData.value = null // Reset data khi đóng modal
    loading.value = false
  }
}, { immediate: true })

async function fetchWarehouseDetails() {
  if (!props.warehouse?.id) return
  
  loading.value = true
  try {
    const response = await api.get(`/api/admin/warehouses/${props.warehouse.id}`)
    
    warehouseData.value = response.data.data || response.data
  } catch (error) {
    
    // Fallback về dữ liệu từ list view nếu API lỗi
    warehouseData.value = props.warehouse
  } finally {
    loading.value = false
  }
}



async function handleSubmit(formData) {
  try {
    if (!props.warehouse) return;
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    await api.put(endpoints.warehouses.update(props.warehouse.id), formData)
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
