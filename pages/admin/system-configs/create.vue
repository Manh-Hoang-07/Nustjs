<template>
  <div>
    <SystemConfigForm 
      v-if="showModal"
      :show="showModal"
      :type-enums="typeEnums"
      :group-enums="groupEnums"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import SystemConfigForm from './form.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  typeEnums: Array,
  groupEnums: Array,
  statusEnums: Array,
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
