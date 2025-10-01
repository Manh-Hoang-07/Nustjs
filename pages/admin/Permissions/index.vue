<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý quyền</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm quyền mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <PermissionFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="5" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên quyền</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên hiển thị</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="permission in items" :key="permission.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ permission.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ permission.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ permission.display_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="(
                  statusEnums.find(s => s.value === permission.status)?.class ||
                  statusEnums.find(s => s.value === permission.status)?.badge_class ||
                  statusEnums.find(s => s.value === permission.status)?.color_class ||
                  'bg-gray-100 text-gray-800'
                )"
              >
                {{ getStatusLabel(permission.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                v-if="!permission.has_children"
                :item="permission"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
              <span v-if="permission.has_children" class="text-gray-500 text-sm">
                Không thể sửa/xóa (có {{ permission.children_count }} quyền con)
              </span>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
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
    <CreatePermission
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handlePermissionCreated"
    />

        <!-- Modal chỉnh sửa -->
    <EditPermission
      v-if="modals.edit"
      :show="modals.edit"
      :permission="selectedPermission"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handlePermissionUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa quyền ${selectedPermission?.name || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deletePermission"
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
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import { useApiClient } from '@/composables/api/useApiClient'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'

// Lazy load components
const CreatePermission = defineAsyncComponent(() => import('./create.vue'))
const EditPermission = defineAsyncComponent(() => import('./edit.vue'))
const PermissionFilter = defineAsyncComponent(() => import('./filter.vue'))

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
    list: adminEndpoints.permissions.list,
    create: adminEndpoints.permissions.create,
    update: (id) => adminEndpoints.permissions.update(id),
    delete: (id) => adminEndpoints.permissions.delete(id)
  },
  resourceName: 'quyền',
  defaultFilters: {
    search: '',
    status: '',
    sort_by: 'created_at_desc'
  },
  enableUrlSync: true,
  filterKeys: ['search', 'status', 'sort_by'],
  sortKeys: ['sort_by', 'sort_order']
})

const { showSuccess, showError } = useToast()
const { apiClient } = useApiClient()

// State
const statusEnums = ref([])

// Use selectedItem from composable as selectedPermission
const selectedPermission = selectedItem

// Fetch data
onMounted(async () => {
  await Promise.all([
    fetchData(),
    fetchStatusEnums()
  ])
})

// Filter handlers
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

function confirmDelete(permission) {
  openDeleteModal(permission)
}

// Action handlers
async function handlePermissionCreated(permissionData) {
  try {
    await createItem(permissionData)
    showSuccess('Quyền đã được tạo thành công')
  } catch (error) {
    showError('Không thể tạo quyền')
  }
}

async function handlePermissionUpdated(permissionData) {
  try {
    await updateItem(permissionData)
    showSuccess('Quyền đã được cập nhật thành công')
  } catch (error) {
    showError('Không thể cập nhật quyền')
  }
}

async function deletePermission() {
  try {
    const success = await deleteItem()
    if (success) {
      showSuccess('Quyền đã được xóa thành công')
    } else {
      showError('Không thể xóa quyền')
    }
  } catch (error) {
    showError('Không thể xóa quyền')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Fetch status enums
async function fetchStatusEnums() {
  try {
    const response = await apiClient.get(adminEndpoints.enums('basic_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    } else {
      statusEnums.value = []
    }
  } catch (error) {
    statusEnums.value = []
  }
}

// Status helper functions
function getStatusLabel(status) {
  const list = statusEnums.value || []
  const found = list.find(it => it.value === status || it.id === status)
  return found?.label || found?.name || status || 'Không xác định'
}

// Removed getStatusClass; class is derived from API enums directly in template
</script>

<style>
/* Đảm bảo table luôn cuộn ngang được trên mobile */
.bg-white > .overflow-x-auto {
  width: 100%;
}
</style>

