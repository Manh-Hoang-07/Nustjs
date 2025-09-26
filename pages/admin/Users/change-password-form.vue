<template>
  <Modal v-model="modalVisible" :title="formTitle">
    <FormWrapper
      :default-values="defaultValues"
      :rules="validationRules"
      :api-errors="apiErrors"
      submit-text="Ð?i m?t kh?u"
      @submit="handleSubmit"
      @cancel="onClose"
    >
      <template #default="{ form, errors, clearError, isSubmitting }">
        <!-- M?t kh?u m?i -->
        <FormField
          v-model="form.password"
          label="M?t kh?u m?i"
          name="password"
          type="password"
          :error="errors.password"
          required
          autocomplete="new-password"
          @update:model-value="clearError('password')"
        />
        
        <!-- Xác nh?n m?t kh?u m?i -->
        <FormField
          v-model="form.password_confirmation"
          label="Xác nh?n m?t kh?u m?i"
          name="password_confirmation"
          type="password"
          :error="errors.password_confirmation"
          required
          autocomplete="new-password"
          @update:model-value="clearError('password_confirmation')"
        />
      </template>
    </FormWrapper>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'

const props = defineProps({
  show: Boolean,
  user: Object,
  apiErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formTitle = computed(() => `Ð?i m?t kh?u cho ${props.user?.username || 'ngu?i dùng'}`)
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

const defaultValues = {
  password: '',
  password_confirmation: ''
}

const validationRules = {
  password: [
    { required: 'M?t kh?u m?i là b?t bu?c.' },
    { min: [8, 'M?t kh?u ph?i có ít nh?t 8 ký t?.'] }
  ],
  password_confirmation: [
    { required: 'Vui lòng xác nh?n m?t kh?u m?i.' },
    { match: ['password', 'M?t kh?u xác nh?n không kh?p.'] }
  ]
}

function handleSubmit(form) {
  emit('submit', form)
}

function onClose() {
  emit('cancel')
}
</script> 

