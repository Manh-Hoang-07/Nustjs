<template>
  <div>
    <CategoryForm 
      v-if="showModal"
      :show="showModal"
      :category="null"
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

const props = defineProps({
  show: Boolean,
  statusEnums: Array,
  onClose: Function
})

const emit = defineEmits(['created'])

const showModal = ref(false)
const loading = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.postCategories.create,
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
