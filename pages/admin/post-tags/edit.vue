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
import { adminEndpoints } from '@/api/endpoints'
import { ref, watch, reactive } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

const props = defineProps({
  show: Boolean,
  tag: Object,
  statusEnums: Array,
  apiErrors: Object,
  onClose: Function
})

const emit = defineEmits(['updated'])

const showModal = ref(false)
const tagDetail = ref(null)
const loading = ref(false)

const api = useApiClient()

// Watch show prop để cập nhật showModal và fetch tag detail
watch(() => props.show, async (newValue) => {
  showModal.value = newValue
  
  if (newValue) {
    // Luôn fetch dữ liệu chi tiết từ API khi mở modal
    if (props.tag?.id) {
      await fetchTagDetail()
    }
  } else {
    tagDetail.value = null // Reset data khi đóng modal
    loading.value = false
  }
}, { immediate: true })

async function fetchTagDetail() {
  if (!props.tag?.id) return
  
  loading.value = true
  try {
    const response = await api.get(`/api/admin/post-tags/${props.tag.id}`)
    tagDetail.value = response.data.data || response.data
  } catch (error) {
    // Fallback về dữ liệu từ list view nếu API lỗi
    console.error('Error fetching tag detail:', error)
    tagDetail.value = props.tag
  } finally {
    loading.value = false
  }
}

async function handleSubmit(formData) {
  emit('updated', formData)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script>
