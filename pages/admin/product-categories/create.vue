<template>
  <div>
    <CategoryForm 
      v-if="showModal"
      :show="showModal"
      :category="null"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import CategoryForm from './form.vue'

const props = defineProps({
  show: Boolean,
  statusEnums: { type: Array, default: () => [] },
  apiErrors: Object,
  onClose: Function
})

const emit = defineEmits(['created'])

const showModal = computed({ get: () => props.show, set: () => onClose() })

function handleSubmit(formData) { emit('created', formData) }
function onClose() { if (props.onClose) { props.onClose() } }
</script>



