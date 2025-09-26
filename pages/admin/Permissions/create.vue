<template>
  <div>
    <PermissionForm 
      v-if="showModal"
      :show="showModal"
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
import { useApiFormSubmit } from '@/utils/form'
 

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

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: adminEndpoints.permissions.create,
  emit,
  onClose: props.onClose,
  eventName: 'created',
  method: 'post'
})

// Watch show prop để cập nhật showModal
watch(() => props.show, (newValue) => {
  showModal.value = newValue
}, { immediate: true })

async function handleSubmit(formData) {
  await submit(formData)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script> 
