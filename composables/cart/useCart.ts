import { ref, computed } from 'vue'
import type {
    Cart,
    CartItem,
    CartSummary,
    AddToCartRequest,
    UpdateCartItemRequest,
    ApplyCouponRequest,
    CartResponse,
    CartSummaryResponse,
    CartActionResponse
} from '~/types/cart'
import { publicEndpoints } from '~/api/endpoints/public'
import { useApiClient } from '~/composables/api/useApiClient'
import { useApiBase } from '~/composables/api/useApiBase'

// Reactive state
const cart = ref<Cart | null>(null)
const { state, isLoading, errorMessage, setLoading, setError, handleApiCall } = useApiBase<Cart>()

export function useCart() {
    // Computed properties
    const items = computed(() => cart.value?.items || [])
    const itemsCount = computed(() => cart.value?.items.reduce((total, item) => total + item.quantity, 0) || 0)
    const subtotal = computed(() => cart.value?.subtotal || 0)
    const tax = computed(() => cart.value?.tax || 0)
    const shippingCost = computed(() => cart.value?.shipping_cost || 0)
    const totalAmount = computed(() => cart.value?.total_amount || 0)
    const hasItems = computed(() => itemsCount.value > 0)
    const isEmpty = computed(() => itemsCount.value === 0)

    // Get API client
    const { apiClient } = useApiClient()

    // Fetch cart from API
    const fetchCart = async () => {
        const response = await handleApiCall(
            () => apiClient.get<CartResponse>(publicEndpoints.cart.list),
            { errorMessage: 'Failed to fetch cart' }
        )

        if (response && response.data.success) {
            cart.value = response.data.data
            return response.data.data
        }

        return null
    }

    // Add item to cart
    const addToCart = async (request: AddToCartRequest) => {
        const response = await handleApiCall(
            () => apiClient.post<CartActionResponse>(publicEndpoints.cart.add, request),
            { errorMessage: 'Failed to add item to cart' }
        )

        if (response) {
            // Refresh cart to get updated data
            await fetchCart()
            return response.data.data
        }

        throw new Error('Failed to add item to cart')
    }

    // Update cart item quantity
    const updateCartItem = async (itemId: string, request: UpdateCartItemRequest) => {
        const response = await handleApiCall(
            () => apiClient.put<CartActionResponse>(publicEndpoints.cart.update(itemId), request),
            { errorMessage: 'Failed to update cart item' }
        )

        if (response) {
            // Refresh cart to get updated data
            await fetchCart()
            return response.data.data
        }

        throw new Error('Failed to update cart item')
    }

    // Remove item from cart
    const removeFromCart = async (itemId: string) => {
        const response = await handleApiCall(
            () => apiClient.delete<CartActionResponse>(publicEndpoints.cart.remove(itemId)),
            { errorMessage: 'Failed to remove item from cart' }
        )

        if (response) {
            // Refresh cart to get updated data
            await fetchCart()
            return response.data.data
        }

        throw new Error('Failed to remove item from cart')
    }

    // Clear entire cart
    const clearCart = async () => {
        const response = await handleApiCall(
            () => apiClient.delete<CartResponse>(publicEndpoints.cart.clear),
            { errorMessage: 'Failed to clear cart' }
        )

        if (response && response.data.success) {
            cart.value = response.data.data
            return response.data.data
        }

        throw new Error('Failed to clear cart')
    }

    // Apply coupon to cart
    const applyCoupon = async (couponCode: string) => {
        const request: ApplyCouponRequest = { coupon_code: couponCode }
        const response = await handleApiCall(
            () => apiClient.post<CartResponse>(publicEndpoints.cart.applyCoupon, request),
            { errorMessage: 'Failed to apply coupon' }
        )

        if (response && response.data.success) {
            cart.value = response.data.data
            return response.data.data
        }

        throw new Error('Failed to apply coupon')
    }

    // Remove coupon from cart
    const removeCoupon = async () => {
        const response = await handleApiCall(
            () => apiClient.delete<CartResponse>(publicEndpoints.cart.removeCoupon),
            { errorMessage: 'Failed to remove coupon' }
        )

        if (response && response.data.success) {
            cart.value = response.data.data
            return response.data.data
        }

        throw new Error('Failed to remove coupon')
    }

    // Get cart summary
    const getCartSummary = async () => {
        const response = await handleApiCall(
            () => apiClient.get<CartSummaryResponse>(publicEndpoints.cart.summary),
            { errorMessage: 'Failed to get cart summary' }
        )

        if (response && response.data.success) {
            return response.data.data
        }

        throw new Error('Failed to get cart summary')
    }

    // Initialize cart on composable creation
    const initializeCart = async () => {
        try {
            await fetchCart()
        } catch (error) {
            console.warn('Failed to initialize cart:', error)
            // Don't throw error here, just log it
        }
    }

    return {
        // State
        cart: readonly(cart),
        isLoading,
        errorMessage,

        // Computed properties
        items,
        itemsCount,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        hasItems,
        isEmpty,

        // Methods
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartSummary,
        applyCoupon,
        removeCoupon,
        initializeCart
    }
}