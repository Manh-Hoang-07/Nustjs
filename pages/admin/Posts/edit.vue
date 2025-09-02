<template>
  <div>
    <PostForm 
      v-if="showModal"
      :show="showModal"
      :post="postDetail"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :tag-enums="tagEnums"
      :api-errors="apiErrors"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import PostForm from './form.vue'
import endpoints from '../../../api/endpoints.js'
import { ref, watch } from 'vue'
import { useApiFormSubmit } from '../../../utils/useApiFormSubmit.js'
import apiClient from '../../../api/apiClient.js'

const props = defineProps({
  show: Boolean,
  post: Object,
  statusEnums: Array,
  categoryEnums: Array,
  tagEnums: Array,
  onClose: Function
})

const emit = defineEmits(['updated'])

const showModal = ref(false)
const postDetail = ref(null)
const loading = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.posts.update(props.post?.id),
  emit,
  onClose: props.onClose,
  eventName: 'updated',
  method: 'put'
})

// Watch show prop để cập nhật showModal và fetch post detail
watch(() => props.show, async (newValue) => {
  showModal.value = newValue
  
  if (newValue && props.post?.id) {
    await fetchPostDetail()
  }
}, { immediate: true })

async function fetchPostDetail() {
  try {
    loading.value = true
    const response = await apiClient.get(endpoints.posts.show(props.post.id))
    if (response.data.success) {
      postDetail.value = response.data.data
    }
  } catch (error) {
    // Fallback to props data if API fails
    console.error('Error fetching post detail:', error)
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
