<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản mới
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            đăng nhập vào tài khoản hiện có
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập họ và tên"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập địa chỉ email"
            >
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập số điện thoại"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập mật khẩu"
            >
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập lại mật khẩu"
            >
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
            Tôi đồng ý với 
            <a href="#" class="text-blue-600 hover:text-blue-500">điều khoản sử dụng</a>
            và 
            <a href="#" class="text-blue-600 hover:text-blue-500">chính sách bảo mật</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {{ success }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: 'auth',
  title: 'Đăng ký',
  description: 'Đăng ký tài khoản mới',
  requiresGuest: true
})

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const authStore = useAuthStore()

// Computed properties
const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword && 
         form.value.agreeTerms &&
         form.value.password === form.value.confirmPassword
})

// Methods
const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Vui lòng điền đầy đủ thông tin và xác nhận mật khẩu'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password
    })

    if (result.success) {
      success.value = 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
      // Reset form
      form.value = {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      }
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigateTo('/auth/login')
      }, 3000)
    } else {
      error.value = result.message || 'Có lỗi xảy ra trong quá trình đăng ký'
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra, vui lòng thử lại'
  } finally {
    loading.value = false
  }
}
</script>
