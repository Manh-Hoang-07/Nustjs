<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng trở lại
        </h2>
        <p class="text-gray-600">
          Đăng nhập vào tài khoản của bạn
        </p>
      </div>
      
      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
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
              <div class="space-y-2">
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
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
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
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <FormField
                  v-model="form.remember"
                  name="remember"
                  type="checkbox"
                  checkbox-label="Ghi nhớ đăng nhập"
                />
                
                <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Quên mật khẩu?
                </a>
              </div>

              <!-- Error Message -->
              <div v-if="generalError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {{ generalError }}
                </div>
              </div>
            </div>
          </template>
        </FormWrapper>
      </div>

      <!-- Register Link -->
      <div class="text-center mt-8">
        <p class="text-gray-600">
          Chưa có tài khoản?
          <NuxtLink to="/register" class="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
            Đăng ký ngay
          </NuxtLink>
        </p>
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

<style scoped>
/* Custom styles for better form appearance */
:deep(.form-field) {
  margin-bottom: 0;
}

:deep(.form-field input) {
  @apply transition-all duration-200;
}

:deep(.form-field input:focus) {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

:deep(.form-field input[type="checkbox"]) {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}

:deep(.form-field label) {
  @apply text-sm font-medium text-gray-700 mb-2;
}

:deep(.form-field .text-red-500) {
  @apply text-sm mt-1;
}

/* Custom button styles */
:deep(.form-wrapper button[type="submit"]) {
  @apply w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg;
}

:deep(.form-wrapper button[type="submit"]:disabled) {
  @apply opacity-50 cursor-not-allowed transform-none;
}
</style> 
