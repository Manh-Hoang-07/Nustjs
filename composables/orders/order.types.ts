// Re-export order types from main types file
export type * from '~/types/orders'

// Additional composable-specific types
export interface UseOrdersOptions {
    immediate?: boolean;
    page?: number;
    perPage?: number;
    search?: string;
    status?: string;
}

export interface UseOrderManagementOptions {
    immediate?: boolean;
    orderId?: number;
}

export interface UseCheckoutOptions {
    immediate?: boolean;
}

export interface OrderFilters {
    search?: string;
    status?: string;
    payment_status?: string;
    shipping_status?: string;
    date_from?: string;
    date_to?: string;
}

export interface OrderPagination {
    page: number;
    per_page: number;
}

export interface OrderState {
    orders: any[];
    currentOrder: any;
    loading: boolean;
    error: string | null;
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: OrderFilters;
}

export interface CheckoutState {
    address: any;
    loading: boolean;
    error: string | null;
}