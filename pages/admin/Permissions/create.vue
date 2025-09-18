<template>
  <div>
    <PermissionForm 
      v-if="showModal"
      :show="showModal"
      :parent-options="parentOptions"
      :status-enums="props.statusEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import PermissionForm from './form.vue'
import endpoints from '@/api/endpoints'
import { ref, watch } from 'vue'
import { useApiFormSubmit } from '@/utils/form'
import { useApiClient } from '@/composables/api/useApiClient'
import apiClient from '@/api/apiClient'


const { apiClient: api } = useApiClient()

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
const parentOptions = ref([])

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.permissions.create,
  emit,
  onClose: props.onClose,
  eventName: 'created',
  method: 'post'
})

// Watch show prop để cập nhật showModal
watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    fetchParentOptions()
  }
}, { immediate: true })


async function fetchParentOptions() {
  try {
    const response = await api.get(endpoints.permissions.list, { 
      params: { 
        per_page: 100,
        relations: 'parent'
      } 
    })
    parentOptions.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching parent options:', error)
    parentOptions.value = []
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
