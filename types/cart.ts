// Cart types and interfaces for the e-commerce system

export interface CartItem {
    id: string
    product_id: string
    product_name: string
    product_slug: string
    product_image?: string
    variant_id?: string
    variant_name?: string
    quantity: number
    price: number
    total_price: number
    created_at: string
    updated_at: string
}

export interface Cart {
    id: string
    items: CartItem[]
    subtotal: number
    tax: number
    shipping_cost: number
    total_amount: number
    currency: string
    created_at: string
    updated_at: string
}

export interface CartSummary {
    items_count: number
    subtotal: number
    tax: number
    shipping_cost: number
    total_amount: number
    currency: string
}

export interface AddToCartRequest {
    product_id: number
    quantity: number
    product_variant_id?: number | null
}

export interface UpdateCartItemRequest {
    quantity: number
}

export interface ApplyCouponRequest {
    coupon_code: string
}

export interface CartResponse {
    success: boolean
    message: string
    data: Cart
}

export interface CartSummaryResponse {
    success: boolean
    message: string
    data: CartSummary
}

export interface CartActionResponse {
    success: boolean
    message: string
    data: CartItem | null
}

// Cart status options
export const CART_STATUS = {
    ACTIVE: 'active',
    ABANDONED: 'abandoned',
    CONVERTED: 'converted'
} as const

export type CartStatus = typeof CART_STATUS[keyof typeof CART_STATUS]

// Cart status colors for UI
export const CART_STATUS_COLORS = {
    [CART_STATUS.ACTIVE]: 'green',
    [CART_STATUS.ABANDONED]: 'yellow',
    [CART_STATUS.CONVERTED]: 'blue'
} as const

// Cart status labels in Vietnamese
export const CART_STATUS_LABELS = {
    [CART_STATUS.ACTIVE]: 'Đang hoạt động',
    [CART_STATUS.ABANDONED]: 'Đã bỏ qua',
    [CART_STATUS.CONVERTED]: 'Đã chuyển đổi'
} as const