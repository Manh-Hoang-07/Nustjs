<template>
  <div>
    <CategoryForm 
      v-if="showModal"
      :show="showModal"
      :category="null"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import CategoryForm from './form.vue'
import { adminEndpoints } from '@/api/endpoints'
import { ref, reactive, watch } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

const { apiClient } = useApiClient()

const props = defineProps({
  show: Boolean,
  statusEnums: {
    type: Array,
    default: () => []
  },
  onClose: Function
})

const emit = defineEmits(['created'])

const showModal = ref(false)
const apiErrors = reactive({})

watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
  }
}, { immediate: true })

async function handleSubmit(formData) {
  try {
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    
    const response = await apiClient.post(adminEndpoints.postCategories.create, formData)
    emit('created')
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
