<template>
  <div>
    <AttributeValuesIndex />
  </div>
</template>

<script setup>
import AttributeValuesIndex from '/pages/admin/AttributeValues/index.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script> 
