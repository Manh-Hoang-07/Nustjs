<template>
  <Modal :show="show" :on-close="onClose" size="lg">
    <div class="p-6 max-h-[80vh] overflow-y-auto overflow-x-hidden">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
      <template v-else>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Chi tiết liên hệ</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">ID: #{{ contactData?.id }}</span>
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="(
                statusEnums.find(s => s.value === contactData?.status)?.class ||
                statusEnums.find(s => s.value === contactData?.status)?.badge_class ||
                statusEnums.find(s => s.value === contactData?.status)?.color_class ||
                'bg-gray-100 text-gray-800'
              )"
            >
              {{ getStatusLabel(contactData?.status) }}
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
              <p class="text-gray-900">{{ contactData?.name || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Email:</label>
              <p class="text-gray-900">
                <a :href="`mailto:${contactData?.email}`" class="text-blue-600 hover:text-blue-800">
                  {{ contactData?.email }}
                </a>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Số điện thoại:</label>
              <p class="text-gray-900">
                <a v-if="contactData?.phone" :href="`tel:${contactData?.phone}`" class="text-blue-600 hover:text-blue-800">
                  {{ contactData?.phone }}
                </a>
                <span v-else class="text-gray-400">N/A</span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Chủ đề:</label>
              <p class="text-gray-900">{{ contactData?.subject || 'Không có chủ đề' }}</p>
            </div>
          </div>
        </div>

        <!-- Thông tin hệ thống -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h3>
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-600">Ngày tạo:</label>
              <p class="text-gray-900">{{ formatDate(contactData?.created_at) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Cập nhật lần cuối:</label>
              <p class="text-gray-900">{{ formatDate(contactData?.updated_at) }}</p>
            </div>
            <div v-if="contactData?.responded_at">
              <label class="text-sm font-medium text-gray-600">Ngày phản hồi:</label>
              <p class="text-gray-900">{{ formatDate(contactData?.responded_at) }}</p>
            </div>
            <div v-if="contactData?.admin">
              <label class="text-sm font-medium text-gray-600">Admin xử lý:</label>
              <p class="text-gray-900">{{ contactData?.admin?.name || contactData?.admin?.email }}</p>
            </div>
          </div>
        </div>
        </div>

        <!-- Nội dung tin nhắn -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Nội dung tin nhắn</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <pre class="text-gray-900 whitespace-pre-wrap break-words text-sm leading-6">{{ formattedContent }}</pre>
          </div>
        </div>

        <!-- Ghi chú admin -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ghi chú admin</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p v-if="contactData?.admin_notes" class="text-gray-900 whitespace-pre-wrap">{{ contactData?.admin_notes }}</p>
            <p v-else class="text-gray-400 italic">Chưa có ghi chú</p>
          </div>
        </div>

        <!-- Footer: view-only -->
        <div class="flex items-center justify-end pt-6 border-t border-gray-200">
          <button
            @click="onClose"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </template>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// Removed static enum imports; enums are loaded via API
import Modal from '@/components/Core/Modal/Modal.vue'
import { useApiClient } from '@/composables/api/useApiClient'
import { adminEndpoints as endpoints } from '@/api/endpoints'
import { useToast } from '@/composables/ui/useToast'

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
const emit = defineEmits([])

// State
const statusEnums = ref([])
const { showSuccess, showError } = useToast()
const loading = ref(false)
const contactData = ref(null)

const formattedContent = computed(() => {
  const content = contactData.value?.content
  if (content == null) return ''
  if (typeof content === 'object') {
    try { return JSON.stringify(content, null, 2) } catch { return String(content) }
  }
  if (typeof content === 'string') {
    try {
      const obj = JSON.parse(content)
      return JSON.stringify(obj, null, 2)
    } catch {
      return content
    }
  }
  return String(content)
})

// Methods
function getStatusLabel(status) {
  const found = (statusEnums.value || []).find(s => s.value === status)
  return found?.label || status || 'Không xác định'
}

// Removed getStatusClass; class is derived from API enums directly in template

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

// Removed unused updateStatus and markAsResponded functions

// Load enums and fetch details when modal opens
onMounted(async () => {
  try {
    const response = await api.get(endpoints.enums('contact_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    } else {
      statusEnums.value = []
    }
  } catch (e) {
    statusEnums.value = []
  }
})

watch(() => props.show, async (val) => {
  if (val && props.contact?.id) {
    await fetchContactDetails()
  }
}, { immediate: true })

async function fetchContactDetails() {
  if (!props.contact?.id) return
  loading.value = true
  try {
    // Try canonical show endpoint first
    const response = await api.get(endpoints.contacts.show(props.contact.id))
    contactData.value = response.data?.data ?? response.data ?? null
    if (!contactData.value) {
      throw new Error('Empty response from contacts.show')
    }
  } catch (error) {
    try {
      // Fallback: some APIs support filtering by ids on list
      const fallback = await api.get(`${endpoints.contacts.list}?ids=${props.contact.id}`)
      const arr = fallback.data?.data ?? []
      const found = Array.isArray(arr) ? arr.find(it => it.id == props.contact.id) : null
      contactData.value = found || props.contact
    } catch (e) {
      contactData.value = props.contact
    }
  } finally {
    loading.value = false
  }
}
</script>


