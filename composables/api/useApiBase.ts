import { ref, computed, reactive } from 'vue'

export interface ApiState<T = any> {
    data: T | null
    loading: boolean
    error: string | null
}

export interface PaginationState {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface FiltersState {
    search?: string
    status?: string
    payment_status?: string
    shipping_status?: string
    date_from?: string
    date_to?: string
}

export function useApiBase<T = any>() {
    // State
    const state = reactive<ApiState<T>>({
        data: null,
        loading: false,
        error: null
    })

    // Computed properties
    const isLoading = computed(() => state.loading)
    const errorMessage = computed(() => state.error)
    const hasData = computed(() => state.data !== null)

    // Methods
    const setLoading = (loading: boolean) => {
        state.loading = loading
    }

    const setError = (error: string | null) => {
        state.error = error
    }

    const setData = (data: T | null) => {
        state.data = data
    }

    const resetState = () => {
        state.data = null
        state.loading = false
        state.error = null
    }

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
            setLoading(true)
            setError(null)

            const response = await apiCall()

            if (options.onSuccess) {
                options.onSuccess(response)
            }

            return response
        } catch (error: any) {
            const message = options.errorMessage || error.message || 'An error occurred'
            setError(message)

            if (options.onError) {
                options.onError(error)
            }

            console.error('API Error:', error)
            return null
        } finally {
            setLoading(false)
        }
    }

    return {
        // State
        state: readonly(state),

        // Computed
        isLoading,
        errorMessage,
        hasData,

        // Methods
        setLoading,
        setError,
        setData,
        resetState,
        handleApiCall
    }
}

export function useApiWithPagination<T = any>() {
    const { state, isLoading, errorMessage, hasData, setLoading, setError, setData, resetState, handleApiCall } = useApiBase<T[]>()

    // Pagination state
    const pagination = reactive<PaginationState>({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
    })

    // Filters state
    const filters = reactive<FiltersState>({
        search: '',
        status: '',
        payment_status: '',
        shipping_status: '',
        date_from: '',
        date_to: ''
    })

    // Computed properties
    const currentPage = computed(() => pagination.current_page)
    const totalPages = computed(() => pagination.last_page)
    const totalItems = computed(() => pagination.total)
    const hasItems = computed(() => hasData.value && state.data && state.data.length > 0)

    // Methods
    const setPagination = (newPagination: Partial<PaginationState>) => {
        Object.assign(pagination, newPagination)
    }

    const setFilters = (newFilters: Partial<FiltersState>) => {
        Object.assign(filters, newFilters)
    }

    const resetFilters = () => {
        Object.assign(filters, {
            search: '',
            status: '',
            payment_status: '',
            shipping_status: '',
            date_from: '',
            date_to: ''
        })
    }

    const resetPagination = () => {
        Object.assign(pagination, {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0
        })
    }

    return {
        // State
        state,
        pagination,
        filters,

        // Computed
        isLoading,
        errorMessage,
        hasData,
        currentPage,
        totalPages,
        totalItems,
        hasItems,

        // Methods
        setLoading,
        setError,
        setData,
        resetState,
        handleApiCall,
        setPagination,
        setFilters,
        resetFilters,
        resetPagination
    }
}