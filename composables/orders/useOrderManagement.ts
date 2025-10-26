import { ref, computed, reactive } from 'vue'
import { useGlobalApiClient } from '~/composables/api'
import { adminEndpoints } from '~/api/endpoints'
import type {
    Order,
    OrderListResponse,
    UpdateOrderStatusRequest,
    UpdatePaymentStatusRequest,
    UpdateShippingStatusRequest,
    AddOrderItemRequest,
    UpdateOrderItemRequest,
    BulkUpdateStatusRequest,
    ConfirmOrderRequest,
    CancelOrderRequest,
    RecalculateOrderResponse,
    UseOrderManagementOptions,
    OrderState,
    OrderFilters
} from './order.types'

export default function useOrderManagement(options: UseOrderManagementOptions = {}) {
    const { apiClient } = useGlobalApiClient()

    // State
    const state = reactive<OrderState>({
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0
        },
        filters: {
            search: '',
            status: '',
            payment_status: '',
            shipping_status: '',
            date_from: '',
            date_to: ''
        }
    })

    // Computed properties
    const hasOrders = computed(() => state.orders.length > 0)
    const isLoading = computed(() => state.loading)
    const errorMessage = computed(() => state.error)
    const currentPage = computed(() => state.pagination.current_page)
    const totalPages = computed(() => state.pagination.last_page)
    const totalOrders = computed(() => state.pagination.total)

    // Methods
    const fetchOrders = async (page = 1, filters: OrderFilters = {}) => {
        state.loading = true
        state.error = null

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: state.pagination.per_page.toString(),
                ...filters
            })

            const response = await apiClient.get<OrderListResponse>(
                `${adminEndpoints.orders.list}?${params.toString()}`
            )

            state.orders = response.data.data
            state.pagination = response.data.meta
        } catch (error: any) {
            state.error = error.message || 'Failed to fetch orders'
            console.error('Error fetching orders:', error)
        } finally {
            state.loading = false
        }
    }

    const fetchOrder = async (orderId: number) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.get<{ data: Order }>(
                adminEndpoints.orders.show(orderId)
            )
            state.currentOrder = response.data.data
            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to fetch order'
            console.error('Error fetching order:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const updateOrderStatus = async (orderId: number, statusData: UpdateOrderStatusRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.patch<{ data: Order }>(
                adminEndpoints.orders.updateStatus(orderId),
                statusData
            )

            // Update current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                state.currentOrder = { ...state.currentOrder, ...response.data.data }
            }

            // Update order in list if it exists
            const orderIndex = state.orders.findIndex(order => order.id === orderId)
            if (orderIndex !== -1) {
                state.orders[orderIndex] = { ...state.orders[orderIndex], ...response.data.data }
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to update order status'
            console.error('Error updating order status:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const updatePaymentStatus = async (orderId: number, statusData: UpdatePaymentStatusRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.patch<{ data: Order }>(
                adminEndpoints.orders.updatePaymentStatus(orderId),
                statusData
            )

            // Update current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                state.currentOrder = { ...state.currentOrder, ...response.data.data }
            }

            // Update order in list if it exists
            const orderIndex = state.orders.findIndex(order => order.id === orderId)
            if (orderIndex !== -1) {
                state.orders[orderIndex] = { ...state.orders[orderIndex], ...response.data.data }
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to update payment status'
            console.error('Error updating payment status:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const updateShippingStatus = async (orderId: number, statusData: UpdateShippingStatusRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.patch<{ data: Order }>(
                adminEndpoints.orders.updateShippingStatus(orderId),
                statusData
            )

            // Update current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                state.currentOrder = { ...state.currentOrder, ...response.data.data }
            }

            // Update order in list if it exists
            const orderIndex = state.orders.findIndex(order => order.id === orderId)
            if (orderIndex !== -1) {
                state.orders[orderIndex] = { ...state.orders[orderIndex], ...response.data.data }
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to update shipping status'
            console.error('Error updating shipping status:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const addOrderItem = async (orderId: number, itemData: AddOrderItemRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.post<{ data: any }>(
                adminEndpoints.orders.addItem(orderId),
                itemData
            )

            // Refresh current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                await fetchOrder(orderId)
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to add order item'
            console.error('Error adding order item:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const updateOrderItem = async (orderId: number, itemId: number, itemData: UpdateOrderItemRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.patch<{ data: any }>(
                adminEndpoints.orders.updateItem(orderId, itemId),
                itemData
            )

            // Refresh current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                await fetchOrder(orderId)
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to update order item'
            console.error('Error updating order item:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const deleteOrderItem = async (orderId: number, itemId: number) => {
        state.loading = true
        state.error = null

        try {
            await apiClient.delete(
                adminEndpoints.orders.deleteItem(orderId, itemId)
            )

            // Refresh current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                await fetchOrder(orderId)
            }

            return true
        } catch (error: any) {
            state.error = error.message || 'Failed to delete order item'
            console.error('Error deleting order item:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const recalculateOrder = async (orderId: number) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.post<{ data: RecalculateOrderResponse }>(
                adminEndpoints.orders.recalculate(orderId)
            )

            // Refresh current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                await fetchOrder(orderId)
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to recalculate order'
            console.error('Error recalculating order:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const confirmOrder = async (orderId: number, confirmData: ConfirmOrderRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.post<{ data: Order }>(
                adminEndpoints.orders.confirm(orderId),
                confirmData
            )

            // Update current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                state.currentOrder = { ...state.currentOrder, ...response.data.data }
            }

            // Update order in list if it exists
            const orderIndex = state.orders.findIndex(order => order.id === orderId)
            if (orderIndex !== -1) {
                state.orders[orderIndex] = { ...state.orders[orderIndex], ...response.data.data }
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to confirm order'
            console.error('Error confirming order:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const cancelOrder = async (orderId: number, cancelData: CancelOrderRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.post<{ data: Order }>(
                adminEndpoints.orders.cancel(orderId),
                cancelData
            )

            // Update current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                state.currentOrder = { ...state.currentOrder, ...response.data.data }
            }

            // Update order in list if it exists
            const orderIndex = state.orders.findIndex(order => order.id === orderId)
            if (orderIndex !== -1) {
                state.orders[orderIndex] = { ...state.orders[orderIndex], ...response.data.data }
            }

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to cancel order'
            console.error('Error cancelling order:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const bulkUpdateStatus = async (bulkData: BulkUpdateStatusRequest) => {
        state.loading = true
        state.error = null

        try {
            const response = await apiClient.post<{ data: { updated_count: number; failed_count: number } }>(
                adminEndpoints.orders.bulkUpdateStatus,
                bulkData
            )

            // Refresh orders list to see updated statuses
            await fetchOrders(state.pagination.current_page, state.filters)

            return response.data.data
        } catch (error: any) {
            state.error = error.message || 'Failed to bulk update status'
            console.error('Error bulk updating status:', error)
            throw error
        } finally {
            state.loading = false
        }
    }

    const updateFilters = (filters: Partial<OrderFilters>) => {
        state.filters = { ...state.filters, ...filters }
    }

    const resetFilters = () => {
        state.filters = {
            search: '',
            status: '',
            payment_status: '',
            shipping_status: '',
            date_from: '',
            date_to: ''
        }
    }

    const refreshOrders = () => {
        fetchOrders(state.pagination.current_page, state.filters)
    }

    // Initialize if immediate option is true
    if (options.immediate) {
        fetchOrders()
    }

    if (options.orderId) {
        fetchOrder(options.orderId)
    }

    return {
        // State
        state: readonly(state),

        // Computed
        hasOrders,
        isLoading,
        errorMessage,
        currentPage,
        totalPages,
        totalOrders,

        // Methods
        fetchOrders,
        fetchOrder,
        updateOrderStatus,
        updatePaymentStatus,
        updateShippingStatus,
        addOrderItem,
        updateOrderItem,
        deleteOrderItem,
        recalculateOrder,
        confirmOrder,
        cancelOrder,
        bulkUpdateStatus,
        updateFilters,
        resetFilters,
        refreshOrders
    }
}