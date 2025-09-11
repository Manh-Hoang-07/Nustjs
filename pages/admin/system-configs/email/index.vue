<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Cài đặt Email</h1>
        <p class="text-gray-600 mt-1">Quản lý các cấu hình email của hệ thống</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm cấu hình email
      </button>
    </div>

    <!-- Bộ lọc -->
    <SystemConfigFilter 
      :initial-filters="filters"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Danh sách cấu hình dạng card -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-md p-6">
        <SkeletonLoader type="card" />
      </div>
    </div>
    
    <div v-else-if="items.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📧</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có cấu hình email</h3>
      <p class="text-gray-500 mb-6">Hãy tạo cấu hình email đầu tiên cho hệ thống</p>
      <button 
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm cấu hình email
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="config in items" 
        :key="config.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
      >
        <!-- Header card -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ config.display_name }}</h3>
            <p class="text-sm text-gray-500 font-mono">{{ config.config_key }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full" 
              :class="getStatusClass(config.status)"
            >
              {{ getStatusLabel(config.status) }}
            </span>
            <Actions 
              :item="config"
              @edit="openEditModal"
              @delete="confirmDelete"
            />
          </div>
        </div>

        <!-- Giá trị cấu hình -->
        <div class="mb-4">
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Giá trị</label>
          <div class="mt-1 p-3 bg-gray-50 rounded-md">
            <p class="text-sm text-gray-900 break-words">{{ config.config_value || 'Chưa có giá trị' }}</p>
          </div>
        </div>

        <!-- Thông tin bổ sung -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full" 
              :class="getGroupClass(config.config_group)"
            >
              {{ getGroupName(config.config_group) }}
            </span>
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              {{ config.config_type }}
            </span>
          </div>
          <span class="text-gray-400 text-xs">ID: {{ config.id }}</span>
        </div>

        <!-- Mô tả nếu có -->
        <div v-if="config.description" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">{{ config.description }}</p>
        </div>
      </div>
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
      v-if="showCreateModal"
      :show="showCreateModal"
      :on-close="closeCreateModal"
      @created="handleConfigCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditSystemConfig
      v-if="showEditModal"
      :show="showEditModal"
      :config="selectedConfig"
      :on-close="closeEditModal"
      @updated="handleConfigUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa cấu hình ${selectedConfig?.config_key || ''}?`"
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

import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useDataTable } from '../../../../composables/data/useDataTable.js'
import { useSystemConfig } from '../../../../composables/api'
import { useToast } from '../../../../composables/ui/useToast.js'
import SkeletonLoader from '../../../../components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '../../../../components/Core/Modal/ConfirmModal.vue'
import Actions from '../../../../components/Core/Actions/Actions.vue'
import Pagination from '../../../../components/Core/Navigation/Pagination.vue'

// Lazy load components
const CreateSystemConfig = defineAsyncComponent(() => import('../create.vue'))
const EditSystemConfig = defineAsyncComponent(() => import('../edit.vue'))
const SystemConfigFilter = defineAsyncComponent(() => import('../filter.vue'))

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters, 
  fetchData, 
  updateFilters, 
  deleteItem 
} = useDataTable('/api/admin/system-configs', {
  defaultFilters: {
    search: '',
    group: 'email',
    status: '',
    sort_by: 'created_at_desc'
  }
})

const { showSuccess, showError } = useToast()

// State
const selectedConfig = ref(null)

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Fetch data
onMounted(async () => {
  await fetchData()
})

// Filter handlers
function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

// Modal handlers
function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function openEditModal(config) {
  selectedConfig.value = config
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  selectedConfig.value = null
}

function confirmDelete(config) {
  selectedConfig.value = config
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedConfig.value = null
}

// Action handlers
async function handleConfigCreated() {
  await fetchData()
  closeCreateModal()
  showSuccess('Cấu hình email đã được tạo thành công')
}

async function handleConfigUpdated() {
  await fetchData()
  closeEditModal()
  showSuccess('Cấu hình email đã được cập nhật thành công')
}

async function deleteConfig() {
  try {
    await deleteItem(selectedConfig.value.id)
    closeDeleteModal()
    showSuccess('Cấu hình email đã được xóa thành công')
  } catch (error) {
    showError('Không thể xóa cấu hình email')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Helper functions
function getGroupName(group) {
  const groups = {
    general: 'Cài đặt chung',
    email: 'Cài đặt email',
    security: 'Cài đặt bảo mật'
  }
  return groups[group] || group
}

function getGroupClass(group) {
  const classes = {
    general: 'bg-blue-100 text-blue-800',
    email: 'bg-green-100 text-green-800',
    security: 'bg-red-100 text-red-800'
  }
  return classes[group] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  if (status === 'active') return 'Hoạt động'
  if (status === 'inactive') return 'Không hoạt động'
  return status || 'Không xác định'
}

function getStatusClass(status) {
  if (status === 'active') return 'bg-green-100 text-green-800'
  if (status === 'inactive') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}
</script>

<style>
/* Cho phép cuộn ngang table khi màn hình nhỏ */
.table-responsive {
  overflow-x: auto;
}
</style>
