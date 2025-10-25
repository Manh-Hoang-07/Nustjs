type Id = string | number;

export const publicEndpoints = {
  posts: {
    list: '/api/posts',
    create: '/api/posts',
    show: (id: Id) => `/api/posts/${id}`,
    update: (id: Id) => `/api/posts/${id}`,
    delete: (id: Id) => `/api/posts/${id}`,
  },
  postCategories: {
    list: '/api/post-categories',
    create: '/api/post-categories',
    show: (id: Id) => `/api/post-categories/${id}`,
    update: (id: Id) => `/api/post-categories/${id}`,
    delete: (id: Id) => `/api/post-categories/${id}`,
  },
  // Product Categories (public)
  productCategories: {
    list: '/api/product-categories',
    show: (id: Id) => `/api/product-categories/${id}`,
    showBySlug: (slug: string) => `/api/product-categories/slug/${slug}`,
    tree: '/api/product-categories/tree',
    products: (id: Id) => `/api/product-categories/products/${id}`,
    productsBySlug: (slug: string) => `/api/product-categories/${slug}/products`,
  },
  // Products (public)
  products: {
    list: '/api/products',
    show: (id: Id) => `/api/products/${id}`,
    featured: '/api/products/featured',
    search: '/api/products/search',
    byCategory: (categoryId: Id) => `/api/products/by-category/${categoryId}`,
    variants: (productId: Id) => `/api/products/${productId}/variants`,
  },
  postTags: {
    list: '/api/post-tags',
    create: '/api/post-tags',
    show: (id: Id) => `/api/post-tags/${id}`,
    update: (id: Id) => `/api/post-tags/${id}`,
    delete: (id: Id) => `/api/post-tags/${id}`,
  },
  contacts: {
    list: '/api/contacts',
    create: '/api/contacts',
    show: (id: Id) => `/api/contacts/${id}`,
    update: (id: Id) => `/api/contacts/${id}`,
    delete: (id: Id) => `/api/contacts/${id}`,
  },
  systemConfigs: {
    getByGroup: (group: string) => `/api/system-configs/group/${group}`,
  },
} as const;

export type PublicEndpoints = typeof publicEndpoints;










