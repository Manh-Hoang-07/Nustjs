# System Config Composable

Composable để lấy cấu hình hệ thống với cache 10 phút, có thể sử dụng ở mọi trang.

## Tính năng

- ✅ Cache tự động với TTL 10 phút
- ✅ Chia sẻ cache giữa các component
- ✅ Tự động refresh khi cache hết hạn
- ✅ Force refresh khi cần thiết
- ✅ Computed properties cho các thông tin phổ biến
- ✅ Error handling
- ✅ TypeScript support

## Cách sử dụng

### 1. Sử dụng Global System Config (Khuyến nghị)

```vue
<template>
  <div>
    <h1>{{ systemInfo.name }}</h1>
    <p>Version: {{ systemInfo.version }}</p>
    <p>Timezone: {{ systemInfo.timezone }}</p>
    
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">Lỗi: {{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalSystemConfig } from '~/composables/system-config'

const {
  data,
  loading,
  error,
  isCacheValid,
  systemInfo,
  refresh,
  clearCache,
  getConfigValue
} = useGlobalSystemConfig()

// Tự động load data
onMounted(async () => {
  await refresh()
})
</script>
```

### 2. Sử dụng với nhóm config khác

```vue
<script setup lang="ts">
import { useSystemConfig } from '~/composables/system'

// Lấy config cho nhóm 'email'
const {
  data: emailConfig,
  loading,
  error,
  refresh
} = useSystemConfig('email')

// Lấy config cho nhóm 'security' với force refresh
const {
  data: securityConfig,
  refresh: refreshSecurity
} = useSystemConfig('security', { forceRefresh: true })
</script>
```

### 3. Sử dụng trong middleware

```typescript
// middleware/check-maintenance.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const { isMaintenanceMode } = useGlobalSystemConfig()
  
  if (isMaintenanceMode.value && to.path !== '/maintenance') {
    return navigateTo('/maintenance')
  }
})
```

### 4. Sử dụng trong layout

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <Head>
      <Title>{{ siteInfo.name }}</Title>
      <Meta name="description" :content="siteInfo.description" />
      <Meta name="keywords" :content="siteInfo.keywords" />
    </Head>
    
    <header>
      <img v-if="siteInfo.logo" :src="siteInfo.logo" :alt="siteInfo.name" />
    </header>
    
    <main>
      <slot />
    </main>
    
    <footer>
      <p>{{ contactInfo.email }}</p>
      <p>{{ contactInfo.phone }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useGlobalSystemConfig } from '~/composables/system-config'

const { siteInfo, contactInfo } = useGlobalSystemConfig()
</script>
```

## API Reference

### useGlobalSystemConfig()

Composable chính để lấy cấu hình general.

**Returns:**
- `data`: Ref chứa dữ liệu cấu hình
- `loading`: Ref boolean cho trạng thái loading
- `error`: Ref chứa lỗi nếu có
- `isCacheValid`: Computed boolean kiểm tra cache hợp lệ
- `systemInfo`: Computed object chứa thông tin hệ thống (name, version, timezone)
- `refresh()`: Function để làm mới dữ liệu
- `clearCache()`: Function để xóa cache
- `getConfigValue(key, defaultValue)`: Function để lấy giá trị config cụ thể

### useSystemConfig(group, options)

Composable để lấy cấu hình cho nhóm cụ thể.

**Parameters:**
- `group`: string - Nhóm cấu hình (mặc định: 'general')
- `options`: object
  - `forceRefresh`: boolean - Force refresh ngay cả khi có cache
  - `enableCache`: boolean - Bật/tắt cache (mặc định: true)

## Cấu trúc dữ liệu

### SystemConfigGeneral

```typescript
interface SystemConfigGeneral {
  // System info
  name?: string
  version?: string
  timezone?: string
  
  // Site info
  site_name?: string
  site_description?: string
  site_keywords?: string
  site_logo?: string
  site_favicon?: string
  
  // Contact info
  contact_email?: string
  contact_phone?: string
  contact_address?: string
  
  // Social links
  social_facebook?: string
  social_twitter?: string
  social_instagram?: string
  social_youtube?: string
  
  // System settings
  maintenance_mode?: boolean
  maintenance_message?: string
  
  // Dynamic keys
  [key: string]: any
}
```

### API Response Format

API trả về dữ liệu dưới dạng:

```json
{
  "success": true,
  "message": "Lấy cấu hình nhóm public thành công",
  "data": {
    "name": "Laravel System",
    "version": "1.0.0",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  "links": [],
  "meta": []
}
```

## Cache Strategy

- Cache được lưu trong memory với TTL 10 phút
- Cache được chia sẻ giữa tất cả component
- Tự động refresh khi cache hết hạn
- Có thể force refresh khi cần thiết
- Có thể clear cache thủ công

## Demo

Truy cập `/demo/system-config` để xem demo đầy đủ các tính năng.

## Cấu trúc thư mục

```
composables/
├── system-config/
│   ├── types.ts              # System config types
│   ├── useSystemConfig.ts     # Main composable
│   └── index.ts              # Export file
└── index.ts                  # Main composables export
```

## Lưu ý

- API endpoint: `GET /api/system-configs/group/general`
- Cache TTL: 10 phút (600,000ms)
- Sử dụng `useGlobalApiClient()` để tránh duplicate calls
- Tự động transform data từ array thành object
- Error handling tích hợp sẵn
- Import từ `~/composables/system-config`
