<template>
  <div>
    <SystemConfigForm 
      v-if="showModal"
      :show="showModal"
      :config="configDetail"
      :type-enums="typeEnums"
      :group-enums="groupEnums"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :loading="loading"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import SystemConfigForm from './form.vue'
import { adminEndpoints } from '@/api/endpoints'
import { ref, watch } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

const props = defineProps({
  show: Boolean,
  config: Object,
  typeEnums: Array,
  groupEnums: Array,
  statusEnums: Array,
  apiErrors: Object,
  onClose: Function
})

const emit = defineEmits(['updated'])
const { apiClient } = useApiClient()

const showModal = ref(false)
const configDetail = ref(null)
const loading = ref(false)

// Watch show prop để cập nhật showModal và fetch config detail
watch(() => props.show, async (newValue) => {
  showModal.value = newValue
  
  if (newValue && props.config?.id) {
    await fetchConfigDetail()
  }
}, { immediate: true })

async function fetchConfigDetail() {
  try {
    loading.value = true
    const response = await apiClient.get(adminEndpoints.systemConfigs.show(props.config.id))
    if (response.data.success) {
      const data = response.data.data || {}
      
      // Transform API shape to form-consumable structure
      configDetail.value = {
        id: data.id,
        key: data.key || '',
        value: data.value || '',
        type: data.type || 'string',
        group: data.group || '',
        description: data.description || '',
        default_value: data.default_value || '',
        validation_rules: data.validation_rules || '',
        sort_order: data.sort_order || 0,
        status: data.status || 'active',
        is_public: Boolean(data.is_public),
        is_encrypted: Boolean(data.is_encrypted),
        created_at: data.created_at || null,
        updated_at: data.updated_at || null
      }
    }
  } catch (error) {
    // Fallback to props data if API fails
    configDetail.value = props.config
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
