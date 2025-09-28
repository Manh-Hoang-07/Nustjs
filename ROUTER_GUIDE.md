# Hướng dẫn Custom Router

## ✅ Đã hoàn thành cấu hình

Dự án đã được cấu hình để sử dụng custom router thay vì file-based routing tự động. Tất cả routes được định nghĩa trong file `router.options.ts`.

## 🎯 Các routes đã được định nghĩa

### Public Routes
- `/` - Trang chủ
- `/about` - Giới thiệu  
- `/contact` - Liên hệ
- `/posts` - Danh sách bài viết
- `/posts/:slug` - Chi tiết bài viết
- `/categories` - Danh mục bài viết
- `/categories/:slug` - Chi tiết danh mục
- `/tags` - Thẻ bài viết
- `/tags/:slug` - Chi tiết thẻ
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Admin Routes (Yêu cầu xác thực)
- `/admin` - Trang admin chính
- `/admin/dashboard` - Bảng điều khiển
- `/admin/users` - Quản lý người dùng
- `/admin/roles` - Quản lý vai trò
- `/admin/permissions` - Quản lý quyền
- `/admin/posts` - Quản lý bài viết
- `/admin/post-categories` - Quản lý danh mục
- `/admin/post-tags` - Quản lý thẻ
- `/admin/contacts` - Quản lý liên hệ

## 🚀 Cách sử dụng

### 1. Navigation với NuxtLink
```vue
<template>
  <NuxtLink to="/admin/users">Quản lý người dùng</NuxtLink>
  <NuxtLink :to="{ name: 'admin-users-edit', params: { id: userId } }">
    Chỉnh sửa người dùng
  </NuxtLink>
</template>
```

### 2. Programmatic navigation
```typescript
// Trong component
const router = useRouter()

// Điều hướng đến trang khác
await navigateTo('/admin/dashboard')
await navigateTo({ name: 'admin-users' })

// Điều hướng với tham số
await navigateTo({ name: 'admin-users-edit', params: { id: '123' } })
```

### 3. Lấy thông tin route hiện tại
```typescript
// Trong component
const route = useRoute()

// Lấy tham số
const userId = route.params.id

// Lấy query
const page = route.query.page

// Lấy meta data
const requiresAuth = route.meta.requiresAuth
```

## ➕ Cách thêm Route mới

Chỉnh sửa file `router.options.ts`:

```typescript
{
  name: 'admin-settings',
  path: '/admin/settings',
  component: () => import('~/pages/admin/settings.vue'),
  meta: { 
    requiresAuth: true, 
    layout: 'admin-layout',
    title: 'Cài đặt hệ thống'
  }
}
```

## 🔧 Cấu hình

- **File chính**: `router.options.ts` - Định nghĩa tất cả routes
- **Cấu hình**: `nuxt.config.ts` - Cấu hình router options
- **Layout**: Mỗi route có thể có layout riêng thông qua meta

Bây giờ bạn có thể kiểm soát hoàn toàn routing của ứng dụng!
