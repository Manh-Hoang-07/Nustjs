<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý liên hệ</h1>
      <div class="flex space-x-2">
        <button 
          @click="refreshData" 
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Làm mới
        </button>
        <button 
          @click="exportContacts" 
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Xuất Excel
        </button>
      </div>
    </div>

    <!-- Bộ lọc -->
    <ContactFilter 
      :initial-filters="filters"
      :status-enums="statusEnums"
      @update:filters="handleFilterUpdate" 
    />

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="5" :columns="7" />
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điện thoại</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ đề</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="contact in items" :key="contact.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ contact.name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a :href="`mailto:${contact.email}`" class="text-blue-600 hover:text-blue-800">
                {{ contact.email }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="text-blue-600 hover:text-blue-800">
                {{ contact.phone }}
              </a>
              <span v-else class="text-gray-400">N/A</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="max-w-xs truncate" :title="contact.subject">
                {{ contact.subject || 'Không có chủ đề' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select 
                :value="contact.status"
                @change="updateContactStatus(contact, $event.target.value)"
                class="px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500"
                :class="(
                  statusEnums.find(s => s.value === contact.status)?.class ||
                  statusEnums.find(s => s.value === contact.status)?.badge_class ||
                  statusEnums.find(s => s.value === contact.status)?.color_class ||
                  'bg-gray-100 text-gray-800'
                )"
              >
                <option 
                  v-for="status in statusEnums" 
                  :key="status.value" 
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(contact.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Actions 
                :item="contact"
                :show-edit="false"
                :show-delete="false"
                :show-view="true"
                @view="openViewModal"
              >
                <template #custom="{ item }">
                  <button 
                    @click="openNotesModal(item)" 
                    class="p-2 rounded-full hover:bg-yellow-100 transition-colors duration-200"
                    title="Ghi chú"
                  >
                    <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="markAsResponded(item)" 
                    v-if="item.status !== 'completed'"
                    class="p-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                    title="Đánh dấu đã phản hồi"
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
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
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

    <!-- Modal xem chi tiết -->
    <ContactView
      v-if="showViewModal"
      :show="showViewModal"
      :contact="selectedContact"
      :on-close="closeViewModal"
      
    />

    <!-- Modal chỉnh sửa -->
    <ContactEdit
      v-if="modals.edit"
      :show="modals.edit"
      :contact="selectedContact"
      :status-enums="statusEnums"
      :api-errors="apiErrors"
      :on-close="closeEditModal"
      @updated="handleContactUpdated"
    />

    <!-- Modal ghi chú -->
    <ContactNotes
      v-if="showNotesModal"
      :show="showNotesModal"
      :contact="selectedContact"
      :on-close="closeNotesModal"
      @notes-updated="handleNotesUpdated"
    />

    <!-- Modal xác nhận xóa -->
    <ConfirmModal
      v-if="modals.delete"
      :show="modals.delete"
      title="Xác nhận xóa"
      :message="`Bạn có chắc chắn muốn xóa liên hệ từ ${selectedContact?.name || selectedContact?.email || ''}?`"
      :on-close="closeDeleteModal"
      @confirm="deleteContact"
    />

    <!-- Toast Container -->
    <ToastContainer />
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
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import ToastContainer from '@/components/Core/Feedback/ToastContainer.vue'
import { adminEndpoints } from '@/api/endpoints'
import { useGlobalApiClient } from '@/composables/api'

// Lazy load components
const ContactView = defineAsyncComponent(() => import('./view.vue'))
const ContactEdit = defineAsyncComponent(() => import('./edit.vue'))
const ContactNotes = defineAsyncComponent(() => import('./notes.vue'))
const ContactFilter = defineAsyncComponent(() => import('./filter.vue'))

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
    list: adminEndpoints.contacts.list,
    create: adminEndpoints.contacts.create,
    update: (id) => adminEndpoints.contacts.update(id),
    delete: (id) => adminEndpoints.contacts.delete(id)
  },
  resourceName: 'liên hệ',
  defaultFilters: {
    search: '',
    status: '',
    date_from: '',
    date_to: '',
    sort_by: 'created_at_desc'
  },
  enableUrlSync: true,
  filterKeys: ['search', 'status', 'date_from', 'date_to', 'sort_by'],
  sortKeys: ['sort_by', 'sort_order']
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()

// State
const statusEnums = ref([])

// Alias selectedItem from composable
const selectedContact = selectedItem

// Additional modal state for special features
const showViewModal = ref(false)
const showNotesModal = ref(false)

// Flag to prevent duplicate enum loading
const enumsLoaded = ref(false)

// Fetch data
onMounted(async () => {
  // Load status enums via API only once
  if (!enumsLoaded.value) {
    await fetchEnums()
    enumsLoaded.value = true
  }
  // fetchData() will be called automatically by useCrudDataTable with URL sync
  // No need to call it manually here
})

function handleFilterUpdate(newFilters) {
  updateFilters(newFilters)
}

async function fetchEnums() {
  try {
    const response = await apiClient.get(adminEndpoints.enums('basic_status'))
    if (response.data?.success) {
      statusEnums.value = response.data.data || []
    } else {
      statusEnums.value = []
    }
  } catch (e) {
    statusEnums.value = []
  }
}

// Modal handlers - wrap composable handlers with debug logs
function openViewModal(contact) {
  console.log('openViewModal called with contact:', contact)
  selectedContact.value = contact
  showViewModal.value = true
}

function closeViewModal() {
  console.log('closeViewModal called')
  showViewModal.value = false
  selectedContact.value = null
}

function openEditModal(contact) {
  console.log('openEditModal called with contact:', contact)
  openEditModalComposable(contact)
}

function closeEditModal() {
  console.log('closeEditModal called')
  closeEditModalComposable()
}

function openNotesModal(contact) {
  console.log('openNotesModal called with contact:', contact)
  selectedContact.value = contact
  showNotesModal.value = true
}

function closeNotesModal() {
  console.log('closeNotesModal called')
  showNotesModal.value = false
  selectedContact.value = null
}

function confirmDelete(contact) {
  console.log('confirmDelete called with contact:', contact)
  openDeleteModalComposable(contact)
}

function closeDeleteModal() {
  console.log('closeDeleteModal called')
  closeDeleteModalComposable()
}

// Action handlers
async function handleContactUpdated(data) {
  console.log('handleContactUpdated called with data:', data)
  await updateItem(data)
  showSuccess('Liên hệ đã được cập nhật thành công')
}

async function handleNotesUpdated() {
  console.log('handleNotesUpdated called')
  await fetchData()
  closeNotesModal()
  showSuccess('Ghi chú đã được cập nhật thành công')
}

async function deleteContact() {
  console.log('deleteContact called')
  await deleteItem()
  showSuccess('Liên hệ đã được xóa thành công')
}

async function updateContactStatus(contact, newStatus) {
  try {
    await apiClient.patch(adminEndpoints.contacts.updateStatus(contact.id), {
      status: newStatus
    })
    
    // Update local data
    contact.status = newStatus
    
    showSuccess('Trạng thái đã được cập nhật thành công')
  } catch (error) {
    console.error('Error updating contact status:', error)
    showError('Không thể cập nhật trạng thái')
  }
}

async function markAsResponded(contact) {
  try {
    await apiClient.patch(adminEndpoints.contacts.markResponded(contact.id))
    
    // Update local data
    contact.status = 'completed'
    contact.responded_at = new Date().toISOString()
    
    showSuccess('Đã đánh dấu phản hồi thành công')
  } catch (error) {
    console.error('Error marking contact as responded:', error)
    showError('Không thể đánh dấu phản hồi')
  }
}

function handlePageChange(page) {
  fetchData({ page })
}

async function refreshData() {
  await fetchData()
  showSuccess('Dữ liệu đã được làm mới')
}

async function exportContacts() {
  try {
    const response = await apiClient.get(adminEndpoints.contacts.list, {
      params: {
        ...filters.value,
        export: 'excel'
      }
    })
    
    // Create download link
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    
    showSuccess('Xuất Excel thành công')
  } catch (error) {
    console.error('Error exporting contacts:', error)
    showError('Không thể xuất Excel')
  }
}

// Helper functions
function getStatusLabel(status) {
  const found = (statusEnums.value || []).find(s => s.value === status)
  return found?.label || status || 'Không xác định'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>


