<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn cho chúng tôi!
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Gửi tin nhắn</h2>
          
          <FormWrapper
            :default-values="defaultValues"
            :rules="validationRules"
            :api-errors="apiErrors"
            submit-text="Gửi tin nhắn"
            submitting-text="Đang gửi..."
            @submit="handleSubmit"
            @cancel="resetForm"
          >
            <template #default="{ form, errors, clearError, isSubmitting }">
              <!-- Name Field -->
              <FormField
                v-model="form.name"
                label="Họ và tên"
                name="name"
                type="text"
                :error="errors.name"
                required
                placeholder="Nhập họ và tên của bạn"
                @update:model-value="clearError('name')"
              />

              <!-- Email Field -->
              <FormField
                v-model="form.email"
                label="Email"
                name="email"
                type="email"
                :error="errors.email"
                required
                placeholder="Nhập email của bạn"
                @update:model-value="clearError('email')"
              />

              <!-- Phone Field -->
              <FormField
                v-model="form.phone"
                label="Số điện thoại"
                name="phone"
                type="tel"
                :error="errors.phone"
                placeholder="Nhập số điện thoại của bạn"
                @update:model-value="clearError('phone')"
              />

              <!-- Subject Field -->
              <FormField
                v-model="form.subject"
                label="Chủ đề"
                name="subject"
                type="text"
                :error="errors.subject"
                placeholder="Nhập chủ đề tin nhắn"
                @update:model-value="clearError('subject')"
              />

              <!-- Content Field -->
              <FormField
                v-model="form.content"
                label="Nội dung"
                name="content"
                type="textarea"
                :error="errors.content"
                :rows="6"
                required
                placeholder="Nhập nội dung tin nhắn của bạn..."
                @update:model-value="clearError('content')"
              />
            </template>
          </FormWrapper>
        </div>

        <!-- Contact Information -->
        <div class="space-y-8">
          <!-- Contact Details -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Thông tin liên hệ</h2>
            
            <div class="space-y-6">
              <!-- Email -->
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Email</h3>
                  <p class="text-gray-600">support@example.com</p>
                  <p class="text-gray-600">info@example.com</p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Điện thoại</h3>
                  <p class="text-gray-600">+84 123 456 789</p>
                  <p class="text-gray-600">+84 987 654 321</p>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Địa chỉ</h3>
                  <p class="text-gray-600">123 Đường ABC, Quận XYZ</p>
                  <p class="text-gray-600">Hà Nội, Việt Nam</p>
                </div>
              </div>

              <!-- Working Hours -->
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Giờ làm việc</h3>
                  <p class="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                  <p class="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Section -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
            
            <div class="space-y-4">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Thời gian phản hồi là bao lâu?</h3>
                <p class="text-gray-600">Chúng tôi thường phản hồi trong vòng 24 giờ trong ngày làm việc.</p>
              </div>
              
              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Tôi có thể gọi điện trực tiếp không?</h3>
                <p class="text-gray-600">Có, bạn có thể gọi số hotline +84 123 456 789 trong giờ làm việc.</p>
              </div>
              
              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Có hỗ trợ khẩn cấp không?</h3>
                <p class="text-gray-600">Có, chúng tôi có dịch vụ hỗ trợ 24/7 cho các vấn đề khẩn cấp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { CONTACT_ENDPOINTS } from '../../api/endpoints.js'
import api from '../../api/apiClient.js'
import { useToast } from '../../composables/ui/useToast.js'
import FormWrapper from '../../components/Core/Form/FormWrapper.vue'
import FormField from '../../components/Core/Form/FormField.vue'

// Page meta
definePageMeta({
  layout: 'home',
  title: 'Liên hệ - E-Commerce Platform',
  description: 'Liên hệ với chúng tôi để được hỗ trợ và tư vấn'
})

// Toast composable
const { showToast } = useToast()

// Form state
const apiErrors = reactive({})

// Default values
const defaultValues = computed(() => ({
  name: '',
  email: '',
  phone: '',
  subject: '',
  content: ''
}))

// Validation rules
const validationRules = computed(() => ({
  name: [
    { required: 'Họ và tên là bắt buộc.' },
    { max: [255, 'Họ và tên không được vượt quá 255 ký tự.'] }
  ],
  email: [
    { required: 'Email là bắt buộc.' },
    { email: 'Email không hợp lệ.' }
  ],
  phone: [
    { max: [20, 'Số điện thoại không được vượt quá 20 ký tự.'] },
    { pattern: [/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ.'] }
  ],
  subject: [
    { max: [255, 'Chủ đề không được vượt quá 255 ký tự.'] }
  ],
  content: [
    { required: 'Nội dung là bắt buộc.' },
    { min: [10, 'Nội dung phải có ít nhất 10 ký tự.'] },
    { max: [2000, 'Nội dung không được vượt quá 2000 ký tự.'] }
  ]
}))

// Submit contact form
const handleSubmit = async (formData) => {
  try {
    const response = await api.post(CONTACT_ENDPOINTS.PUBLIC_CONTACTS, {
      name: formData.name?.trim() || null,
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      subject: formData.subject?.trim() || null,
      content: formData.content.trim()
    })
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: 'Gửi tin nhắn thành công!',
        message: 'Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.'
      })
      
      // Reset form by clearing API errors
      Object.keys(apiErrors).forEach(key => delete apiErrors[key])
    }
  } catch (error) {
    console.error('Contact submission error:', error)
    
    if (error.response?.data?.errors) {
      Object.assign(apiErrors, error.response.data.errors)
    } else {
      showToast({
        type: 'error',
        title: 'Lỗi gửi tin nhắn',
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
      })
    }
  }
}

// Reset form
const resetForm = () => {
  Object.keys(apiErrors).forEach(key => delete apiErrors[key])
}
</script>

<style scoped>
/* Custom styles for contact page */
</style>
