<template>
  <div>
    <CategoryForm 
      v-if="showModal"
      :show="showModal"
      :parent-categories="parentCategories"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>
<script setup>
import CategoryForm from './form.vue'
import endpoints from '../../../api/endpoints.js'
import { ref, watch } from 'vue'
import { getEnumSync } from '../../../constants/enums.js'
import { useApiFormSubmit } from '../../../utils/form.js'
import { useApiClient } from '../../../composables/api/useApiClient.js'


const api = useApiClient()

const props = defineProps({
  show: Boolean,
  onClose: Function
})
const emit = defineEmits(['created'])

const showModal = ref(false)
const parentCategories = ref([])
const statusEnums = ref([])

const { apiErrors, submit } = useApiFormSubmit({
  endpoint: endpoints.categories.create,
  emit,
  onClose: props.onClose,
  eventName: 'created',
  method: 'post'
})

watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue) {
    fetchParentCategories()
    fetchStatusEnums()
  }
}, { immediate: true })

async function fetchParentCategories() {
  try {
    const response = await api.get(endpoints.categories.list, {
      params: { per_page: 100 }
    })
    parentCategories.value = response.data.data || []
  } catch (error) {
    parentCategories.value = []
  }
}

async function fetchStatusEnums() {
  try {
    const enumData = getEnumSync('basic_status')
    statusEnums.value = Array.isArray(enumData) ? enumData : []
  } catch (error) {
    statusEnums.value = []
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
