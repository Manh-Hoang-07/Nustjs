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
} as const;

export type PublicEndpoints = typeof publicEndpoints;










