<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Ví dụ sử dụng useCrudDataTable</h1>
    
    <!-- Demo các chức năng -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <button 
        @click="openCreateModal" 
        class="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Mở Modal Tạo Mới
      </button>
      
      <button 
        @click="openEditModal(sampleUser)" 
        class="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Mở Modal Chỉnh Sửa
      </button>
      
      <button 
        @click="openDeleteModal(sampleUser)" 
        class="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Mở Modal Xóa
      </button>
    </div>

    <!-- Hiển thị trạng thái -->
    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 class="font-bold mb-2">Trạng thái hiện tại:</h3>
      <p><strong>Loading:</strong> {{ loading }}</p>
      <p><strong>Số items:</strong> {{ items.length }}</p>
      <p><strong>Selected Item:</strong> {{ selectedItem?.username || 'Không có' }}</p>
      <p><strong>Modals:</strong></p>
      <ul class="ml-4">
        <li>Create: {{ modals.create }}</li>
        <li>Edit: {{ modals.edit }}</li>
        <li>Delete: {{ modals.delete }}</li>
        <li>View: {{ modals.view }}</li>
      </ul>
    </div>

    <!-- Hiển thị API Errors -->
    <div v-if="Object.keys(apiErrors).length > 0" class="bg-red-100 p-4 rounded-lg mb-6">
      <h3 class="font-bold text-red-800 mb-2">API Errors:</h3>
      <pre class="text-sm">{{ JSON.stringify(apiErrors, null, 2) }}</pre>
    </div>

    <!-- Bảng dữ liệu -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in items" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.status }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="openEditModal(user)"
                class="text-blue-600 hover:text-blue-900 mr-2"
              >
                Edit
              </button>
              <button 
                @click="openDeleteModal(user)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4">
      <button 
        @click="changePage(1)"
        :disabled="pagination.current_page === 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        First
      </button>
      <button 
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 mx-2"
      >
        Previous
      </button>
      <span class="mx-4">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
      </span>
      <button 
        @click="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 mx-2"
      >
        Next
      </button>
      <button 
        @click="changePage(pagination.last_page)"
        :disabled="pagination.current_page === pagination.last_page"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Last
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCrudDataTable } from '@/composables/data/useCrudDataTable'
import { adminEndpoints } from '@/api/endpoints'

// Sử dụng composable mới
const {
  // State
  items,
  loading,
  pagination,
  selectedItem,
  modals,
  apiErrors,
  
  // Methods
  fetchData,
  createItem,
  updateItem,
  deleteItem,
  changePage,
  
  // Modal handlers
  openCreateModal,
  openEditModal,
  openDeleteModal,
  closeCreateModal,
  closeEditModal,
  closeDeleteModal,
  
  // Error handling
  clearApiErrors
} = useCrudDataTable({
  endpoints: {
    list: adminEndpoints.users.list,
    create: adminEndpoints.users.create,
    update: (id) => adminEndpoints.users.update(id),
    delete: (id) => adminEndpoints.users.delete(id)
  },
  resourceName: 'người dùng',
  defaultFilters: {
    search: '',
    status: '',
    sort_by: 'created_at:desc'
  },
  enableUrlSync: true,
  filterKeys: ['search', 'status', 'sort_by'],
  sortKeys: ['sort_by', 'sort_order'],
  transformItem: (user) => ({
    ...user,
    fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim()
  })
})

// Sample user for demo
const sampleUser = {
  id: 1,
  username: 'demo_user',
  email: 'demo@example.com',
  status: 'active'
}

// Demo functions
async function handleCreate(userData) {
  try {
    await createItem(userData)
    console.log('User created successfully!')
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

async function handleUpdate(userData) {
  try {
    await updateItem(userData)
    console.log('User updated successfully!')
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

async function handleDelete() {
  try {
    const success = await deleteItem()
    if (success) {
      console.log('User deleted successfully!')
    } else {
      console.log('Failed to delete user')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>
