<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý cấu hình hệ thống</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm cấu hình mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <SystemConfigFilter 
      :initial-filters="filters"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="8" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa cấu hình</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên hiển thị</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="config in items" :key="config.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ config.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ config.config_key }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ config.display_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" :title="config.config_value">
              {{ config.config_value }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="getGroupClass(config.config_group)"
              >
                {{ getGroupName(config.config_group) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ config.config_type }}
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
import { useDataTable } from '../../../composables/data/useDataTable.js'
import { useSystemConfig } from '../../../composables/api'
import { useToast } from '../../../composables/ui/useToast.js'
import SkeletonLoader from '../../../components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '../../../components/Core/Modal/ConfirmModal.vue'
import Actions from '../../../components/Core/Actions/Actions.vue'
import Pagination from '../../../components/Core/Navigation/Pagination.vue'

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
  deleteItem 
} = useDataTable('/api/admin/system-configs', {
  defaultFilters: {
    search: '',
    group: '',
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
  showSuccess('Cấu hình đã được tạo thành công')
}

async function handleConfigUpdated() {
  await fetchData()
  closeEditModal()
  showSuccess('Cấu hình đã được cập nhật thành công')
}

async function deleteConfig() {
  try {
    await deleteItem(selectedConfig.value.id)
    closeDeleteModal()
    showSuccess('Cấu hình đã được xóa thành công')
  } catch (error) {
    showError('Không thể xóa cấu hình')
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