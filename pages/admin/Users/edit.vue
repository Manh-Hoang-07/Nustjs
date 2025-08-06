<template>
  <div>
    <UserForm 
      v-if="showModal"
      :show="showModal"
      :user="userDetail"
      :status-enums="statusEnums"
      :gender-enums="genderEnums"
      :role-enums="roleEnums"
      :api-errors="apiErrors"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import UserForm from './form.vue'
import endpoints from '../../../api/endpoints.js'
import { ref, watch } from 'vue'
import { useApiFormSubmit } from '../../../utils/useApiFormSubmit.js'
import apiClient from '../../../api/apiClient.js'

const props = defineProps({
  show: Boolean,
  user: Object,
  statusEnums: Array,
  genderEnums: Array,
  roleEnums: Array,
  onClose: Function
})
const emit = defineEmits(['updated'])

const showModal = ref(false)
const userDetail = ref(null)
const loading = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.users.update(props.user?.id),
  emit,
  onClose: props.onClose,
  eventName: 'updated',
  method: 'put'
})

// Watch show prop để cập nhật showModal và fetch user detail
watch(() => props.show, async (newValue) => {
  showModal.value = newValue
  
  if (newValue && props.user?.id) {
    await fetchUserDetail()
  }
}, { immediate: true })

async function fetchUserDetail() {
  try {
    loading.value = true
    const response = await apiClient.get(endpoints.users.show(props.user.id))
    if (response.data.success) {
      userDetail.value = response.data.data
    }
  } catch (error) {
    // Fallback to props data if API fails
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
