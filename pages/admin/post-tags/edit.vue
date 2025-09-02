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
import { ref, watch, reactive } from 'vue'
import { useApiClient } from '../../../composables/api/useApiClient.js'

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
const apiErrors = reactive({})

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
  try {
    if (!props.tag) return;
    Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    
    // Thêm _method = PUT để Laravel hiểu đây là PUT request
    const dataWithMethod = {
      ...formData,
      _method: 'PUT'
    }
    
    const response = await api.post(endpoints.postTags.update(props.tag.id), dataWithMethod)
    emit('updated')
    props.onClose()
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors
      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          apiErrors[field] = errors[field][0]
        } else {
          apiErrors[field] = errors[field]
        }
      }
    }
  }
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script>
