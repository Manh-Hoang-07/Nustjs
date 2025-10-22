type Id = string | number;

export const adminEndpoints = {
  users: {
    list: '/api/admin/users',
    create: '/api/admin/users',
    show: (id: Id) => `/api/admin/users/${id}`,
    update: (id: Id) => `/api/admin/users/${id}`,
    delete: (id: Id) => `/api/admin/users/${id}`,
    changePassword: (id: Id) => `/api/admin/users/${id}/change-password`,
    showWithRoles: (id: Id) => `/api/admin/users/${id}/with-roles`,
    assignRoles: (id: Id) => `/api/admin/users/${id}/assign-roles`,
  },
  products: {
    list: '/api/admin/products',
    create: '/api/admin/products',
    show: (id: Id) => `/api/admin/products/${id}`,
    update: (id: Id) => `/api/admin/products/${id}`,
    delete: (id: Id) => `/api/admin/products/${id}`,
    getForSelect: '/api/admin/products/select/list',
    updateStatus: (id: Id) => `/api/admin/products/status/${id}`,
    toggleFeatured: (id: Id) => `/api/admin/products/toggle-featured/${id}`,
  },
  orders: {
    list: '/api/admin/orders',
    create: '/api/admin/orders',
    show: (id: Id) => `/api/admin/orders/${id}`,
    update: (id: Id) => `/api/admin/orders/${id}`,
    delete: (id: Id) => `/api/admin/orders/${id}`,
  },
  warehouses: {
    list: '/api/admin/warehouses',
    create: '/api/admin/warehouses',
    show: (id: Id) => `/api/admin/warehouses/${id}`,
    update: (id: Id) => `/api/admin/warehouses/${id}`,
    delete: (id: Id) => `/api/admin/warehouses/${id}`,
    customEndpoint: (id: Id) => `/api/admin/warehouses/${id}/custom-action`,
  },
  categories: {
    list: '/api/admin/categories',
    create: '/api/admin/categories',
    show: (id: Id) => `/api/admin/categories/${id}`,
    update: (id: Id) => `/api/admin/categories/${id}`,
    delete: (id: Id) => `/api/admin/categories/${id}`,
    search: '/api/admin/categories/search',
  },
  brands: {
    list: '/api/admin/brands',
    create: '/api/admin/brands',
    show: (id: Id) => `/api/admin/brands/${id}`,
    update: (id: Id) => `/api/admin/brands/${id}`,
    delete: (id: Id) => `/api/admin/brands/${id}`,
    search: '/api/admin/brands/search',
  },
  attributes: {
    list: '/api/admin/attributes',
    create: '/api/admin/attributes',
    show: (id: Id) => `/api/admin/attributes/${id}`,
    update: (id: Id) => `/api/admin/attributes/${id}`,
    delete: (id: Id) => `/api/admin/attributes/${id}`,
  },
  attributeValues: {
    list: '/api/admin/attribute-values',
    create: '/api/admin/attribute-values',
    show: (id: Id) => `/api/admin/attribute-values/${id}`,
    update: (id: Id) => `/api/admin/attribute-values/${id}`,
    delete: (id: Id) => `/api/admin/attribute-values/${id}`,
  },
  permissions: {
    list: '/api/admin/permissions',
    create: '/api/admin/permissions',
    show: (id: Id) => `/api/admin/permissions/${id}`,
    update: (id: Id) => `/api/admin/permissions/${id}`,
    delete: (id: Id) => `/api/admin/permissions/${id}`,
  },
  roles: {
    list: '/api/admin/roles',
    create: '/api/admin/roles',
    show: (id: Id) => `/api/admin/roles/${id}`,
    update: (id: Id) => `/api/admin/roles/${id}`,
    delete: (id: Id) => `/api/admin/roles/${id}`,
  },
  // Product Attributes (admin)
  productAttributes: {
    list: '/api/admin/product-attributes',
    create: '/api/admin/product-attributes',
    show: (id: Id) => `/api/admin/product-attributes/${id}`,
    update: (id: Id) => `/api/admin/product-attributes/${id}`,
    delete: (id: Id) => `/api/admin/product-attributes/${id}`,
    updateStatus: (id: Id) => `/api/admin/product-attributes/status/${id}`,
  },
  // Product Variants (admin)
  productVariants: {
    list: '/api/admin/product-variants',
    create: '/api/admin/product-variants',
    show: (id: Id) => `/api/admin/product-variants/${id}`,
    update: (id: Id) => `/api/admin/product-variants/${id}`,
    delete: (id: Id) => `/api/admin/product-variants/${id}`,
    getByProduct: (productId: Id) => `/api/admin/product-variants/product/${productId}`,
    updateStatus: (id: Id) => `/api/admin/product-variants/status/${id}`,
  },
  inventory: {
    list: '/api/admin/inventory',
    create: '/api/admin/inventory',
    show: (id: Id) => `/api/admin/inventory/${id}`,
    update: (id: Id) => `/api/admin/inventory/${id}`,
    delete: (id: Id) => `/api/admin/inventory/${id}`,
    import: '/api/admin/inventory/import',
    export: '/api/admin/inventory/export',
    expiringSoon: '/api/admin/inventory/expiring-soon',
    expired: '/api/admin/inventory/expired',
    lowStock: '/api/admin/inventory/low-stock',
    filterOptions: '/api/admin/inventory/filter-options',
  },
  contacts: {
    list: '/api/admin/contacts',
    create: '/api/admin/contacts',
    show: (id: Id) => `/api/admin/contacts/${id}`,
    update: (id: Id) => `/api/admin/contacts/${id}`,
    delete: (id: Id) => `/api/admin/contacts/${id}`,
    updateStatus: (id: Id) => `/api/admin/contacts/${id}/status`,
    markResponded: (id: Id) => `/api/admin/contacts/${id}/mark-responded`,
    bulkUpdateStatus: '/api/admin/contacts/bulk-update-status',
  },
  enums: (type: string) => `/api/enums/${type}`,
  adminEnums: (type: string) => `/api/admin/enums/${type}`,

  // Shipping
  shippingApi: {
    list: '/api/admin/shipping/api',
    create: '/api/admin/shipping/api',
    show: (id: Id) => `/api/admin/shipping/api/${id}`,
    update: (id: Id) => `/api/admin/shipping/api/${id}`,
    delete: (id: Id) => `/api/admin/shipping/api/${id}`,
  },
  shippingServices: {
    list: '/api/admin/shipping/services',
    create: '/api/admin/shipping/services',
    show: (id: Id) => `/api/admin/shipping/services/${id}`,
    update: (id: Id) => `/api/admin/shipping/services/${id}`,
    delete: (id: Id) => `/api/admin/shipping/services/${id}`,
    changeStatus: (id: Id) => `/api/admin/shipping/services/${id}/toggle-status`,
  },
  shippingZones: {
    list: '/api/admin/shipping/zones',
    create: '/api/admin/shipping/zones',
    show: (id: Id) => `/api/admin/shipping/zones/${id}`,
    update: (id: Id) => `/api/admin/shipping/zones/${id}`,
    delete: (id: Id) => `/api/admin/shipping/zones/${id}`,
  },
  shippingPricing: {
    list: '/api/admin/shipping/pricing',
    create: '/api/admin/shipping/pricing',
    show: (id: Id) => `/api/admin/shipping/pricing/${id}`,
    update: (id: Id) => `/api/admin/shipping/pricing/${id}`,
    delete: (id: Id) => `/api/admin/shipping/pricing/${id}`,
  },
  shippingPromotions: {
    list: '/api/admin/shipping/promotions',
    create: '/api/admin/shipping/promotions',
    show: (id: Id) => `/api/admin/shipping/promotions/${id}`,
    update: (id: Id) => `/api/admin/shipping/promotions/${id}`,
    delete: (id: Id) => `/api/admin/shipping/promotions/${id}`,
  },
  shippingDelivery: {
    list: '/api/admin/shipping/delivery',
    create: '/api/admin/shipping/delivery',
    show: (id: Id) => `/api/admin/shipping/delivery/${id}`,
    update: (id: Id) => `/api/admin/shipping/delivery/${id}`,
    delete: (id: Id) => `/api/admin/shipping/delivery/${id}`,
  },
  shippingAdvanced: {
    list: '/api/admin/shipping/advanced',
    create: '/api/admin/shipping/advanced',
    show: (id: Id) => `/api/admin/shipping/advanced/${id}`,
    update: (id: Id) => `/api/admin/shipping/advanced/${id}`,
    delete: (id: Id) => `/api/admin/shipping/advanced/${id}`,
  },

  // Posts stack (admin)
  posts: {
    list: '/api/admin/posts',
    create: '/api/admin/posts',
    show: (id: Id) => `/api/admin/posts/${id}`,
    update: (id: Id) => `/api/admin/posts/${id}`,
    delete: (id: Id) => `/api/admin/posts/${id}`,
  },
  postCategories: {
    list: '/api/admin/post-categories',
    create: '/api/admin/post-categories',
    show: (id: Id) => `/api/admin/post-categories/${id}`,
    update: (id: Id) => `/api/admin/post-categories/${id}`,
    delete: (id: Id) => `/api/admin/post-categories/${id}`,
  },
  // Product Categories (admin)
  productCategories: {
    list: '/api/admin/product-categories',
    create: '/api/admin/product-categories',
    show: (id: Id) => `/api/admin/product-categories/${id}`,
    update: (id: Id) => `/api/admin/product-categories/${id}`,
    delete: (id: Id) => `/api/admin/product-categories/${id}`,
    tree: '/api/admin/product-categories/tree',
    products: (id: Id) => `/api/admin/product-categories/products/${id}`,
  },
  postTags: {
    list: '/api/admin/post-tags',
    create: '/api/admin/post-tags',
    show: (id: Id) => `/api/admin/post-tags/${id}`,
    update: (id: Id) => `/api/admin/post-tags/${id}`,
    delete: (id: Id) => `/api/admin/post-tags/${id}`,
  },
  systemConfigs: {
    list: '/api/admin/system-configs',
    create: '/api/admin/system-configs',
    show: (id: Id) => `/api/admin/system-configs/${id}`,
    update: (id: Id) => `/api/admin/system-configs/${id}`,
    delete: (id: Id) => `/api/admin/system-configs/${id}`,
    getByGroup: (group: string) => `/api/admin/system-configs/group/${group}`,
    bulkUpdate: '/api/admin/system-configs/bulk-update',
  },
} as const;

export type AdminEndpoints = typeof adminEndpoints;










