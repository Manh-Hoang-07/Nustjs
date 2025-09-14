<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Đang tải dữ liệu...</span>
    </div>
    <CategoryForm 
      v-else-if="showModal"
      :show="showModal"
      :category="categoryData"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import CategoryForm from './form.vue'
import endpoints from '@/api/endpoints'
import { ref, reactive, watch } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

const api = useApiClient()

const props = defineProps({
  show: Boolean,
  category: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  onClose: Function
})

const emit = defineEmits(['updated'])

const showModal = ref(false)
const categoryData = ref(null)
const loading = ref(false)
const apiErrors = reactive({})

watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    
    // Luôn fetch dữ liệu chi tiết từ API khi mở modal
    if (props.category?.id) {
      fetchCategoryDetails()
    }
  } else {
    categoryData.value = null // Reset data khi đóng modal
    loading.value = false
  }
}, { immediate: true })

async function fetchCategoryDetails() {
  if (!props.category?.id) return
  
  loading.value = true
  try {
    const response = await api.get(`/api/admin/post-categories/${props.category.id}`)
    
    categoryData.value = response.data.data || response.data
  } catch (error) {
    // Fallback về dữ liệu từ list view nếu API lỗi
    categoryData.value = props.category
  } finally {
    loading.value = false
  }
}

async function handleSubmit(formData) {
  try {
    if (!props.category) return;
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    
    // Thêm _method = PUT để Laravel hiểu đây là PUT request
    const dataWithMethod = {
      ...formData,
      _method: 'PUT'
    }
    
    const response = await api.post(endpoints.postCategories.update(props.category.id), dataWithMethod)
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
