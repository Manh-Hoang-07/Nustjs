<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý vai trò</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm vai trò mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <RoleFilter 
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vai trò</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên hiển thị</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="role in items" :key="role.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ role.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ role.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ role.display_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="(
                  statusEnums.find(s => s.value === role.status)?.class ||
                  statusEnums.find(s => s.value === role.status)?.badge_class ||
                  statusEnums.find(s => s.value === role.status)?.color_class ||
                  'bg-gray-100 text-gray-800'
                )"
              >
                {{ getStatusLabel(role.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                :item="role"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
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
    <CreateRole
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handleRoleCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditRole
      v-if="modals.edit"
      :show="modals.edit"
      :role="selectedRole"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleRoleUpdated"
    />

      <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa vai trò ${selectedRole?.name || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deleteRole"
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
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { useApiClient } from '@/composables/api/useApiClient'
import { adminEndpoints } from '@/api/endpoints'

// Lazy load components
const CreateRole = defineAsyncComponent(() => import('./create.vue'))
const EditRole = defineAsyncComponent(() => import('./edit.vue'))
const RoleFilter = defineAsyncComponent(() => import('./filter.vue'))

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
    list: adminEndpoints.roles.list,
    create: adminEndpoints.roles.create,
    update: (id) => adminEndpoints.roles.update(id),
    delete: (id) => adminEndpoints.roles.delete(id)
  },
  resourceName: 'vai trò',
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

// Use selectedItem from composable as selectedRole
const selectedRole = selectedItem

// Fetch data
onMounted(async () => {
  await Promise.all([
    fetchData(),
    fetchStatusEnums()
  ])
})

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
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

// Modal handlers - sử dụng composable handlers
const openCreateModal = openCreateModalComposable
const closeCreateModal = closeCreateModalComposable
const openEditModal = openEditModalComposable
const closeEditModal = closeEditModalComposable
const openDeleteModal = openDeleteModalComposable
const closeDeleteModal = closeDeleteModalComposable

function confirmDelete(role) {
  openDeleteModal(role)
}

// Action handlers
async function handleRoleCreated(roleData) {
  try {
    await createItem(roleData)
    showSuccess('Vai trò đã được tạo thành công')
  } catch (error) {
    showError('Không thể tạo vai trò')
  }
}

async function handleRoleUpdated(roleData) {
  try {
    await updateItem(roleData)
    showSuccess('Vai trò đã được cập nhật thành công')
  } catch (error) {
    showError('Không thể cập nhật vai trò')
  }
}

async function deleteRole() {
  try {
    const success = await deleteItem()
    if (success) {
      showSuccess('Vai trò đã được xóa thành công')
    } else {
      showError('Không thể xóa vai trò')
    }
  } catch (error) {
    showError('Không thể xóa vai trò')
  }
}

function handlePageChange(page) {
  fetchData({ page })
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
/* Cho phép cuộn ngang table khi màn hình nhỏ */
.table-responsive {
  overflow-x: auto;
}
</style> 

