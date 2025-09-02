<template>
  <div>
    <TagForm 
      v-if="showModal"
      :show="showModal"
      :tag="tagDetail"
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
import endpoints from '../../../api/endpoints.js'
import { ref, watch } from 'vue'
import { useApiFormSubmit } from '../../../utils/useApiFormSubmit.js'
import apiClient from '../../../api/apiClient.js'

const props = defineProps({
  show: Boolean,
  tag: Object,
  statusEnums: Array,
  onClose: Function
})

const emit = defineEmits(['updated'])

const showModal = ref(false)
const tagDetail = ref(null)
const loading = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.postTags.update(props.tag?.id),
  emit,
  onClose: props.onClose,
  eventName: 'updated',
  method: 'put'
})

// Watch show prop để cập nhật showModal và fetch tag detail
watch(() => props.show, async (newValue) => {
  showModal.value = newValue
  
  if (newValue && props.tag?.id) {
    await fetchTagDetail()
  }
}, { immediate: true })

async function fetchTagDetail() {
  try {
    loading.value = true
    const response = await apiClient.get(endpoints.postTags.show(props.tag.id))
    if (response.data.success) {
      tagDetail.value = response.data.data
    }
  } catch (error) {
    // Fallback to props data if API fails
    console.error('Error fetching tag detail:', error)
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
