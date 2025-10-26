import { computed } from 'vue'
import { useGlobalApiClient } from '~/composables/api'
import { publicEndpoints } from '~/api/endpoints'
import type {
    Order,
    OrderListResponse,
    CreateOrderRequest,
    PaymentRequest,
    OrderStatusResponse,
    UserAddressResponse,
    UseOrdersOptions,
    OrderFilters
} from './order.types'
import { useApiWithPagination } from '~/composables/api/useApiBase'

export default function useOrders(options: UseOrdersOptions = {}) {
    const { apiClient } = useGlobalApiClient()
    const {
        state,
        isLoading,
        errorMessage,
        hasData: hasOrders,
        currentPage,
        totalPages,
        totalItems: totalOrders,
        pagination,
        filters,
        handleApiCall,
        setPagination,
        setFilters,
        resetFilters,
        resetState
    } = useApiWithPagination<Order>()

    // Methods
    const fetchOrders = async (page = 1, filters: OrderFilters = {}) => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: pagination.per_page.toString(),
            ...filters
        })

        const response = await handleApiCall(
            () => apiClient.get<OrderListResponse>(
                `${publicEndpoints.orders.list}?${params.toString()}`
            ),
            { errorMessage: 'Failed to fetch orders' }
        )

        if (response) {
            state.data = response.data.data
            setPagination(response.data.meta)
        }
    }

    const fetchOrder = async (orderId: number) => {
        const response = await handleApiCall(
            () => apiClient.get<{ data: Order }>(
                publicEndpoints.orders.show(orderId)
            ),
            { errorMessage: 'Failed to fetch order' }
        )

        if (response) {
            state.currentOrder = response.data.data
            return response.data.data
        }

        throw new Error('Failed to fetch order')
    }

    const fetchGuestOrder = async (orderNumber: string, email: string) => {
        const response = await handleApiCall(
            () => apiClient.get<{ data: Order }>(
                publicEndpoints.orders.showGuest(orderNumber, email)
            ),
            { errorMessage: 'Failed to fetch guest order' }
        )

        if (response) {
            state.currentOrder = response.data.data
            return response.data.data
        }

        throw new Error('Failed to fetch guest order')
    }

    const createOrder = async (orderData: CreateOrderRequest) => {
        const response = await handleApiCall(
            () => apiClient.post<{ data: Order }>(
                publicEndpoints.orders.create,
                orderData
            ),
            { errorMessage: 'Failed to create order' }
        )

        if (response) {
            return response.data.data
        }

        throw new Error('Failed to create order')
    }

    const processPayment = async (orderId: number, paymentData: PaymentRequest) => {
        const response = await handleApiCall(
            () => apiClient.post<{ data: any }>(
                publicEndpoints.orders.payment(orderId),
                paymentData
            ),
            { errorMessage: 'Failed to process payment' }
        )

        if (response) {
            // Update current order if it exists
            if (state.currentOrder && state.currentOrder.id === orderId) {
                state.currentOrder = { ...state.currentOrder, ...response.data.data }
            }

            return response.data.data
        }

        throw new Error('Failed to process payment')
    }

    const getOrderStatus = async (orderNumber: string) => {
        const response = await handleApiCall(
            () => apiClient.get<OrderStatusResponse>(
                publicEndpoints.orders.status(orderNumber)
            ),
            { errorMessage: 'Failed to get order status' }
        )

        if (response) {
            return response.data
        }

        throw new Error('Failed to get order status')
    }

    const getUserAddress = async () => {
        const response = await handleApiCall(
            () => apiClient.get<{ data: UserAddressResponse }>(
                publicEndpoints.orders.userAddress
            ),
            { errorMessage: 'Failed to get user address' }
        )

        if (response) {
            return response.data.data
        }

        throw new Error('Failed to get user address')
    }

    const refreshOrders = () => {
        fetchOrders(pagination.current_page, filters)
    }

    // Initialize if immediate option is true
    if (options.immediate) {
        fetchOrders(options.page || 1, {
            search: options.search,
            status: options.status
        })
    }

    return {
        // State
        state,
        currentOrder: computed(() => state.currentOrder),

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
        fetchGuestOrder,
        createOrder,
        processPayment,
        getOrderStatus,
        getUserAddress,
        setFilters,
        resetFilters,
        refreshOrders
    }
}