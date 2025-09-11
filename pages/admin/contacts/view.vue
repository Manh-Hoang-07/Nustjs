<template>
  <Modal :show="show" :on-close="onClose" size="lg">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Chi tiết liên hệ</h2>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">ID: #{{ contact?.id }}</span>
          <span 
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(contact?.status)"
          >
            {{ getStatusLabel(contact?.status) }}
          </span>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Thông tin cơ bản -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-600">Họ và tên:</label>
              <p class="text-gray-900">{{ contact?.name || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Email:</label>
              <p class="text-gray-900">
                <a :href="`mailto:${contact?.email}`" class="text-blue-600 hover:text-blue-800">
                  {{ contact?.email }}
                </a>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Số điện thoại:</label>
              <p class="text-gray-900">
                <a v-if="contact?.phone" :href="`tel:${contact?.phone}`" class="text-blue-600 hover:text-blue-800">
                  {{ contact?.phone }}
                </a>
                <span v-else class="text-gray-400">N/A</span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Chủ đề:</label>
              <p class="text-gray-900">{{ contact?.subject || 'Không có chủ đề' }}</p>
            </div>
          </div>
        </div>

        <!-- Thông tin hệ thống -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h3>
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-600">Ngày tạo:</label>
              <p class="text-gray-900">{{ formatDate(contact?.created_at) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Cập nhật lần cuối:</label>
              <p class="text-gray-900">{{ formatDate(contact?.updated_at) }}</p>
            </div>
            <div v-if="contact?.responded_at">
              <label class="text-sm font-medium text-gray-600">Ngày phản hồi:</label>
              <p class="text-gray-900">{{ formatDate(contact?.responded_at) }}</p>
            </div>
            <div v-if="contact?.admin">
              <label class="text-sm font-medium text-gray-600">Admin xử lý:</label>
              <p class="text-gray-900">{{ contact?.admin?.name || contact?.admin?.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Nội dung tin nhắn -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Nội dung tin nhắn</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-900 whitespace-pre-wrap">{{ contact?.content }}</p>
        </div>
      </div>

      <!-- Ghi chú admin -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ghi chú admin</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <p v-if="contact?.admin_notes" class="text-gray-900 whitespace-pre-wrap">{{ contact?.admin_notes }}</p>
          <p v-else class="text-gray-400 italic">Chưa có ghi chú</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-6 border-t border-gray-200">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-600">Cập nhật trạng thái:</label>
          <select 
            :value="contact?.status"
            @change="updateStatus"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option 
              v-for="status in statusEnums" 
              :key="status.value" 
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="markAsResponded"
            v-if="contact?.status !== 'completed'"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Đánh dấu đã phản hồi
          </button>
          <button
            @click="onClose"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getEnumSync, getEnumLabel } from '../../../constants/enums.js'
import Modal from '../../../components/Core/Modal/Modal.vue'
import api from '../../../api/apiClient.js'
import endpoints from '../../../api/endpoints.js'
import { useToast } from '../../../composables/ui/useToast.js'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  contact: {
    type: Object,
    default: null
  },
  onClose: {
    type: Function,
    required: true
  }
})

// Emits
const emit = defineEmits(['status-updated'])

// State
const statusEnums = ref([])
const { showSuccess, showError } = useToast()

// Methods
function getStatusLabel(status) {
  return getEnumLabel('contact_status', status) || status || 'Không xác định'
}

function getStatusClass(status) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function updateStatus(event) {
  const newStatus = event.target.value
  try {
    await api.patch(endpoints.contacts.updateStatus(props.contact.id), {
      status: newStatus
    })
    
    // Update local contact
    props.contact.status = newStatus
    
    showSuccess('Trạng thái đã được cập nhật thành công')
    emit('status-updated')
  } catch (error) {
    console.error('Error updating contact status:', error)
    showError('Không thể cập nhật trạng thái')
  }
}

async function markAsResponded() {
  try {
    await api.patch(endpoints.contacts.markResponded(props.contact.id))
    
    // Update local contact
    props.contact.status = 'completed'
    props.contact.responded_at = new Date().toISOString()
    
    showSuccess('Đã đánh dấu phản hồi thành công')
    emit('status-updated')
  } catch (error) {
    console.error('Error marking contact as responded:', error)
    showError('Không thể đánh dấu phản hồi')
  }
}

// Load enums
onMounted(() => {
  statusEnums.value = getEnumSync('contact_status')
})
</script>


