<template>
  <div>
    <CategoryForm 
      v-if="showModal"
      :show="showModal"
      :category="categoryDetail"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import CategoryForm from './form.vue'
import endpoints from '../../../api/endpoints.js'
import { ref, watch } from 'vue'
import { useApiFormSubmit } from '../../../utils/useApiFormSubmit.js'
import apiClient from '../../../api/apiClient.js'

const props = defineProps({
  show: Boolean,
  category: Object,
  statusEnums: Array,
  onClose: Function
})

const emit = defineEmits(['updated'])

const showModal = ref(false)
const categoryDetail = ref(null)
const loading = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.postCategories.update(props.category?.id),
  emit,
  onClose: props.onClose,
  eventName: 'updated',
  method: 'put'
})

// Watch show prop để cập nhật showModal và fetch category detail
watch(() => props.show, async (newValue) => {
  showModal.value = newValue
  
  if (newValue && props.category?.id) {
    await fetchCategoryDetail()
  }
}, { immediate: true })

async function fetchCategoryDetail() {
  try {
    loading.value = true
    const response = await apiClient.get(endpoints.postCategories.show(props.category.id))
    if (response.data.success) {
      categoryDetail.value = response.data.data
    }
  } catch (error) {
    // Fallback to props data if API fails
    console.error('Error fetching category detail:', error)
  } finally {
    loading.value = false
  }
}

async function handleSubmit(formData) {
  await submit(formData)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script>
