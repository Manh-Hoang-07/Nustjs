<template>
  <div>
    <TagForm 
      v-if="showModal"
      :show="showModal"
      :tag="null"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import TagForm from './form.vue'
import { adminEndpoints } from '@/api/endpoints'
import { ref, watch } from 'vue'
import { useApiFormSubmit } from '@/utils/form'

const props = defineProps({
  show: Boolean,
  statusEnums: Array,
  onClose: Function
})

const emit = defineEmits(['created'])

const showModal = ref(false)
const loading = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: adminEndpoints.postTags.create,
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
