<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full opacity-5 blur-3xl"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
          Chào mừng trở lại
        </h2>
        <p class="text-gray-600 text-lg">
          Đăng nhập vào tài khoản của bạn
        </p>
      </div>
      
      <!-- Form Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
        <!-- Card Decoration -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div class="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div class="absolute bottom-4 left-4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
        
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
              <div class="space-y-2 group">
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
              <div class="space-y-2 group">
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
                
                <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 hover:scale-105">
                  Quên mật khẩu?
                </a>
              </div>

              <!-- Error Message -->
              <div v-if="generalError" class="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
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
          <NuxtLink to="/register" class="font-semibold text-blue-600 hover:text-blue-500 transition-all duration-200 hover:scale-105 inline-block">
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
  @apply transition-all duration-300 ease-out;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

:deep(.form-field input:focus) {
  @apply ring-2 ring-blue-500 ring-opacity-50;
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04);
}

:deep(.form-field input[type="checkbox"]) {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
  transition: all 0.2s ease;
}

:deep(.form-field input[type="checkbox"]:checked) {
  transform: scale(1.1);
}

:deep(.form-field label) {
  @apply text-sm font-semibold text-gray-700 mb-2;
  transition: all 0.2s ease;
}

:deep(.form-field:hover label) {
  @apply text-blue-600;
}

:deep(.form-field .text-red-500) {
  @apply text-sm mt-1;
  animation: shake 0.5s ease-in-out;
}

/* Custom button styles */
:deep(.form-wrapper button[type="submit"]) {
  @apply w-full text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-xl;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

:deep(.form-wrapper button[type="submit"]:before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

:deep(.form-wrapper button[type="submit"]:hover:before) {
  left: 100%;
}

:deep(.form-wrapper button[type="submit"]:disabled) {
  @apply opacity-50 cursor-not-allowed transform-none;
}

/* Animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Floating animation for background elements */
.absolute:nth-child(1) { animation: float 6s ease-in-out infinite; }
.absolute:nth-child(2) { animation: float 6s ease-in-out infinite reverse; }
.absolute:nth-child(3) { animation: float 8s ease-in-out infinite; }

/* Glass morphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Enhanced focus states */
:deep(.form-field input:focus + label) {
  @apply text-blue-600;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 
