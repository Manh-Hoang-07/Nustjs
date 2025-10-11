// Script để tạo file index.vue cho tất cả các thư mục nhóm
const groups = [
  { name: 'email', label: 'Cấu hình Email', description: 'Cấu hình gửi email và SMTP' },
  { name: 'database', label: 'Cài đặt Database', description: 'Cài đặt kết nối database' },
  { name: 'storage', label: 'Cấu hình lưu trữ', description: 'Cấu hình lưu trữ file và media' },
  { name: 'security', label: 'Cài đặt bảo mật', description: 'Cài đặt bảo mật và xác thực' },
  { name: 'api', label: 'Cài đặt API', description: 'Cài đặt API và webhook' },
  { name: 'cache', label: 'Cài đặt Cache', description: 'Cấu hình cache và performance' },
  { name: 'notification', label: 'Cài đặt thông báo', description: 'Cài đặt thông báo và alert' },
  { name: 'payment', label: 'Cài đặt thanh toán', description: 'Cấu hình thanh toán và billing' },
  { name: 'custom', label: 'Cài đặt tùy chỉnh', description: 'Cài đặt tùy chỉnh của ứng dụng' }
]

groups.forEach(group => {
  const content = `<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
        <p class="text-gray-600 mt-1">{{ groupDescription }}</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="clearCache" 
          class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none"
          :disabled="loading"
        >
          Xóa cache
        </button>
        <button 
          @click="addNewConfig" 
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
        >
          Thêm cấu hình mới
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          <div class="mt-4">
            <button
              @click="loadConfigs"
              class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form edit cho từng config -->
    <div v-else class="space-y-6">
      <div v-for="config in configs" :key="config.id" class="bg-white shadow-md rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <code class="bg-gray-100 px-2 py-1 rounded text-sm mr-2">{{ config.key }}</code>
              <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{{ getTypeLabel(config.type) }}</span>
            </h3>
            <p v-if="config.description" class="text-sm text-gray-600 mt-1">{{ config.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="config.is_public" class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Public</span>
            <span v-if="config.is_encrypted" class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Encrypted</span>
            <span 
              class="px-2 py-1 text-xs rounded"
              :class="config.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ config.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </div>
        </div>

        <!-- Form edit inline -->
        <form @submit.prevent="updateConfig(config)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Value -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá trị</label>
              <div v-if="config.type === 'boolean'" class="space-y-2">
                <div class="flex items-center">
                  <input
                    :id="\`value_true_\${config.id}\`"
                    v-model="config.value"
                    type="radio"
                    value="true"
                    class="mr-2"
                  />
                  <label :for="\`value_true_\${config.id}\`" class="text-sm text-gray-700">True</label>
                </div>
                <div class="flex items-center">
                  <input
                    :id="\`value_false_\${config.id}\`"
                    v-model="config.value"
                    type="radio"
                    value="false"
                    class="mr-2"
                  />
                  <label :for="\`value_false_\${config.id}\`" class="text-sm text-gray-700">False</label>
                </div>
              </div>
              <textarea
                v-else-if="config.type === 'json' || config.type === 'array'"
                v-model="config.value"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                :placeholder="config.type === 'json' ? 'Nhập JSON...' : 'Nhập mảng JSON...'"
              ></textarea>
              <input
                v-else
                v-model="config.value"
                :type="config.type === 'integer' || config.type === 'float' ? 'number' : 'text'"
                :step="config.type === 'float' ? '0.01' : undefined"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập giá trị..."
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                v-model="config.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mô tả về cấu hình này..."
              ></textarea>
            </div>
          </div>

          <!-- Checkboxes -->
          <div class="flex items-center space-x-6">
            <div class="flex items-center">
              <input
                :id="\`is_public_\${config.id}\`"
                v-model="config.is_public"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="\`is_public_\${config.id}\`" class="ml-2 block text-sm text-gray-700">
                Cấu hình công khai
              </label>
            </div>

            <div class="flex items-center">
              <input
                :id="\`is_encrypted_\${config.id}\`"
                v-model="config.is_encrypted"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="\`is_encrypted_\${config.id}\`" class="ml-2 block text-sm text-gray-700">
                Mã hóa giá trị
              </label>
            </div>

            <div class="flex items-center">
              <input
                :id="\`status_\${config.id}\`"
                v-model="config.status"
                type="checkbox"
                :true-value="'active'"
                :false-value="'inactive'"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="\`status_\${config.id}\`" class="ml-2 block text-sm text-gray-700">
                Hoạt động
              </label>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              @click="deleteConfig(config)"
              class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none"
            >
              Xóa
            </button>
            <button
              type="submit"
              :disabled="updatingConfigs[config.id]"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            >
              {{ updatingConfigs[config.id] ? 'Đang cập nhật...' : 'Cập nhật' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Empty state -->
      <div v-if="configs.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Không có cấu hình</h3>
        <p class="mt-1 text-sm text-gray-500">Chưa có cấu hình nào trong nhóm {{ groupLabel }}.</p>
        <div class="mt-6">
          <button
            @click="addNewConfig"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Thêm cấu hình đầu tiên
          </button>
        </div>
      </div>
    </div>

    <!-- Modal tạo mới -->
    <CreateSystemConfig
      v-if="modals.create"
      :show="modals.create"
      :type-enums="typeEnums"
      :group-enums="groupEnums"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handleConfigCreated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="\`Bạn có chắc chắn muốn xóa cấu hình \${selectedConfig?.key || ''}?\`"
      :on-close="closeDeleteModal"
      @confirm="confirmDeleteConfig"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/ui/useToast'
import { useAdminSystemConfig } from '@/composables/api/useAdminSystemConfig'
import { useSystemConfigGroups } from '@/composables/api/useSystemConfigGroups'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'

// Lazy load components
const CreateSystemConfig = defineAsyncComponent(() => import('../create.vue'))

const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useToast()
const { getConfigsByGroup, updateConfig: updateConfigApi, deleteConfig: deleteConfigApi, clearCache } = useAdminSystemConfig()
const { groups, groupLabels } = useSystemConfigGroups()

// State
const configs = ref([])
const loading = ref(false)
const error = ref('')
const updatingConfigs = ref({})
const selectedConfig = ref(null)
const modals = ref({
  create: false,
  delete: false
})
const apiErrors = ref({})

const typeEnums = ref([
  { value: 'string', label: 'Chuỗi' },
  { value: 'integer', label: 'Số nguyên' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'json', label: 'JSON' },
  { value: 'array', label: 'Mảng' },
  { value: 'float', label: 'Số thực' }
])

const groupEnums = ref([
  { value: 'general', label: 'Cài đặt chung', is_public: true },
  { value: 'email', label: 'Cấu hình Email', is_public: false },
  { value: 'database', label: 'Cài đặt Database', is_public: false },
  { value: 'storage', label: 'Cấu hình lưu trữ', is_public: false },
  { value: 'security', label: 'Cài đặt bảo mật', is_public: false },
  { value: 'api', label: 'Cài đặt API', is_public: true },
  { value: 'cache', label: 'Cài đặt Cache', is_public: false },
  { value: 'notification', label: 'Cài đặt thông báo', is_public: false },
  { value: 'payment', label: 'Cài đặt thanh toán', is_public: false },
  { value: 'custom', label: 'Cài đặt tùy chỉnh', is_public: true }
])

const statusEnums = ref([
  { value: 'active', label: 'Hoạt động', class: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Không hoạt động', class: 'bg-red-100 text-red-800' }
])

// Computed
const groupName = computed(() => '${group.name}') // Fixed for ${group.name} group
const groupLabel = computed(() => groupLabels.value[groupName.value] || groupName.value)
const pageTitle = computed(() => \`Cấu hình \${groupLabel.value}\`)
const groupDescription = computed(() => {
  const descriptions = {
    'general': 'Các cài đặt chung của hệ thống',
    'email': 'Cấu hình gửi email và SMTP',
    'database': 'Cài đặt kết nối database',
    'storage': 'Cấu hình lưu trữ file và media',
    'security': 'Cài đặt bảo mật và xác thực',
    'api': 'Cài đặt API và webhook',
    'cache': 'Cấu hình cache và performance',
    'notification': 'Cài đặt thông báo và alert',
    'payment': 'Cấu hình thanh toán và billing',
    'custom': 'Cài đặt tùy chỉnh của ứng dụng'
  }
  return descriptions[groupName.value] || 'Cấu hình hệ thống'
})

// Methods
async function loadConfigs() {
  loading.value = true
  error.value = ''

  try {
    const data = await getConfigsByGroup(groupName.value)
    configs.value = data || []
  } catch (err) {
    error.value = 'Không thể tải cấu hình'
    console.error('Error loading configs:', err)
  } finally {
    loading.value = false
  }
}

async function updateConfig(config) {
  updatingConfigs.value[config.id] = true

  try {
    // Convert value based on type
    let value = config.value
    if (config.type === 'json' || config.type === 'array') {
      try {
        value = JSON.parse(config.value)
      } catch {
        // Keep as string if parsing fails
      }
    } else if (config.type === 'integer') {
      value = config.value ? parseInt(config.value) : null
    } else if (config.type === 'float') {
      value = config.value ? parseFloat(config.value) : null
    } else if (config.type === 'boolean') {
      value = config.value === 'true'
    }

    await updateConfigApi(config.id, {
      value,
      description: config.description,
      is_public: config.is_public,
      is_encrypted: config.is_encrypted,
      status: config.status
    })

    showSuccess('Cấu hình đã được cập nhật thành công')
  } catch (err) {
    showError('Không thể cập nhật cấu hình')
    console.error('Error updating config:', err)
  } finally {
    updatingConfigs.value[config.id] = false
  }
}

function deleteConfig(config) {
  selectedConfig.value = config
  modals.value.delete = true
}

async function confirmDeleteConfig() {
  if (!selectedConfig.value) return

  try {
    await deleteConfigApi(selectedConfig.value.id)
    showSuccess('Cấu hình đã được xóa thành công')
    await loadConfigs() // Reload configs
  } catch (err) {
    showError('Không thể xóa cấu hình')
  } finally {
    modals.value.delete = false
    selectedConfig.value = null
  }
}

function addNewConfig() {
  modals.value.create = true
}

function closeCreateModal() {
  modals.value.create = false
}

function closeDeleteModal() {
  modals.value.delete = false
  selectedConfig.value = null
}

async function handleConfigCreated() {
  modals.value.create = false
  await loadConfigs() // Reload configs
}

async function clearSystemCache() {
  try {
    await clearCache()
    showSuccess('Cache đã được xóa thành công')
  } catch (err) {
    showError('Không thể xóa cache')
  }
}

// Helper functions
function getTypeLabel(type) {
  const found = typeEnums.value.find(t => t.value === type)
  return found?.label || type || 'Không xác định'
}

onMounted(() => {
  loadConfigs()
})
</script>`
  
  console.log(`Creating file for ${group.name}...`)
  // File sẽ được tạo ở đây
})

