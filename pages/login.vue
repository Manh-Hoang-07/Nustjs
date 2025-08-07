<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            đăng ký tài khoản mới
          </NuxtLink>
        </p>
      </div>
      
      <div class="mt-8 space-y-6">
        <FormWrapper
          :default-values="defaultValues"
          :rules="validationRules"
          :api-errors="apiErrors"
          :show-cancel-button="false"
          submit-text="Đăng nhập"
          submitting-text="Đang đăng nhập..."
          @submit="handleSubmit"
        >
          <template #default="{ form, errors, clearError, isSubmitting }">
            <div class="space-y-6">
              <!-- Email Field -->
              <FormField
                v-model="form.email"
                name="email"
                type="email"
                label="Email"
                placeholder="Nhập email của bạn"
                :error="errors.email"
                required
                autocomplete="email"
                @update:model-value="clearError('email')"
              />

              <!-- Password Field -->
              <FormField
                v-model="form.password"
                name="password"
                type="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu của bạn"
                :error="errors.password"
                required
                autocomplete="current-password"
                @update:model-value="clearError('password')"
              />

              <!-- Remember Me Checkbox -->
              <FormField
                v-model="form.remember"
                name="remember"
                type="checkbox"
                checkbox-label="Ghi nhớ đăng nhập"
              />

              <!-- Forgot Password Link -->
              <div class="text-sm text-right">
                <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </a>
              </div>

              <!-- Error Message -->
              <div v-if="generalError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {{ generalError }}
              </div>
            </div>
          </template>
        </FormWrapper>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormWrapper from '../components/Core/Form/FormWrapper.vue'
import FormField from '../components/Core/Form/FormField.vue'

// Page meta
definePageMeta({
  layout: 'auth',
  title: 'Đăng nhập',
  description: 'Đăng nhập vào hệ thống',
  requiresGuest: true
})

// Form data
const defaultValues = {
  email: '',
  password: '',
  remember: false
}

// Validation rules
const validationRules = {
  email: [
    { required: 'Email là bắt buộc' },
    { email: 'Email không hợp lệ' }
  ],
  password: [
    { required: 'Mật khẩu là bắt buộc' },
    { min: [6, 'Mật khẩu phải có ít nhất 6 ký tự'] }
  ]
}

const apiErrors = ref({})
const generalError = ref('')

const authStore = useAuthStore()

// Methods
const handleSubmit = async (form) => {
  generalError.value = ''
  apiErrors.value = {}

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
      remember: form.remember
    })

    if (result.success) {
      // Redirect based on user role
      if (authStore.isAdmin) {
        await navigateTo('/admin')
      } else {
        await navigateTo('/user')
      }
    } else {
      // Handle API errors
      if (result.errors) {
        apiErrors.value = result.errors
      } else {
        generalError.value = result.message || 'Đăng nhập thất bại'
      }
    }
  } catch (err) {
    generalError.value = 'Có lỗi xảy ra, vui lòng thử lại'
  }
}
</script> 
