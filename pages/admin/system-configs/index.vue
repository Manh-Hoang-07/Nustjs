<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
      <div class="flex space-x-2">
        <button 
          @click="clearCache" 
          class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none"
          :disabled="loading"
        >
          Xóa cache
        </button>
        <button 
          @click="openCreateModal" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Thêm cấu hình mới
        </button>
      </div>
    </div>

    <!-- Bộ lọc -->
    <SystemConfigFilter 
      :initial-filters="filters"
      :group-enums="groupEnums"
      :type-enums="typeEnums"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="8" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="config in items" :key="config.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ config.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <div class="flex items-center">
                <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ config.key }}</code>
                <div class="ml-2 flex space-x-1">
                  <span v-if="config.is_public" class="px-1 py-0.5 text-xs bg-green-100 text-green-800 rounded">Public</span>
                  <span v-if="config.is_encrypted" class="px-1 py-0.5 text-xs bg-red-100 text-red-800 rounded">Encrypted</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs">
              <div class="truncate" :title="formatValue(config.value, config.type)">
                {{ formatValue(config.value, config.type) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {{ getTypeLabel(config.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                {{ getGroupLabel(config.group) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="getStatusClass(config.status)"
              >
                {{ getStatusLabel(config.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(config.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                :item="config"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-gray-500">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <Pagination 
      v-if="items.length > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      :loading="loading"
      @page-change="handlePageChange"
    />

    <!-- Modal thêm mới -->
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

    <!-- Modal chỉnh sửa -->
    <EditSystemConfig
      v-if="modals.edit"
      :show="modals.edit"
      :config="selectedConfig"
      :type-enums="typeEnums"
      :group-enums="groupEnums"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleConfigUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa cấu hình ${selectedConfig?.key || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deleteConfig"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import { useAdminSystemConfig } from '@/composables/api/useAdminSystemConfig'
import { useSystemConfigGroups } from '@/composables/api/useSystemConfigGroups'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'
import { useGlobalApiClient } from '@/composables/api'

// Lazy load components
const CreateSystemConfig = defineAsyncComponent(() => import('./create.vue'))
const EditSystemConfig = defineAsyncComponent(() => import('./edit.vue'))
const SystemConfigFilter = defineAsyncComponent(() => import('./filter.vue'))

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters, 
  fetchData, 
  updateFilters,
  // CRUD operations
  createItem,
  updateItem,
  deleteItem,
  // Modal handlers
  openCreateModal: openCreateModalComposable,
  closeCreateModal: closeCreateModalComposable,
  openEditModal: openEditModalComposable,
  closeEditModal: closeEditModalComposable,
  openDeleteModal: openDeleteModalComposable,
  closeDeleteModal: closeDeleteModalComposable,
  // Selection
  selectedItem,
  // Modal state
  modals,
  // Error handling
  apiErrors,
  clearApiErrors
} = useCrudDataTable({
  endpoints: {
    list: adminEndpoints.systemConfigs.list,
    create: adminEndpoints.systemConfigs.create,
    update: (id) => adminEndpoints.systemConfigs.update(id),
    delete: (id) => adminEndpoints.systemConfigs.delete(id)
  }
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()
const { clearCache: clearSystemCache } = useAdminSystemConfig()
const { groups, groupLabels } = useSystemConfigGroups()
const route = useRoute()

// State
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

// Use selectedItem from composable as selectedConfig
const selectedConfig = selectedItem

// Computed để lấy group từ URL
const currentGroup = computed(() => {
  return route.query.group || ''
})

// Computed để lấy title dựa trên group
const pageTitle = computed(() => {
  if (currentGroup.value) {
    const groupLabel = groupLabels.value[currentGroup.value] || currentGroup.value
    return `Cấu hình ${groupLabel}`
  }
  return 'Quản lý cấu hình hệ thống'
})

// Fetch data
onMounted(async () => {
  // fetchData() will be called automatically by useCrudDataTable with URL sync
})

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

// Modal handlers - sử dụng composable handlers
const openCreateModal = openCreateModalComposable
const closeCreateModal = closeCreateModalComposable
const openEditModal = openEditModalComposable
const closeEditModal = closeEditModalComposable
const openDeleteModal = openDeleteModalComposable
const closeDeleteModal = closeDeleteModalComposable

function confirmDelete(config) {
  openDeleteModal(config)
}

// Action handlers
async function handleConfigCreated(configData) {
  try {
    await createItem(configData)
    showSuccess('Cấu hình đã được tạo thành công')
  } catch (error) {
    showError('Không thể tạo cấu hình')
  }
}

async function handleConfigUpdated(configData) {
  try {
    await updateItem(configData)
    showSuccess('Cấu hình đã được cập nhật thành công')
  } catch (error) {
    showError('Không thể cập nhật cấu hình')
  }
}

async function deleteConfig() {
  try {
    const success = await deleteItem()
    if (success) {
      showSuccess('Cấu hình đã được xóa thành công')
    } else {
      showError('Không thể xóa cấu hình')
    }
  } catch (error) {
    showError('Không thể xóa cấu hình')
  }
}

async function clearCache() {
  try {
    await clearSystemCache()
    showSuccess('Cache đã được xóa thành công')
  } catch (error) {
    showError('Không thể xóa cache')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Helper functions
function getTypeLabel(type) {
  const found = typeEnums.value.find(t => t.value === type)
  return found?.label || type || 'Không xác định'
}

function getGroupLabel(group) {
  const found = groupEnums.value.find(g => g.value === group)
  return found?.label || group || 'Không xác định'
}

function getStatusLabel(status) {
  const found = statusEnums.value.find(s => s.value === status)
  return found?.label || status || 'Không xác định'
}

function getStatusClass(status) {
  const found = statusEnums.value.find(s => s.value === status)
  return found?.class || 'bg-gray-100 text-gray-800'
}

function formatValue(value, type) {
  if (value === null || value === undefined) return '—'
  
  switch (type) {
    case 'boolean':
      return value ? 'true' : 'false'
    case 'json':
    case 'array':
      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    case 'integer':
    case 'float':
      return String(value)
    default:
      return String(value)
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>

<style>
/* Cho phép cuộn ngang table khi màn hình nhỏ */
.table-responsive {
  overflow-x: auto;
}
</style>
