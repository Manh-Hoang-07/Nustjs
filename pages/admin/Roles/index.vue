<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Qu?n l� vai tr�</h1>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Th�m vai tr� m?i
      </button>
    </div>

    <!-- B? l?c -->
    <RoleFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- B?ng d? li?u -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="5" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T�n vai tr�</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T�n hi?n th?</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tr?ng th�i</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao t�c</th>
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
    <CreateRole
      v-if="showCreateModal"
      :show="showCreateModal"
      :status-enums="statusEnums"
      :on-close="closeCreateModal"
      @created="handleRoleCreated"
    />

    <!-- Modal ch?nh s?a -->
    <EditRole
      v-if="showEditModal"
      :show="showEditModal"
      :role="selectedRole"
      :status-enums="statusEnums"
      :on-close="closeEditModal"
      @updated="handleRoleUpdated"
    />

    <!-- Modal x�c nh?n x�a -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="X�c nh?n x�a"
      :message="`B?n c� ch?c ch?n mu?n x�a vai tr� ${selectedRole?.name || ''}?`"
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
import { useDataTable } from '@/composables/data/useDataTable'
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
  deleteItem 
} = useDataTable(adminEndpoints.roles.list, {
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
const selectedRole = ref(null)
const statusEnums = ref([])

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

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

// Modal handlers
function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function openEditModal(role) {
  selectedRole.value = role
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  selectedRole.value = null
}

function confirmDelete(role) {
  selectedRole.value = role
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedRole.value = null
}

// Action handlers
async function handleRoleCreated() {
  await fetchData()
  closeCreateModal()
  showSuccess('Vai tr� d� du?c t?o th�nh c�ng')
}

async function handleRoleUpdated() {
  await fetchData()
  closeEditModal()
  showSuccess('Vai tr� d� du?c c?p nh?t th�nh c�ng')
}

async function deleteRole() {
  try {
    await deleteItem(selectedRole.value.id)
    closeDeleteModal()
    showSuccess('Vai tr� d� du?c x�a th�nh c�ng')
  } catch (error) {
    showError('Kh�ng th? x�a vai tr�')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

// Status helper functions
function getStatusLabel(status) {
  const list = statusEnums.value || []
  const found = list.find(it => it.value === status || it.id === status)
  return found?.label || found?.name || status || 'Kh�ng x�c d?nh'
}

// Removed getStatusClass; class is derived from API enums directly in template

</script>

<style>
/* Cho ph�p cu?n ngang table khi m�n h�nh nh? */
.table-responsive {
  overflow-x: auto;
}
</style> 

