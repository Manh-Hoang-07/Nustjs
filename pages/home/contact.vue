<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg animate-float">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h1 class="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 animate-fade-in">
            Liên hệ với chúng tôi
          </h1>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn cho chúng tôi và chúng tôi sẽ phản hồi trong thời gian sớm nhất!
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Contact Form -->
        <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 border border-white/20 hover:scale-[1.02]">
          <div class="flex items-center mb-6 lg:mb-8">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg">
              <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <h2 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Gửi tin nhắn</h2>
          </div>
          
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
        <div class="space-y-6 lg:space-y-8">
          <!-- Contact Details -->
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 border border-white/20 hover:scale-[1.02]">
            <div class="flex items-center mb-6 lg:mb-8">
              <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg">
                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text text-transparent">Thông tin liên hệ</h2>
            </div>
            
            <div class="space-y-4 lg:space-y-6">
              <!-- Email -->
              <div class="group/contact flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl hover:bg-blue-50/50 transition-all duration-300 cursor-pointer">
                <div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/contact:shadow-xl group-hover/contact:scale-110 transition-all duration-300">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover/contact:text-blue-600 transition-colors duration-300">Email</h3>
                  <p v-if="siteInfo.email" class="text-sm lg:text-base text-gray-600 hover:text-blue-500 transition-colors duration-300">{{ siteInfo.email }}</p>
                  <p v-else class="text-sm lg:text-base text-gray-500">Thông tin email đang được cập nhật...</p>
                </div>
              </div>

              <!-- Phone -->
              <div class="group/contact flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300 cursor-pointer">
                <div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/contact:shadow-xl group-hover/contact:scale-110 transition-all duration-300">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover/contact:text-green-600 transition-colors duration-300">Điện thoại</h3>
                  <p v-if="siteInfo.phone" class="text-sm lg:text-base text-gray-600 hover:text-green-500 transition-colors duration-300">{{ siteInfo.phone }}</p>
                  <p v-else class="text-sm lg:text-base text-gray-500">Thông tin điện thoại đang được cập nhật...</p>
                </div>
              </div>

              <!-- Address -->
              <div class="group/contact flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl hover:bg-purple-50/50 transition-all duration-300 cursor-pointer">
                <div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/contact:shadow-xl group-hover/contact:scale-110 transition-all duration-300">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover/contact:text-purple-600 transition-colors duration-300">Địa chỉ</h3>
                  <p v-if="siteInfo.address" class="text-sm lg:text-base text-gray-600 hover:text-purple-500 transition-colors duration-300">{{ siteInfo.address }}</p>
                  <p v-else class="text-sm lg:text-base text-gray-500">Thông tin địa chỉ đang được cập nhật...</p>
                </div>
              </div>

              <!-- Working Hours -->
              <div class="group/contact flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl hover:bg-yellow-50/50 transition-all duration-300 cursor-pointer">
                <div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/contact:shadow-xl group-hover/contact:scale-110 transition-all duration-300">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover/contact:text-yellow-600 transition-colors duration-300">Giờ làm việc</h3>
                  <p class="text-sm lg:text-base text-gray-600 hover:text-yellow-500 transition-colors duration-300">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                  <p class="text-sm lg:text-base text-gray-600 hover:text-yellow-500 transition-colors duration-300">Thứ 7: 8:00 - 12:00</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Section -->
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 border border-white/20 hover:scale-[1.02]">
            <div class="flex items-center mb-6 lg:mb-8">
              <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg">
                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">Câu hỏi thường gặp</h2>
            </div>
            
            <div class="space-y-4 lg:space-y-6">
              <div class="group/faq p-4 lg:p-6 rounded-xl border border-gray-200/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer">
                <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 group-hover/faq:text-indigo-600 transition-colors duration-300 flex items-center">
                  <div class="w-2 h-2 bg-indigo-500 rounded-full mr-2 lg:mr-3 group-hover/faq:bg-indigo-600 transition-colors duration-300 flex-shrink-0"></div>
                  Thời gian phản hồi là bao lâu?
                </h3>
                <p class="text-sm lg:text-base text-gray-600 ml-4 lg:ml-5 leading-relaxed">Chúng tôi thường phản hồi trong vòng 24 giờ trong ngày làm việc.</p>
              </div>
              
              <div class="group/faq p-4 lg:p-6 rounded-xl border border-gray-200/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer">
                <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 group-hover/faq:text-indigo-600 transition-colors duration-300 flex items-center">
                  <div class="w-2 h-2 bg-indigo-500 rounded-full mr-2 lg:mr-3 group-hover/faq:bg-indigo-600 transition-colors duration-300 flex-shrink-0"></div>
                  Tôi có thể gọi điện trực tiếp không?
                </h3>
                <p class="text-sm lg:text-base text-gray-600 ml-4 lg:ml-5 leading-relaxed">Có, bạn có thể gọi số hotline +84 123 456 789 trong giờ làm việc.</p>
              </div>
              
              <div class="group/faq p-4 lg:p-6 rounded-xl border border-gray-200/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer">
                <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 group-hover/faq:text-indigo-600 transition-colors duration-300 flex items-center">
                  <div class="w-2 h-2 bg-indigo-500 rounded-full mr-2 lg:mr-3 group-hover/faq:bg-indigo-600 transition-colors duration-300 flex-shrink-0"></div>
                  Có hỗ trợ khẩn cấp không?
                </h3>
                <p class="text-sm lg:text-base text-gray-600 ml-4 lg:ml-5 leading-relaxed">Có, chúng tôi có dịch vụ hỗ trợ 24/7 cho các vấn đề khẩn cấp.</p>
              </div>
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
import { CONTACT_ENDPOINTS } from '@/api/endpoints'
import api from '@/api/apiClient'
import { useToast } from '@/composables/ui/useToast'
import { useSystemConfigInfo } from '@/composables/system/useSystemConfig'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'

// Sử dụng system config
const { siteInfo } = useSystemConfigInfo()

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
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}

/* Custom form field styles */
:deep(.form-field) {
  @apply transition-all duration-300;
}

:deep(.form-field input:focus),
:deep(.form-field textarea:focus) {
  @apply ring-2 ring-blue-500/20 border-blue-500 shadow-lg;
}

:deep(.form-field input:hover),
:deep(.form-field textarea:hover) {
  @apply border-gray-400 shadow-md;
}

/* Custom button styles */
:deep(.btn-primary) {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl;
}

:deep(.btn-primary:active) {
  @apply scale-95;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-blue-500 to-purple-500 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply from-blue-600 to-purple-600;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Gradient text animation */
.gradient-text {
  background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Hover effects for contact items */
.group\/contact:hover .contact-icon {
  @apply transform scale-110 rotate-3;
}

.contact-icon {
  @apply transition-all duration-300;
}

/* Mobile responsive improvements */
@media (max-width: 768px) {
  .animate-fade-in {
    animation-duration: 0.6s;
  }
  
  .group:hover {
    @apply scale-100;
  }
}
</style>
