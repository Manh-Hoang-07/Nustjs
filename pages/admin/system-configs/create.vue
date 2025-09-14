<template>
  <Modal :show="show" @close="onClose">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Thêm cấu hình mới</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Khóa cấu hình -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Khóa cấu hình <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.config_key"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ví dụ: site_name, email_host"
            :class="{ 'border-red-500': errors.config_key }"
          >
          <p v-if="errors.config_key" class="mt-1 text-sm text-red-600">{{ errors.config_key }}</p>
          <p class="mt-1 text-xs text-gray-500">Khóa cấu hình không thể thay đổi sau khi tạo</p>
        </div>

        <!-- Tên hiển thị -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tên hiển thị <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.display_name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ví dụ: Tên website, Host email"
            :class="{ 'border-red-500': errors.display_name }"
          >
          <p v-if="errors.display_name" class="mt-1 text-sm text-red-600">{{ errors.display_name }}</p>
        </div>

        <!-- Mô tả -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mô tả chi tiết về cấu hình này..."
          ></textarea>
        </div>

        <!-- Giá trị -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Giá trị <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.config_value"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập giá trị cấu hình..."
            :class="{ 'border-red-500': errors.config_value }"
          >
          <p v-if="errors.config_value" class="mt-1 text-sm text-red-600">{{ errors.config_value }}</p>
        </div>

        <!-- Nhóm và Loại -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nhóm <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.config_group"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.config_group }"
            >
              <option value="general">Cài đặt chung</option>
              <option value="email">Cài đặt email</option>
              <option value="security">Cài đặt bảo mật</option>
            </select>
            <p v-if="errors.config_group" class="mt-1 text-sm text-red-600">{{ errors.config_group }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Loại <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.config_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.config_type }"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="email">Email</option>
              <option value="file">File</option>
            </select>
            <p v-if="errors.config_type" class="mt-1 text-sm text-red-600">{{ errors.config_type }}</p>
          </div>
        </div>

        <!-- Thứ tự sắp xếp và Trạng thái -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Thứ tự sắp xếp</label>
            <input
              v-model.number="form.sort_order"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        <!-- Validation rules -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Quy tắc validation</label>
          <input
            v-model="form.validation_rules"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ví dụ: required|email|min:3"
          >
          <p class="mt-1 text-xs text-gray-500">Các quy tắc validation Laravel (tùy chọn)</p>
        </div>

        <!-- Default value -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Giá trị mặc định</label>
          <input
            v-model="form.default_value"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Giá trị mặc định khi chưa được cấu hình"
          >
        </div>

        <!-- Checkboxes -->
        <div class="flex items-center space-x-6">
          <label class="flex items-center">
            <input
              v-model="form.is_public"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            <span class="ml-2 text-sm text-gray-700">Công khai</span>
          </label>
          
          <label class="flex items-center">
            <input
              v-model="form.is_required"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            <span class="ml-2 text-sm text-gray-700">Bắt buộc</span>
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="onClose"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Đang tạo...' : 'Tạo cấu hình' }}
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useSystemConfig } from '@/composables/api'
import { useToast } from '@/composables/ui/useToast'
import Modal from '@/components/Core/Modal/Modal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  onClose: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['created'])

const { createConfig } = useSystemConfig()
const { showSuccess, showError } = useToast()

// Form state
const loading = ref(false)
const errors = ref({})

const form = reactive({
  config_key: '',
  display_name: '',
  description: '',
  config_value: '',
  config_group: 'general',
  config_type: 'string',
  is_public: false,
  is_required: false,
  validation_rules: '',
  default_value: '',
  sort_order: 0,
  status: 'active'
})

// Validation
const validateForm = () => {
  errors.value = {}
  
  if (!form.config_key.trim()) {
    errors.value.config_key = 'Khóa cấu hình là bắt buộc'
  }
  
  if (!form.display_name.trim()) {
    errors.value.display_name = 'Tên hiển thị là bắt buộc'
  }
  
  if (!form.config_value.trim()) {
    errors.value.config_value = 'Giá trị cấu hình là bắt buộc'
  }
  
  if (!form.config_group) {
    errors.value.config_group = 'Nhóm cấu hình là bắt buộc'
  }
  
  if (!form.config_type) {
    errors.value.config_type = 'Loại cấu hình là bắt buộc'
  }
  
  return Object.keys(errors.value).length === 0
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  errors.value = {}
  
  try {
    await createConfig(form)
    showSuccess('Cấu hình đã được tạo thành công')
    emit('created')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showError('Có lỗi xảy ra khi tạo cấu hình')
    }
  } finally {
    loading.value = false
  }
}
</script>
