<template>
  <Modal v-model="modalVisible" :title="formTitle" :loading="loading">
    <FormWrapper
      :default-values="defaultValues"
      :rules="validationRules"
      :api-errors="apiErrors"
      :submit-text="user ? 'C?p nh?t' : 'Thêm m?i'"
      @submit="handleSubmit"
      @cancel="onClose"
    >
      <template #default="{ form, errors, clearError, isSubmitting }">
        <!-- Tên dang nh?p -->
        <FormField
          v-model="form.username"
          label="Tên dang nh?p"
          name="username"
          :error="errors.username"
          required
          autocomplete="username"
          @update:model-value="clearError('username')"
        />
        
        <!-- Email -->
        <FormField
          v-model="form.email"
          label="Email"
          name="email"
          type="email"
          :error="errors.email"
          required
          autocomplete="email"
          @update:model-value="clearError('email')"
        />
        
        <!-- S? di?n tho?i -->
        <FormField
          v-model="form.phone"
          label="S? di?n tho?i"
          name="phone"
          type="tel"
          :error="errors.phone"
          autocomplete="tel"
          @update:model-value="clearError('phone')"
        />
        
        <!-- M?t kh?u -->
        <FormField
          v-if="!user"
          v-model="form.password"
          label="M?t kh?u"
          name="password"
          type="password"
          :error="errors.password"
          required
          autocomplete="new-password"
          @update:model-value="clearError('password')"
        />
        
        <FormField
          v-if="!user"
          v-model="form.password_confirmation"
          label="Xác nh?n m?t kh?u"
          name="password_confirmation"
          type="password"
          :error="errors.password_confirmation"
          required
          autocomplete="new-password"
          @update:model-value="clearError('password_confirmation')"
        />
        
        <!-- H? tên -->
        <FormField
          v-model="form.name"
          label="H? tên"
          name="name"
          :error="errors.name"
          autocomplete="name"
          @update:model-value="clearError('name')"
        />
        
        <!-- Gi?i tính -->
        <FormField
          v-model="form.gender"
          label="Gi?i tính"
          name="gender"
          type="select"
          :options="genderOptions"
          :error="errors.gender"
          @update:model-value="clearError('gender')"
        />
        
        <!-- Ngày sinh -->
        <FormField
          v-model="form.birthday"
          label="Ngày sinh"
          name="birthday"
          type="date"
          :error="errors.birthday"
          @update:model-value="clearError('birthday')"
        />
        
        <!-- Ð?a ch? -->
        <FormField
          v-model="form.address"
          label="Ð?a ch?"
          name="address"
          :error="errors.address"
          autocomplete="street-address"
          @update:model-value="clearError('address')"
        />
        
        <!-- ?nh d?i di?n -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="user-image">?nh d?i di?n</label>
          <ImageUploader
            v-model="form.image"
            :default-url="imageUrl"
            @remove="form.remove_image = true"
          />
        </div>
        
        <!-- Gi?i thi?u -->
        <FormField
          v-model="form.about"
          label="Gi?i thi?u"
          name="about"
          type="textarea"
          :error="errors.about"
          autocomplete="off"
          @update:model-value="clearError('about')"
        />
        
        
        
        <!-- Tr?ng thái -->
        <FormField
          v-model="form.status"
          label="Tr?ng thái"
          name="status"
          type="select"
          :options="statusOptions"
          :error="errors.status"
          @update:model-value="clearError('status')"
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
import ImageUploader from '@/components/Core/Image/ImageUploader.vue'
import { useFormDefaults } from '@/utils/form'

const props = defineProps({
  show: Boolean,
  user: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  genderEnums: {
    type: Array,
    default: () => []
  },
  
  apiErrors: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formTitle = computed(() => props.user ? 'Ch?nh s?a ngu?i dùng' : 'Thêm ngu?i dùng m?i')
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

const defaultValues = computed(() => {
  const obj = props.user || {}
  
  return {
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    name: '',
    gender: '',
    birthday: '',
    address: '',
    image: null,
    about: '',
    status: '',
    remove_image: false,
    ...obj
  }
})

const imageUrl = computed(() => props.user?.image || null)

const validationRules = computed(() => ({
  username: [
    { required: 'Tên dang nh?p là b?t bu?c.' },
    { max: [50, 'Tên dang nh?p không du?c vu?t quá 50 ký t?.'] }
  ],
  email: [
    { required: 'Email là b?t bu?c.' },
    { email: 'Email không h?p l?.' }
  ],
  phone: [
    { max: [20, 'S? di?n tho?i không du?c vu?t quá 20 ký t?.'] }
  ],
  password: props.user ? [] : [
    { required: 'M?t kh?u là b?t bu?c.' },
    { min: [8, 'M?t kh?u ph?i có ít nh?t 8 ký t?.'] }
  ],
  password_confirmation: props.user ? [] : [
    { required: 'Vui lòng xác nh?n m?t kh?u.' }
  ],
  name: [
    { max: [255, 'H? tên không du?c vu?t quá 255 ký t?.'] }
  ],
  address: [
    { max: [255, 'Ð?a ch? không du?c vu?t quá 255 ký t?.'] }
  ],
  about: [
    { max: [500, 'Gi?i thi?u không du?c vu?t quá 500 ký t?.'] }
  ]
}))

const statusOptions = computed(() =>
  (props.statusEnums || []).map(opt => ({
    value: opt.value,
    label: opt.label
  }))
)

const genderOptions = computed(() =>
  (props.genderEnums || []).map(opt => ({
    value: opt.value,
    label: opt.label
  }))
)

 

function handleSubmit(form) {
  emit('submit', form)
}

function onClose() {
  emit('cancel')
}
</script> 

