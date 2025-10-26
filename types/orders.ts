// Order Types and Interfaces

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';

export type PaymentStatus =
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded'
    | 'partially_refunded';

export type ShippingStatus =
    | 'pending'
    | 'preparing'
    | 'shipped'
    | 'delivered'
    | 'returned';

export type PaymentMethod =
    | 'cod'
    | 'bank_transfer'
    | 'credit_card'
    | 'debit_card'
    | 'ewallet';

export type ShippingMethod =
    | 'standard'
    | 'express'
    | 'overnight'
    | 'pickup';

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    total?: number;
    product_image?: string;
    variant_id?: number;
    variant_name?: string;
}

export interface OrderAddress {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    billing_address?: string;
}

export interface PaymentDetails {
    card_number?: string;
    transaction_id?: string;
    payment_method: PaymentMethod;
    amount?: number;
}

export interface ShippingDetails {
    method: ShippingMethod;
    tracking_number?: string;
    shipping_cost?: number;
}

export interface BaseOrder {
    id: number;
    order_number: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    shipping_status: ShippingStatus;
    total_amount: number;
    subtotal?: number;
    tax?: number;
    shipping_cost?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Order extends BaseOrder, OrderAddress {
    items: OrderItem[];
    payment_method: PaymentMethod;
    shipping_method: ShippingMethod;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    confirmed_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
}

export interface OrderListResponse {
    data: Order[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface CreateOrderRequest {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    billing_address?: string;
    payment_method: PaymentMethod;
    shipping_method: ShippingMethod;
    cart_header_id?: string;
    notes?: string;
}

export interface CheckoutAddressRequest {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    billing_address?: string;
    notes?: string;
}

export interface CheckoutOrderRequest {
    cart_header_id: string;
    payment_method: PaymentMethod;
    shipping_method: ShippingMethod;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

export interface UpdatePaymentStatusRequest {
    payment_status: PaymentStatus;
}

export interface UpdateShippingStatusRequest {
    shipping_status: ShippingStatus;
    tracking_number?: string;
}

export interface AddOrderItemRequest {
    product_id: number;
    quantity: number;
    price: number;
    variant_id?: number;
}

export interface UpdateOrderItemRequest {
    quantity: number;
    price: number;
}

export interface PaymentRequest {
    payment_method: PaymentMethod;
    payment_details?: PaymentDetails;
}

export interface BulkUpdateStatusRequest {
    ids: number[];
    status: OrderStatus;
}

export interface ConfirmOrderRequest {
    note?: string;
}

export interface CancelOrderRequest {
    reason: string;
}

export interface OrderStatusResponse {
    order_number: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    shipping_status: ShippingStatus;
}

export interface UserAddressResponse {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    default_shipping_address: string;
    default_billing_address: string;
}

export interface RecalculateOrderResponse {
    id: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total_amount: number;
}

// Status options for dropdowns
export const ORDER_STATUS_OPTIONS = [
    { value: 'pending', label: 'Chờ xác nhận', color: 'yellow' },
    { value: 'confirmed', label: 'Đã xác nhận', color: 'blue' },
    { value: 'preparing', label: 'Đang chuẩn bị', color: 'purple' },
    { value: 'ready', label: 'Sẵn sàng giao hàng', color: 'indigo' },
    { value: 'shipped', label: 'Đang giao hàng', color: 'orange' },
    { value: 'delivered', label: 'Đã giao hàng', color: 'green' },
    { value: 'cancelled', label: 'Đã hủy', color: 'red' },
    { value: 'returned', label: 'Đã trả hàng', color: 'gray' },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
    { value: 'pending', label: 'Chờ thanh toán', color: 'yellow' },
    { value: 'paid', label: 'Đã thanh toán', color: 'green' },
    { value: 'failed', label: 'Thanh toán thất bại', color: 'red' },
    { value: 'refunded', label: 'Đã hoàn tiền', color: 'blue' },
    { value: 'partially_refunded', label: 'Hoàn tiền một phần', color: 'orange' },
] as const;

export const SHIPPING_STATUS_OPTIONS = [
    { value: 'pending', label: 'Chờ giao hàng', color: 'yellow' },
    { value: 'preparing', label: 'Đang chuẩn bị', color: 'purple' },
    { value: 'shipped', label: 'Đang giao hàng', color: 'blue' },
    { value: 'delivered', label: 'Đã giao hàng', color: 'green' },
    { value: 'returned', label: 'Đã trả hàng', color: 'red' },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
    { value: 'credit_card', label: 'Thẻ tín dụng' },
    { value: 'debit_card', label: 'Thẻ ghi nợ' },
    { value: 'ewallet', label: 'Ví điện tử' },
] as const;

export const SHIPPING_METHOD_OPTIONS = [
    { value: 'standard', label: 'Giao hàng tiêu chuẩn (3-5 ngày)' },
    { value: 'express', label: 'Giao hàng nhanh (1-2 ngày)' },
    { value: 'overnight', label: 'Giao hàng trong ngày' },
    { value: 'pickup', label: 'Tại cửa hàng' },
] as const;