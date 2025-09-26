<template>
  <div>
    <UserForm 
      v-if="showModal"
      :show="showModal"
      :user="userDetail"
      :status-enums="statusEnums"
      :gender-enums="genderEnums"
      :api-errors="apiErrors"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import UserForm from './form.vue'
import { adminEndpoints } from '@/api/endpoints'
import { ref, watch } from 'vue'
import { formatDate } from '@/utils/formatters'
import { useApiFormSubmit } from '@/utils/form'
import { useApiClient } from '@/composables/api/useApiClient.js'

const props = defineProps({
  show: Boolean,
  user: Object,
  statusEnums: Array,
  genderEnums: Array,
  onClose: Function
})
const emit = defineEmits(['updated'])
const { apiClient } = useApiClient()

const showModal = ref(false)
const userDetail = ref(null)
const loading = ref(false)

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: adminEndpoints.users.update(props.user?.id),
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
    const response = await apiClient.get(adminEndpoints.users.show(props.user.id))
    if (response.data.success) {
      const data = response.data.data || {}
      const profile = data.profile || {}
      const roles = Array.isArray(data.roles) ? data.roles : []

      // Transform API shape to flat form-consumable structure
      userDetail.value = {
        id: data.id,
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        status: data.status || '',
        name: profile.name || '',
        address: profile.address || '',
        gender: profile.gender || '',
        birthday: formatDate(profile.birthday, 'yyyy-MM-dd'),
        image: profile.image || null,
        about: profile.about || '',
        roles: roles,
        role_ids: roles.map(r => r.id),
        email_verified_at: data.email_verified_at || null,
        phone_verified_at: data.phone_verified_at || null,
        last_login_at: data.last_login_at || null,
        created_at: data.created_at || null,
        updated_at: data.updated_at || null
      }
    }
  } catch (error) {
    // Fallback to props data if API fails
  } finally {
    loading.value = false
  }
}

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
