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
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  statusEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: Object,
  onClose: Function
})
const emit = defineEmits(['created'])

const showModal = ref(false)

// Watch show prop để cập nhật showModal
watch(() => props.show, (newValue) => {
  showModal.value = newValue
}, { immediate: true })

async function handleSubmit(formData) {
  // Emit data to parent component để xử lý bằng composable
  emit('created', formData)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script> 
