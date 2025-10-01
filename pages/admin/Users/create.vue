<template>
  <div>
    <UserForm 
      v-if="showModal"
      :show="showModal"
      :status-enums="statusEnums"
      :gender-enums="genderEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import UserForm from './form.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  statusEnums: Array,
  genderEnums: Array,
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
  const data = formData || {}
  const profileKeys = new Set(['name', 'address', 'gender', 'birthday', 'image', 'about', 'remove_image'])
  const payload = { profile: {} }

  Object.keys(data).forEach((key) => {
    if (profileKeys.has(key)) {
      payload.profile[key] = data[key]
    } else {
      payload[key] = data[key]
    }
  })

  // Emit data to parent component để xử lý bằng composable
  emit('created', payload)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script> 
