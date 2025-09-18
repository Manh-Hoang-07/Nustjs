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
import endpoints from '@/api/endpoints'
import { ref, watch } from 'vue'
import { useApiFormSubmit } from '@/utils/form'

const props = defineProps({
  show: Boolean,
  statusEnums: Array,
  genderEnums: Array,
  onClose: Function
})
const emit = defineEmits(['created'])

const showModal = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.users.create,
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

  await submit(payload)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script> 
