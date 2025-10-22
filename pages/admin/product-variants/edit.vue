<template>
  <div>
    <ProductVariantForm 
      v-if="showModal"
      :show="showModal"
      :variant="variant"
      :status-enums="statusEnums"
      :product-enums="productEnums"
      :attribute-enums="attributeEnums"
      :api-errors="apiErrors"
      @submit="handleSubmit" 
      @cancel="onClose" 
    />
  </div>
</template>

<script setup>
import ProductVariantForm from './form.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  variant: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  productEnums: {
    type: Array,
    default: () => []
  },
  attributeEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: Object,
  onClose: Function
})

const emit = defineEmits(['updated'])

const showModal = ref(false)

watch(() => props.show, (newValue) => {
  showModal.value = newValue
}, { immediate: true })

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