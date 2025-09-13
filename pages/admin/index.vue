<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Tổng quan về hoạt động của hệ thống</p>
      </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tổng người dùng</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600">+12%</span>
          <span class="text-sm text-gray-600">so với tháng trước</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Doanh thu</p>
            <p class="text-2xl font-semibold text-gray-900">{{ formatPrice(stats.revenue) }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600">+8%</span>
          <span class="text-sm text-gray-600">so với tháng trước</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Đơn hàng</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalOrders }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600">+15%</span>
          <span class="text-sm text-gray-600">so với tháng trước</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Sản phẩm</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalProducts }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600">+5%</span>
          <span class="text-sm text-gray-600">so với tháng trước</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h3>
        <div class="h-64 flex items-end justify-between space-x-2">
          <div 
            v-for="(month, index) in revenueData" 
            :key="index"
            class="flex-1 bg-blue-500 rounded-t"
            :style="{ height: `${month.percentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-4 text-sm text-gray-600">
          <span v-for="(month, index) in revenueData" :key="index">
            {{ month.name }}
          </span>
        </div>
      </div>

      <!-- Orders Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Đơn hàng theo tháng</h3>
        <div class="h-64 flex items-end justify-between space-x-2">
          <div 
            v-for="(month, index) in ordersData" 
            :key="index"
            class="flex-1 bg-green-500 rounded-t"
            :style="{ height: `${month.percentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-4 text-sm text-gray-600">
          <span v-for="(month, index) in ordersData" :key="index">
            {{ month.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
        </div>
        <div class="p-6">
          <div 
            v-for="order in recentOrders" 
            :key="order.id"
            class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div>
              <p class="font-medium text-gray-900">#{{ order.id }}</p>
              <p class="text-sm text-gray-600">{{ order.customer }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">{{ formatPrice(order.amount) }}</p>
              <span :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              ]">
                {{ getStatusText(order.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Users -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Người dùng mới</h3>
        </div>
        <div class="p-6">
          <div 
            v-for="user in recentUsers" 
            :key="user.id"
            class="flex items-center py-3 border-b border-gray-100 last:border-b-0"
          >
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-gray-700">{{ user.name.charAt(0) }}</span>
            </div>
            <div class="ml-4">
              <p class="font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-sm text-gray-600">{{ user.email }}</p>
            </div>
            <div class="ml-auto text-sm text-gray-500">
              {{ formatDate(user.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: 'admin-layout',
  title: 'Dashboard',
  description: 'Admin Dashboard - Tổng quan hệ thống',
  requiresAuth: true,
  requiresAdmin: true
})

// Loading state
const isLoading = ref(true)

// Data
const stats = ref({
  totalUsers: 1250,
  revenue: 150000000,
  totalOrders: 342,
  totalProducts: 156
})

const revenueData = ref([
  { name: 'T1', percentage: 60 },
  { name: 'T2', percentage: 80 },
  { name: 'T3', percentage: 45 },
  { name: 'T4', percentage: 90 },
  { name: 'T5', percentage: 75 },
  { name: 'T6', percentage: 85 }
])

const ordersData = ref([
  { name: 'T1', percentage: 70 },
  { name: 'T2', percentage: 85 },
  { name: 'T3', percentage: 60 },
  { name: 'T4', percentage: 95 },
  { name: 'T5', percentage: 80 },
  { name: 'T6', percentage: 90 }
])

const recentOrders = ref([
  { id: '001', customer: 'Nguyễn Văn A', amount: 2500000, status: 'completed' },
  { id: '002', customer: 'Trần Thị B', amount: 1800000, status: 'pending' },
  { id: '003', customer: 'Lê Văn C', amount: 3200000, status: 'processing' },
  { id: '004', customer: 'Phạm Thị D', amount: 1500000, status: 'completed' },
  { id: '005', customer: 'Hoàng Văn E', amount: 4200000, status: 'pending' }
])

const recentUsers = ref([
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', created_at: '2024-01-15' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', created_at: '2024-01-14' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', created_at: '2024-01-13' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', created_at: '2024-01-12' },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', created_at: '2024-01-11' }
])

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const getStatusText = (status) => {
  const statusMap = {
    'completed': 'Hoàn thành',
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'cancelled': 'Đã hủy'
  }
  return statusMap[status] || status
}

// Simulate loading data
onMounted(() => {
  // Simulate API call delay
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script> 
