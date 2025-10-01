<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Đang tải dữ liệu...</span>
    </div>
    <PostForm 
      v-else-if="showModal"
      :show="showModal"
      :post="postData"
      :status-enums="statusEnums"
      :category-enums="categoryEnums"
      :tag-enums="tagEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import PostForm from './form.vue'
import { adminEndpoints } from '@/api/endpoints'
import { ref, watch } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

const { apiClient } = useApiClient()

const props = defineProps({
  show: Boolean,
  post: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  categoryEnums: {
    type: Array,
    default: () => []
  },
  tagEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: Object,
  onClose: Function
})
const emit = defineEmits(['updated'])

const showModal = ref(false)
const postData = ref(null)
const loading = ref(false)

watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    // Luôn fetch dữ liệu chi tiết từ API khi mở modal
    if (props.post?.id) {
      fetchPostDetails()
    }
  } else {
    postData.value = null // Reset data khi đóng modal
    loading.value = false
  }
}, { immediate: true })

async function fetchPostDetails() {
  if (!props.post?.id) return
  
  loading.value = true
  try {
    const response = await apiClient.get(adminEndpoints.posts.show(props.post.id))
    
    postData.value = response.data.data || response.data
  } catch (error) {
    console.error('Error fetching post details:', error)
    // Fallback về dữ liệu từ list view nếu API lỗi
    postData.value = props.post
  } finally {
    loading.value = false
  }
}

async function handleSubmit(formData) {
  // Emit data to parent component để xử lý bằng composable
  emit('updated', formData)
}

function onClose() {
  if (props.onClose) {
    props.onClose()
  }
}
</script>
