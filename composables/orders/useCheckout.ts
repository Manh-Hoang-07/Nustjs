import { ref, computed, reactive, readonly } from 'vue'
import { useGlobalApiClient } from '~/composables/api'
import { publicEndpoints } from '~/api/endpoints'
import type {
    CheckoutAddressRequest,
    CheckoutOrderRequest,
    Order,
    UseCheckoutOptions,
    CheckoutState
} from './order.types'

export default function useCheckout(options: UseCheckoutOptions = {}) {
    const { apiClient } = useGlobalApiClient()

    // Create our own reactive state for checkout
    const checkoutState = reactive<CheckoutState>({
        address: null,
        loading: false,
        error: null
    })

    // Loading and error states
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    // Local state for checkout process
    const currentStep = ref<'address' | 'payment' | 'confirmation' | 'complete'>('address')
    const orderData = ref<any>(null)
    const paymentData = ref<any>(null)

    // Computed properties
    const hasAddress = computed(() => !!checkoutState.address)
    const currentStepName = computed(() => currentStep.value)

    // Generic API call handler
    const handleApiCall = async <R>(
        apiCall: () => Promise<R>,
        options: {
            successMessage?: string
            errorMessage?: string
            onSuccess?: (data: R) => void
            onError?: (error: any) => void
        } = {}
    ): Promise<R | null> => {
        try {
            isLoading.value = true
            errorMessage.value = null

            const response = await apiCall()

            if (options.onSuccess) {
                options.onSuccess(response)
            }

            return response
        } catch (error: any) {
            const message = options.errorMessage || error.message || 'An error occurred'
            errorMessage.value = message

            if (options.onError) {
                options.onError(error)
            }

            console.error('API Error:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    // Methods
    const saveAddress = async (addressData: CheckoutAddressRequest) => {
        const response = await handleApiCall(
            () => apiClient.post(
                publicEndpoints.checkout.address,
                addressData
            ),
            { errorMessage: 'Failed to save address' }
        )

        if (response) {
            checkoutState.address = { ...addressData }
            return response.data
        }

        throw new Error('Failed to save address')
    }

    const createOrder = async (orderRequestData: CheckoutOrderRequest) => {
        const response = await handleApiCall(
            () => apiClient.post<{ data: Order }>(
                publicEndpoints.checkout.order,
                orderRequestData
            ),
            { errorMessage: 'Failed to create order' }
        )

        if (response) {
            orderData.value = response.data.data
            return response.data.data
        }

        throw new Error('Failed to create order')
    }

    const processPayment = async (paymentInfo: any) => {
        if (!orderData.value) {
            throw new Error('No order found to process payment')
        }

        const response = await handleApiCall(
            () => apiClient.post(
                publicEndpoints.orders.payment(orderData.value.id),
                paymentInfo
            ),
            { errorMessage: 'Failed to process payment' }
        )

        if (response) {
            paymentData.value = response.data.data
            return response.data.data
        }

        throw new Error('Failed to process payment')
    }

    const goToStep = (step: 'address' | 'payment' | 'confirmation' | 'complete') => {
        currentStep.value = step
    }

    const nextStep = () => {
        switch (currentStep.value) {
            case 'address':
                currentStep.value = 'payment'
                break
            case 'payment':
                currentStep.value = 'confirmation'
                break
            case 'confirmation':
                currentStep.value = 'complete'
                break
        }
    }

    const previousStep = () => {
        switch (currentStep.value) {
            case 'payment':
                currentStep.value = 'address'
                break
            case 'confirmation':
                currentStep.value = 'payment'
                break
            case 'complete':
                currentStep.value = 'confirmation'
                break
        }
    }

    const resetCheckout = () => {
        currentStep.value = 'address'
        orderData.value = null
        paymentData.value = null
        checkoutState.address = null
        checkoutState.loading = false
        checkoutState.error = null
    }

    const canProceedToPayment = computed(() => {
        return hasAddress.value &&
            checkoutState.address?.customer_name &&
            checkoutState.address?.customer_email &&
            checkoutState.address?.customer_phone &&
            checkoutState.address?.shipping_address
    })

    const canProceedToConfirmation = computed(() => {
        return canProceedToPayment.value && !!orderData.value
    })

    const canCompleteCheckout = computed(() => {
        return canProceedToConfirmation.value && !!paymentData.value
    })

    // Initialize if immediate option is true
    if (options.immediate) {
        // Could load saved address or cart data here
    }

    return {
        // State
        checkoutState,
        currentStep: readonly(currentStep),
        orderData: readonly(orderData),
        paymentData: readonly(paymentData),

        // Computed
        isLoading,
        errorMessage,
        hasAddress,
        currentStepName,
        canProceedToPayment,
        canProceedToConfirmation,
        canCompleteCheckout,

        // Methods
        saveAddress,
        createOrder,
        processPayment,
        goToStep,
        nextStep,
        previousStep,
        resetCheckout
    }
}