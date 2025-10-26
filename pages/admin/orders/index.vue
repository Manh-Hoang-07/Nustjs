<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p class="mt-2 text-gray-600">
              Xem và quản lý tất cả đơn hàng trong hệ thống
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="exportOrders"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Xuất Excel
            </button>
            <button
              @click="refreshOrders"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tải lại
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 bg-white shadow rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">
              Tìm kiếm
            </label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Mã đơn hàng, email, tên..."
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="debouncedSearch"
            />
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option
                v-for="option in ORDER_STATUS_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="payment_status" class="block text-sm font-medium text-gray-700">
              Trạng thái thanh toán
            </label>
            <select
              id="payment_status"
              v-model="filters.payment_status"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option
                v-for="option in PAYMENT_STATUS_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="shipping_status" class="block text-sm font-medium text-gray-700">
              Trạng thái vận chuyển
            </label>
            <select
              id="shipping_status"
              v-model="filters.shipping_status"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option
                v-for="option in SHIPPING_STATUS_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="flex items-end space-x-2">
            <button
              @click="resetFilters"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Đặt lại
            </button>
            <button
              @click="showBulkActions = !showBulkActions"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Hàng loạt
            </button>
          </div>
        </div>

        <!-- Bulk Actions -->
        <div v-if="showBulkActions && selectedOrders.length > 0" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">
              Đã chọn {{ selectedOrders.length }} đơn hàng
            </span>
            <div class="flex items-center space-x-3">
              <select
                v-model="bulkAction"
                class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Chọn hành động</option>
                <option value="confirm">Xác nhận</option>
                <option value="cancel">Hủy</option>
                <option value="shipped">Đã giao hàng</option>
              </select>
              <button
                @click="executeBulkAction"
                :disabled="!bulkAction"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thực hiện
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="orderManagement.errorMessage" class="mb-6">
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Đã có lỗi xảy ra
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ orderManagement.errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="orderManagement.isLoading" class="text-center py-12">
          <LoadingSpinner size="lg" />
          <p class="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>

        <div v-else-if="!orderManagement.hasOrders" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
          <p class="mt-1 text-sm text-gray-500">
            Không có đơn hàng nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>

        <DataTable
          v-else
          :columns="tableColumns"
          :data="orderManagement.state.orders"
          :selectable="true"
          :selected-items="selectedOrders"
          @selection-change="handleSelectionChange"
          @row-click="viewOrder"
        >
          <template #cell-status="{ item }">
            <OrderStatusBadge :status="item.status" size="sm" />
          </template>
          
          <template #cell-payment_status="{ item }">
            <PaymentStatusBadge :status="item.payment_status" size="sm" />
          </template>
          
          <template #cell-shipping_status="{ item }">
            <ShippingStatusBadge :status="item.shipping_status" size="sm" />
          </template>
          
          <template #cell-total_amount="{ item }">
            {{ formatCurrency(item.total_amount) }}
          </template>
          
          <template #cell-created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>
          
          <template #cell-actions="{ item }">
            <div class="flex items-center space-x-2">
              <button
                @click.stop="viewOrder(item)"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Xem
              </button>
              <button
                v-if="item.status === 'pending'"
                @click.stop="confirmOrder(item)"
                class="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Xác nhận
              </button>
              <button
                v-if="['pending', 'confirmed'].includes(item.status)"
                @click.stop="cancelOrder(item)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Hủy
              </button>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- Pagination -->
      <div v-if="orderManagement.totalPages > 1" class="mt-8">
        <Pagination
          :current-page="orderManagement.currentPage"
          :total-pages="orderManagement.totalPages"
          :total-items="orderManagement.totalOrders"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderManagement } from '~/composables/orders/index'
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, SHIPPING_STATUS_OPTIONS } from '~/types/orders'
import type { Order } from '~/types/orders'
import OrderStatusBadge from '~/components/Orders/Badges/OrderStatusBadge.vue'
import PaymentStatusBadge from '~/components/Orders/Badges/PaymentStatusBadge.vue'
import ShippingStatusBadge from '~/components/Orders/Badges/ShippingStatusBadge.vue'
import LoadingSpinner from '~/components/Core/Loading/LoadingSpinner.vue'
import DataTable from '~/components/Core/Table/DataTable.vue'
import Pagination from '~/components/Core/Navigation/Pagination.vue'

definePageMeta({
  layout: 'admin-layout',
  middleware: 'auth'
})

const router = useRouter()
const orderManagement = useOrderManagement({ immediate: true })

// Table columns
const tableColumns = [
  { key: 'order_number', label: 'Mã đơn hàng', sortable: true },
  { key: 'customer_name', label: 'Khách hàng', sortable: true },
  { key: 'customer_email', label: 'Email', sortable: true },
  { key: 'status', label: 'Trạng thái', sortable: true },
  { key: 'payment_status', label: 'Thanh toán', sortable: true },
  { key: 'shipping_status', label: 'Vận chuyển', sortable: true },
  { key: 'total_amount', label: 'Tổng tiền', sortable: true },
  { key: 'created_at', label: 'Ngày tạo', sortable: true },
  { key: 'actions', label: 'Thao tác', sortable: false }
]

// State
const selectedOrders = ref<number[]>([])
const showBulkActions = ref(false)
const bulkAction = ref('')

// Filters
const filters = reactive({
  search: '',
  status: '',
  payment_status: '',
  shipping_status: '',
  date_from: '',
  date_to: ''
})

let searchTimeout: NodeJS.Timeout | null = null

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  orderManagement.fetchOrders(1, filters)
}

const resetFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.payment_status = ''
  filters.shipping_status = ''
  filters.date_from = ''
  filters.date_to = ''
  orderManagement.fetchOrders(1)
}

const refreshOrders = () => {
  orderManagement.refreshOrders()
}

const handlePageChange = (page: number) => {
  orderManagement.fetchOrders(page, filters)
}

const handleSelectionChange = (selection: number[]) => {
  selectedOrders.value = selection
}

const viewOrder = (order: Order) => {
  router.push(`/admin/orders/${order.id}`)
}

const confirmOrder = async (order: Order) => {
  if (confirm(`Xác nhận đơn hàng ${order.order_number}?`)) {
    try {
      await orderManagement.confirmOrder(order.id, { note: 'Đã xác nhận đơn hàng' })
    } catch (error) {
      console.error('Error confirming order:', error)
    }
  }
}

const cancelOrder = async (order: Order) => {
  const reason = prompt('Lý do hủy đơn hàng:')
  if (reason) {
    try {
      await orderManagement.cancelOrder(order.id, { reason })
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }
}

const executeBulkAction = async () => {
  if (!bulkAction.value || selectedOrders.value.length === 0) return

  const actionText = {
    confirm: 'xác nhận',
    cancel: 'hủy',
    shipped: 'đánh dấu đã giao hàng'
  }

  if (confirm(`${actionText[bulkAction.value as keyof typeof actionText]} ${selectedOrders.value.length} đơn hàng đã chọn?`)) {
    try {
      await orderManagement.bulkUpdateStatus({
        ids: selectedOrders.value,
        status: bulkAction.value as any
      })
      selectedOrders.value = []
      bulkAction.value = ''
      showBulkActions.value = false
    } catch (error) {
      console.error('Error executing bulk action:', error)
    }
  }
}

const exportOrders = () => {
  // This would implement Excel export functionality
  console.log('Exporting orders...')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  orderManagement.fetchOrders(1, filters)
})
</script>