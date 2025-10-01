<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Đang tải dữ liệu...</span>
    </div>
    <PermissionForm 
      v-else-if="showModal"
      :show="showModal"
      :permission="permissionData"
      :status-enums="props.statusEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import PermissionForm from './form.vue'
import { adminEndpoints } from '@/api/endpoints'
import { ref, watch } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

const { apiClient } = useApiClient()

const props = defineProps({
  show: Boolean,
  permission: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: Object,
  onClose: Function
})
const emit = defineEmits(['updated'])

const showModal = ref(false)
const permissionData = ref(null)
const loading = ref(false)

watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    // Luôn fetch dữ liệu chi tiết từ API khi mở modal
    if (props.permission?.id) {
      fetchPermissionDetails()
    }
  } else {
    permissionData.value = null // Reset data khi đóng modal
    loading.value = false
  }
}, { immediate: true })

async function fetchPermissionDetails() {
  if (!props.permission?.id) return
  
  loading.value = true
  try {
    const response = await apiClient.get(`/api/admin/permissions/${props.permission.id}`)
    
    permissionData.value = response.data.data || response.data
  } catch (error) {
    console.error('Error fetching permission details:', error)
    // Fallback về dữ liệu từ list view nếu API lỗi
    permissionData.value = props.permission
  } finally {
    loading.value = false
  }
}

async function handleSubmit(formData) {
  // Emit data to parent component để xử lý bằng composable
  emit('updated', formData)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script> 
