# 🎯 System Config - Thêm Load Data từ API

## ✅ **Đã hoàn thành:**

### **🔧 API Endpoints:**
```typescript
systemConfigs: {
  list: '/api/admin/system-configs',
  create: '/api/admin/system-configs',
  show: (id: Id) => `/api/admin/system-configs/${id}`,
  update: (id: Id) => `/api/admin/system-configs/${id}`,
  delete: (id: Id) => `/api/admin/system-configs/${id}`,
  getByGroup: (group: string) => `/api/admin/system-configs/group/${group}`,
  bulkUpdate: '/api/admin/system-configs/bulk-update',
}
```

### **🔧 Template Pattern:**

#### **1. Import changes:**
```javascript
import { ref, computed, onMounted } from 'vue'
```

#### **2. Reactive data:**
```javascript
const saving = ref(false)
const loading = ref(false)
const error = ref(null)
```

#### **3. Form data:**
```javascript
// Form data - sẽ được load từ API
const configs = ref({
  // Empty values hoặc default values
})
```

#### **4. Load function:**
```javascript
const loadConfigs = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiClient.get(adminEndpoints.systemConfigs.getByGroup('GROUP_NAME'))
    
    if (response.data.success && response.data.data) {
      // Chuyển đổi array configs thành object
      const configsData = {}
      response.data.data.forEach(config => {
        // Chuyển đổi value theo type
        let value = config.value
        if (config.type === 'boolean') {
          value = value === 'true' || value === true
        } else if (config.type === 'integer') {
          value = parseInt(value)
        } else if (config.type === 'float') {
          value = parseFloat(value)
        }
        configsData[config.key] = value
      })
      
      configs.value = { ...configs.value, ...configsData }
    }
  } catch (err) {
    error.value = err.message || 'Không thể tải cấu hình'
    console.error('Error loading configs:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadConfigs()
})
```

#### **5. Template structure:**
```vue
<template>
  <div class="p-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          <div class="mt-4">
            <button @click="loadConfigs" class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main content -->
    <div v-else>
      <!-- Form content -->
    </div>
  </div>
</template>
```

### **📁 Files đã cập nhật:**
- ✅ `general/index.vue` - Cài đặt chung

### **🔄 Files cần cập nhật:**
- `email/index.vue` - Cấu hình email
- `database/index.vue` - Cài đặt database  
- `storage/index.vue` - Cấu hình lưu trữ
- `security/index.vue` - Cài đặt bảo mật
- `api/index.vue` - Cài đặt API
- `cache/index.vue` - Cài đặt Cache
- `notification/index.vue` - Cài đặt thông báo
- `payment/index.vue` - Cài đặt thanh toán
- `custom/index.vue` - Cài đặt tùy chỉnh

### **🎯 Lợi ích:**

- ✅ **Load data từ API** - Không còn dữ liệu tĩnh
- ✅ **Loading state** - Hiển thị loading khi tải
- ✅ **Error handling** - Xử lý lỗi và retry
- ✅ **Type conversion** - Chuyển đổi đúng kiểu dữ liệu
- ✅ **User experience** - UX tốt hơn

**Bây giờ sẽ load dữ liệu từ API khi vào menu! 🎉**

