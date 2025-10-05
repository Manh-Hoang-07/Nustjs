<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý người dùng</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Thêm người dùng mới
      </button>
    </div>

    <!-- Bộ lọc -->
    <UserFilter 
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in items" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.phone || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
              >
                {{ getStatusLabel(user.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                :item="user"
                @edit="openEditModal"
                @delete="confirmDelete"
              >
                <template #custom="{ item }">
                  <button 
                    @click="openChangePasswordModal(item)" 
                    class="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
                    title="Đổi mật khẩu"
                  >
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="openAssignRoleModal(item)" 
                    class="p-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                    title="Phân quyền"
                  >
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </template>
              </Actions>
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
    <CreateUser
      v-if="modals.create"
      :show="modals.create"
      :status-enums="statusEnums"
      :gender-enums="genderEnums"
      :role-enums="roleEnums"
      :api-errors="apiErrors"
      :on-close="closeCreateModal"
      @created="handleUserCreated"
    />

    <!-- Modal chỉnh sửa -->
    <EditUser
      v-if="modals.edit"
      :show="modals.edit"
      :user="selectedUser"
      :status-enums="statusEnums"
      :gender-enums="genderEnums"
      :role-enums="roleEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleUserUpdated"
    />

    <!-- Modal đổi mật khẩu -->
    <ChangePassword
      v-if="showChangePasswordModal"
      :show="showChangePasswordModal"
      :user="selectedUser"
      :on-close="closeChangePasswordModal"
      @password-changed="handlePasswordChanged"
    />

    <!-- Modal phân quyền -->
    <AssignRole
      v-if="showAssignRoleModal"
      :show="showAssignRoleModal"
      :user="selectedUser"
      :on-close="closeAssignRoleModal"
      @role-assigned="handleRoleAssigned"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa người dùng ${selectedUser?.username || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deleteUser"
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
import { useGlobalApiClient } from '@/composables/api'
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints } from '@/api/endpoints'

// Lazy load components
const CreateUser = defineAsyncComponent(() => import('./create.vue'))
const EditUser = defineAsyncComponent(() => import('./edit.vue'))
const ChangePassword = defineAsyncComponent(() => import('./change-password.vue'))
const AssignRole = defineAsyncComponent(() => import('./assign-role.vue'))
const UserFilter = defineAsyncComponent(() => import('./filter.vue'))

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters, 
  fetchData, 
  updateFilters,
  changePage,
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
    list: adminEndpoints.users.list,
    create: adminEndpoints.users.create,
    update: (id) => adminEndpoints.users.update(id),
    delete: (id) => adminEndpoints.users.delete(id)
  },
  transformItem: (user) => ({
    ...user,
    fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim()
  })
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()

// State
const roleEnums = ref([])
const statusEnums = ref([])
const genderEnums = ref([])

// Additional modal state (not handled by CRUD composable)
const showChangePasswordModal = ref(false)
const showAssignRoleModal = ref(false)

// Use selectedItem from composable as selectedUser
const selectedUser = selectedItem

// Flag to prevent duplicate enum loading
const enumsLoaded = ref(false)

// Fetch data
onMounted(async () => {
  // Load enums from API only once
  if (!enumsLoaded.value) {
    await loadEnums()
    enumsLoaded.value = true
  }
  
  // fetchData() will be called automatically by useCrudDataTable with URL sync
  // No need to call it manually here
})

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

async function loadEnums() {
  // Load status enums
  try {
    const response = await apiClient.get(adminEndpoints.enums('user_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    }
  } catch (e) {
    statusEnums.value = []
  }

  // Load gender enums
  try {
    const response = await apiClient.get(adminEndpoints.enums('gender'))
    if (response.data?.success) {
      genderEnums.value = response.data.data || []
    }
  } catch (e) {
    genderEnums.value = []
  }

  // Load roles
  await loadRoles()
}

async function loadRoles() {
  try {
    const response = await apiClient.get(adminEndpoints.roles.list)
    if (response.data?.success) {
      roleEnums.value = response.data.data || []
    }
  } catch (error) {
    showError('Không thể tải danh sách vai trò')
  }
}

// Modal handlers - sử dụng composable handlers
const openCreateModal = () => {
  openCreateModalComposable()
}
const closeCreateModal = closeCreateModalComposable
const openEditModal = (user) => {
  openEditModalComposable(user)
}
const closeEditModal = closeEditModalComposable
const openDeleteModal = (user) => {
  openDeleteModalComposable(user)
}
const closeDeleteModal = closeDeleteModalComposable

function openChangePasswordModal(user) {
  selectedUser.value = user
  showChangePasswordModal.value = true
}

function closeChangePasswordModal() {
  showChangePasswordModal.value = false
  selectedUser.value = null
}

async function openAssignRoleModal(user) {
  selectedUser.value = user
  
  // Đảm bảo roles đã được load
  if (roleEnums.value.length === 0) {
    await loadRoles()
  }
  
  showAssignRoleModal.value = true
}

function closeAssignRoleModal() {
  showAssignRoleModal.value = false
  selectedUser.value = null
}

function confirmDelete(user) {
  openDeleteModal(user)
}

// Action handlers
async function handleUserCreated(userData) {
  try {
    await createItem(userData)
    showSuccess('Người dùng đã được tạo thành công')
  } catch (error) {
    showError('Không thể tạo người dùng')
  }
}

async function handleUserUpdated(userData) {
  try {
    await updateItem(userData)
    showSuccess('Người dùng đã được cập nhật thành công')
  } catch (error) {
    showError('Không thể cập nhật người dùng')
  }
}

async function handlePasswordChanged() {
  closeChangePasswordModal()
  showSuccess('Mật khẩu đã được thay đổi thành công')
}

async function handleRoleAssigned() {
  await fetchData()
  closeAssignRoleModal()
  showSuccess('Vai trò đã được phân công thành công')
}

async function deleteUser() {
  try {
    const success = await deleteItem()
    if (success) {
      showSuccess('Người dùng đã được xóa thành công')
    } else {
      showError('Không thể xóa người dùng')
    }
  } catch (error) {
    showError('Không thể xóa người dùng')
  }
}

function handlePageChange(page) {
  // Sử dụng changePage từ composable thay vì fetchData trực tiếp
  // để đảm bảo URL sync hoạt động đúng
  changePage(page)
}

// Helper functions
function getStatusLabel(status) {
  const list = statusEnums.value || []
  const found = list.find(it => it.value === status || it.id === status)
  return found?.label || found?.name || status || 'Không xác định'
}
</script>