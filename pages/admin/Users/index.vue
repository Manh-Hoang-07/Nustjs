<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Qu?n l� ngu?i d�ng</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Th�m ngu?i d�ng m?i
      </button>
    </div>

    <!-- B? l?c -->
    <UserFilter 
      :initial-filters="filters"
      @update:filters="handleFilterUpdate" 
    />

    <!-- B?ng d? li?u -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="5" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T�n dang nh?p</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S? di?n tho?i</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tr?ng th�i</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao t�c</th>
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
                {{ user.status || 'N/A' }}
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
                    title="�?i m?t kh?u"
                  >
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="openAssignRoleModal(item)" 
                    class="p-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                    title="Ph�n quy?n"
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
              Kh�ng c� d? li?u
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ph�n trang -->
    <Pagination 
      v-if="items.length > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      :loading="loading"
      @page-change="handlePageChange"
    />

    <!-- Modal th�m m?i -->
    <CreateUser
      v-if="showCreateModal"
      :show="showCreateModal"
      :status-enums="statusEnums"
      :gender-enums="genderEnums"
      :role-enums="roleEnums"
      :on-close="closeCreateModal"
      @created="handleUserCreated"
    />

    <!-- Modal ch?nh s?a -->
    <EditUser
      v-if="showEditModal"
      :show="showEditModal"
      :user="selectedUser"
      :status-enums="statusEnums"
      :gender-enums="genderEnums"
      :role-enums="roleEnums"
      :on-close="closeEditModal"
      @updated="handleUserUpdated"
    />

    <!-- Modal d?i m?t kh?u -->
    <ChangePassword
      v-if="showChangePasswordModal"
      :show="showChangePasswordModal"
      :user="selectedUser"
      :on-close="closeChangePasswordModal"
      @password-changed="handlePasswordChanged"
    />

    <!-- Modal ph�n quy?n -->
    <AssignRole
      v-if="showAssignRoleModal"
      :show="showAssignRoleModal"
      :user="selectedUser"
      :on-close="closeAssignRoleModal"
      @role-assigned="handleRoleAssigned"
    />

    <!-- Modal x�c nh?n x�a -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="X�c nh?n x�a"
      :message="`B?n c� ch?c ch?n mu?n x�a ngu?i d�ng ${selectedUser?.username || ''}?`"
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
// Removed static enum helpers; enums are loaded via API
import { useApiClient } from '@/composables/api/useApiClient'
import { useDataTable } from '@/composables/data/useDataTable'
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
  deleteItem 
} = useDataTable(adminEndpoints.users.list, {
  defaultFilters: {
    search: '',
    status: '',
    sort_by: 'created_at:desc'
  }
})

const { showSuccess, showError } = useToast()
const { apiClient } = useApiClient()

// State
const selectedUser = ref(null)
const roleEnums = ref([])

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showChangePasswordModal = ref(false)
const showAssignRoleModal = ref(false)
const showDeleteModal = ref(false)

// Fetch data
onMounted(async () => {
  // Load roles from API
  await loadRoles()
  
  // Fetch users
  await fetchData()
})

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

function fetchEnums() {
  // Tr?ng th�i: l?y t? API basic_status
  ;(async () => {
    try {
      const response = await apiClient.get(adminEndpoints.enums('user_status'))
      if (response.data?.success) {
        statusEnums.value = response.data.data || []
      } else {
        statusEnums.value = []
      }
    } catch (e) {
      statusEnums.value = []
    }
  })()

  // Gi?i t�nh: l?y t? API
  ;(async () => {
    try {
      const response = await apiClient.get(adminEndpoints.enums('gender'))
      if (response.data?.success) {
        genderEnums.value = response.data.data || []
      } else {
        genderEnums.value = []
      }
    } catch (e) {
      genderEnums.value = []
    }
  })()
}

async function loadRoles() {
  try {
    const response = await apiClient.get(adminEndpoints.roles.list)
    if (response.data?.success) {
      roleEnums.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error loading roles:', error)
    showError('Kh�ng th? t?i danh s�ch vai tr�')
  }
}

// Modal handlers
function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function openEditModal(user) {
  selectedUser.value = user
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  selectedUser.value = null
}

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
  
  // �?m b?o roles d� du?c load
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
  selectedUser.value = user
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedUser.value = null
}

// Action handlers
async function handleUserCreated() {
  await fetchData()
  closeCreateModal()
  showSuccess('Ngu?i d�ng d� du?c t?o th�nh c�ng')
}

async function handleUserUpdated() {
  await fetchData()
  closeEditModal()
  showSuccess('Ngu?i d�ng d� du?c c?p nh?t th�nh c�ng')
}

async function handlePasswordChanged() {
  closeChangePasswordModal()
  showSuccess('M?t kh?u d� du?c thay d?i th�nh c�ng')
}

async function handleRoleAssigned() {
  await fetchData()
  closeAssignRoleModal()
  showSuccess('Vai tr� d� du?c ph�n c�ng th�nh c�ng')
}

async function deleteUser() {
  try {
    await deleteItem(selectedUser.value.id)
    closeDeleteModal()
    showSuccess('Ngu?i d�ng d� du?c x�a th�nh c�ng')
  } catch (error) {
    showError('Kh�ng th? x�a ngu?i d�ng')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Helper functions
function getStatusLabel(status) {
  const list = statusEnums.value || []
  const found = list.find(it => it.value === status || it.id === status)
  return found?.label || found?.name || status || 'Kh�ng x�c d?nh'
}

// Removed getStatusClass; class is derived from API enums directly in template
</script>

