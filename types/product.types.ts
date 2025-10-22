// ===== BASE TYPES =====

export type Id = string | number
export type Status = 'active' | 'inactive' | 'draft' | 'out_of_stock'
export type AttributeType = 'text' | 'color' | 'image' | 'number'

// ===== PRODUCT CATEGORIES =====

export interface ProductCategory {
    id: Id
    name: string
    slug: string
    description?: string
    image?: string
    parent_id: Id | null
    status: Status
    parent?: ProductCategory | null
    children?: ProductCategory[]
    created_at?: string
    updated_at?: string
}

export interface ProductCategoryTree extends ProductCategory {
    children: ProductCategoryTree[]
}

export interface ProductCategoryFormData {
    name: string
    slug?: string
    description?: string
    image?: string
    parent_id?: Id | null
    status: Status
}

// ===== PRODUCT ATTRIBUTES =====

export interface ProductAttribute {
    id: Id
    name: string
    slug: string
    type: AttributeType
    status: Status
    created_at?: string
    updated_at?: string
}

export interface ProductAttributeValue {
    id: Id
    attribute_id: Id
    value: string
    created_at?: string
    updated_at?: string
}

export interface ProductAttributeFormData {
    name: string
    slug?: string
    type: AttributeType
    status: Status
}

// ===== PRODUCT VARIANTS =====

export interface ProductVariantAttribute {
    attribute: ProductAttribute
    value: ProductAttributeValue
}

export interface ProductVariant {
    id: Id
    product_id: Id
    name: string
    sku: string
    price: number
    sale_price?: number
    stock_quantity: number
    weight?: number
    image?: string
    status: Status
    attributes?: ProductVariantAttribute[]
    product?: ProductBasic
    created_at?: string
    updated_at?: string
}

export interface ProductVariantFormData {
    product_id: Id
    name: string
    sku: string
    price: number
    sale_price?: number
    stock_quantity: number
    weight?: number
    status: Status
    attribute_values?: Array<{
        attribute_id: Id
        value_id: Id
    }>
    image?: string
}

// ===== PRODUCTS =====

export interface ProductDimensions {
    length: number
    width: number
    height: number
}

export interface ProductBasic {
    id: Id
    name: string
    slug: string
    sku: string
    description?: string
    price: number
    sale_price?: number
    stock_quantity: number
    status: Status
    featured: boolean
    image?: string
    categories?: ProductCategory[]
    variants?: ProductVariant[]
}

export interface Product extends ProductBasic {
    content?: string
    weight?: number
    dimensions?: ProductDimensions
    images?: string[]
    created_at?: string
    updated_at?: string
    createdUser?: {
        id: Id
        name: string
    }
    updatedUser?: {
        id: Id
        name: string
    }
}

export interface ProductFormData {
    name: string
    slug?: string
    sku: string
    description?: string
    content?: string
    price: number
    sale_price?: number
    stock_quantity: number
    status: Status
    featured?: boolean
    weight?: number
    dimensions?: ProductDimensions
    category_ids?: Id[]
    images?: string[]
}

export interface ProductSearchParams {
    q?: string
    category?: Id
    min_price?: number
    max_price?: number
    sort_by?: 'name' | 'price' | 'created_at'
    sort_order?: 'asc' | 'desc'
    limit?: number
    page?: number
    per_page?: number
}

export interface ProductFilterParams {
    status?: Status
    featured?: boolean
    category_id?: Id
    min_price?: number
    max_price?: number
    in_stock?: boolean
    sort_by?: 'name' | 'price' | 'created_at' | 'updated_at'
    sort_order?: 'asc' | 'desc'
    page?: number
    per_page?: number
}

// ===== API RESPONSE TYPES =====

export interface PaginatedResponse<T> {
    success: boolean
    message: string
    data: T[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

export interface SingleResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface MessageResponse {
    success: boolean
    message: string
    data: null
}

// ===== PRODUCT API RESPONSES =====

export type ProductListResponse = PaginatedResponse<Product>
export type ProductResponse = SingleResponse<Product>
export type ProductBasicListResponse = PaginatedResponse<ProductBasic>
export type FeaturedProductsResponse = SingleResponse<ProductBasic[]>
export type ProductSearchResponse = SingleResponse<ProductBasic[]>
export type ProductsByCategoryResponse = PaginatedResponse<ProductBasic>
export type ProductVariantsResponse = SingleResponse<ProductVariant[]>

export type ProductCategoryListResponse = PaginatedResponse<ProductCategory>
export type ProductCategoryResponse = SingleResponse<ProductCategory>
export type ProductCategoryTreeResponse = SingleResponse<ProductCategoryTree[]>
export type ProductsByCategoryDetailResponse = PaginatedResponse<ProductBasic>

export type ProductVariantListResponse = PaginatedResponse<ProductVariant>
export type ProductVariantResponse = SingleResponse<ProductVariant>
export type ProductVariantsByProductResponse = SingleResponse<ProductVariant[]>

export type ProductAttributeListResponse = PaginatedResponse<ProductAttribute>
export type ProductAttributeResponse = SingleResponse<ProductAttribute>

// ===== ADMIN API RESPONSES =====

export type AdminProductListResponse = PaginatedResponse<Product>
export type AdminProductResponse = SingleResponse<Product>
export type AdminProductCategoryListResponse = PaginatedResponse<ProductCategory>
export type AdminProductCategoryResponse = SingleResponse<ProductCategory>
export type AdminProductCategoryTreeResponse = SingleResponse<ProductCategoryTree[]>
export type AdminProductVariantListResponse = PaginatedResponse<ProductVariant>
export type AdminProductVariantResponse = SingleResponse<ProductVariant>
export type AdminProductAttributeListResponse = PaginatedResponse<ProductAttribute>
export type AdminProductAttributeResponse = SingleResponse<ProductAttribute>

// ===== FORM VALIDATION TYPES =====

export interface ProductFormErrors {
    name?: string[]
    slug?: string[]
    sku?: string[]
    description?: string[]
    content?: string[]
    price?: string[]
    sale_price?: string[]
    stock_quantity?: string[]
    status?: string[]
    featured?: string[]
    weight?: string[]
    dimensions?: {
        length?: string[]
        width?: string[]
        height?: string[]
    }
    category_ids?: string[]
    images?: string[]
}

export interface ProductCategoryFormErrors {
    name?: string[]
    slug?: string[]
    description?: string[]
    parent_id?: string[]
    status?: string[]
}

export interface ProductVariantFormErrors {
    product_id?: string[]
    name?: string[]
    sku?: string[]
    price?: string[]
    sale_price?: string[]
    stock_quantity?: string[]
    weight?: string[]
    status?: string[]
    attribute_values?: string[]
    image?: string[]
}

export interface ProductAttributeFormErrors {
    name?: string[]
    slug?: string[]
    type?: string[]
    status?: string[]
}