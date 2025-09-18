# Hướng dẫn sử dụng Auth System

## Tổng quan

Hệ thống auth đã được chuẩn hóa về một nơi duy nhất: `stores/auth.js`. Tất cả các tính năng authentication và authorization đều được quản lý thông qua Pinia store này.

## Cách sử dụng

### 1. Sử dụng trong Components

```javascript
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    
    // Sử dụng state
    const isAuthenticated = authStore.isAuthenticated
    const user = authStore.user
    const isAdmin = authStore.isAdmin
    
    // Sử dụng permission methods
    const canManageUsers = authStore.can('manage_users')
    const canManageAny = authStore.canAny(['manage_users', 'manage_products'])
    const canManageAll = authStore.canAll(['manage_users', 'manage_products'])
    
    // Sử dụng actions
    const login = authStore.login
    const logout = authStore.logout
    
    return {
      isAuthenticated,
      user,
      isAdmin,
      canManageUsers,
      login,
      logout
    }
  }
}
```

### 2. Sử dụng Static Methods (Laravel-style)

```javascript
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    const { Auth } = authStore
    
    // Sử dụng static methods
    if (Auth.isAuthenticated) {
      console.log('User:', Auth.user)
    }
    
    if (Auth.can('manage_settings')) {
      // User có quyền manage settings
    }
    
    return {
      Auth
    }
  }
}
```

### 3. Sử dụng trong Composables

```javascript
import { useAuthStore } from '@/stores/auth'

export function useUserPermissions() {
  const authStore = useAuthStore()
  
  const checkPermission = (permission) => {
    return authStore.can(permission)
  }
  
  const checkAnyPermission = (permissions) => {
    return authStore.canAny(permissions)
  }
  
  return {
    checkPermission,
    checkAnyPermission,
    user: authStore.user,
    permissions: authStore.userPermissions
  }
}
```

## API Reference

### State Properties

- `isAuthenticated` - Boolean: User đã đăng nhập chưa
- `user` - Object: Thông tin user hiện tại
- `userRole` - String: Role của user (admin, user, etc.)
- `userPermissions` - Array: Danh sách permissions của user
- `isAdmin` - Boolean: User có phải admin không
- `isUser` - Boolean: User có phải user thường không
- `isFetchingUser` - Boolean: Đang fetch thông tin user
- `isInitialized` - Boolean: Auth đã được khởi tạo chưa

### Permission Methods

- `can(permission)` - Kiểm tra user có permission cụ thể không
- `canAny(permissions)` - Kiểm tra user có bất kỳ permission nào trong danh sách
- `canAll(permissions)` - Kiểm tra user có tất cả permissions trong danh sách

### Auth Methods

- `login(credentials)` - Đăng nhập
- `register(userData)` - Đăng ký
- `logout()` - Đăng xuất
- `checkAuth()` - Kiểm tra auth status
- `refreshUserInfo()` - Refresh thông tin user
- `updateProfile(profileData)` - Cập nhật profile
- `changePassword(passwordData)` - Đổi mật khẩu
- `initFromStorage()` - Khởi tạo từ localStorage
- `clearAuthState()` - Xóa toàn bộ auth state

### Utility Methods

- `getTokenFromCookie()` - Lấy token từ cookie
- `setTokenToCookie(token, days)` - Lưu token vào cookie
- `removeTokenFromCookie()` - Xóa token khỏi cookie

## Migration từ utils/auth.js

Nếu bạn đang sử dụng `utils/auth.js`, hãy thay thế:

```javascript
// Cũ
import { Auth } from '@/utils/auth'

// Mới
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const { Auth } = authStore
```

## Lưu ý quan trọng

1. **Security**: Token được lưu trong cookie với `SameSite=Strict`
2. **Caching**: User info được cache trong localStorage với TTL
3. **Fallback**: Nếu API fail, sẽ fallback về localStorage data
4. **Auto-cleanup**: Auth state sẽ tự động clear khi token hết hạn

## Ví dụ thực tế

### Kiểm tra quyền trong template

```vue
<template>
  <div>
    <button v-if="canManageUsers" @click="manageUsers">
      Quản lý Users
    </button>
    
    <button v-if="canManageProducts" @click="manageProducts">
      Quản lý Products
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const canManageUsers = computed(() => authStore.can('manage_users'))
const canManageProducts = computed(() => authStore.can('manage_products'))
</script>
```

### Middleware protection

```javascript
// middleware/admin.js
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  if (!authStore.isAdmin) {
    return navigateTo('/unauthorized')
  }
})
```

