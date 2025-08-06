# Composables Documentation

## 📁 Cấu trúc thư mục

```
composables/
├── api/                    # API related composables
│   ├── index.js
│   ├── useApiClient.js     # Enhanced API client with retry logic
│   ├── useApiFetch.js      # Simple API fetch wrapper
│   └── useApiOptions.js    # API options management
├── form/                   # Form management composables
│   ├── index.js
│   ├── useFormManager.js   # Complete form state management
│   ├── useFormErrors.js    # Form error handling
│   └── useFormData.js      # Form data utilities
├── ui/                     # UI/UX composables
│   ├── index.js
│   ├── useModal.js         # Modal management
│   ├── usePagination.js    # Pagination utilities
│   ├── useTableSelection.js # Table selection management
│   └── useToast.js         # Toast notifications
├── data/                   # Data management composables
│   ├── index.js
│   ├── useCrudAdmin.js     # CRUD operations for admin
│   ├── useDataTable.js     # Data table with caching
│   ├── useFastEnums.js     # Enum management with caching
│   └── useSearch.js        # Search with debouncing
├── utils/                  # Utility composables
│   ├── index.js
│   ├── useAuthInit.js      # Authentication initialization
│   └── useSyncQueryPagination.js # URL sync pagination
├── index.js               # Main export file
└── README.md              # This documentation
```

## 🚀 Cách sử dụng

### Import từ thư mục cụ thể:
```javascript
// Import từ API composables
import { useApiClient } from '~/composables/api'

// Import từ Form composables
import { useFormManager, useFormErrors } from '~/composables/form'

// Import từ UI composables
import { useModal, useToast } from '~/composables/ui'

// Import từ Data composables
import { useCrudAdmin, useDataTable } from '~/composables/data'

// Import từ Utils composables
import { useAuthInit } from '~/composables/utils'
```

### Import tất cả từ index chính:
```javascript
import { 
  useApiClient, 
  useFormManager, 
  useModal, 
  useCrudAdmin 
} from '~/composables'
```

## 📋 Danh sách Composables theo nhóm

### 🔌 **API Composables** (`composables/api/`)

#### 1. `useApiClient(options)`
**Mục đích**: Quản lý API client với retry logic và error handling nâng cao

**Tính năng**:
- Retry tự động cho lỗi network
- Exponential backoff
- Performance monitoring
- User-friendly error messages
- Authentication handling

**Sử dụng**:
```javascript
const api = useApiClient({
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000
})

// Sử dụng với error handling tốt hơn
try {
  const response = await api.get('/users')
  console.log(response.data)
} catch (error) {
  console.log(error.userMessage) // Message thân thiện với user
}
```

#### 2. `useApiFetch()`
**Mục đích**: Wrapper đơn giản cho fetch API

#### 3. `useApiOptions()`
**Mục đích**: Quản lý options cho API calls

### 📝 **Form Composables** (`composables/form/`)

#### 1. `useFormManager(initialData, options)`
**Mục đích**: Quản lý form với validation và state management

**Tính năng**:
- Reactive form data
- Validation integration
- Error handling
- Dirty state tracking
- Auto-validation

**Sử dụng**:
```javascript
const form = useFormManager(
  { name: '', email: '' },
  {
    validator: (data) => {
      const errors = {}
      if (!data.name) errors.name = 'Tên là bắt buộc'
      if (!data.email) errors.email = 'Email là bắt buộc'
      return errors
    },
    onSubmit: async (data) => {
      return await api.post('/api/users', data)
    },
    onSuccess: (result) => {
      console.log('User created:', result)
    }
  }
)

// Sử dụng
const { formData, errors, loading, submit, setField } = form
```

#### 2. `useFormErrors()`
**Mục đích**: Quản lý lỗi form một cách độc lập

#### 3. `useFormData()`
**Mục đích**: Utilities cho form data handling

### 🎨 **UI Composables** (`composables/ui/`)

#### 1. `useModal(options)`
**Mục đích**: Quản lý modal với UX tốt hơn

**Tính năng**:
- Keyboard shortcuts (Escape)
- Overlay click handling
- Loading state
- Data passing
- Before/after callbacks

**Sử dụng**:
```javascript
const modal = useModal({
  closeOnEscape: true,
  closeOnOverlay: true,
  onOpen: (data) => console.log('Modal opened with:', data),
  onClose: () => console.log('Modal closed')
})

// Sử dụng
const { isOpen, isLoading, data, open, close, handleOverlayClick } = modal
```

#### 2. `usePagination(init)`
**Mục đích**: Quản lý pagination đơn giản

#### 3. `useTableSelection(items, options)`
**Mục đích**: Quản lý selection trong table

#### 4. `useToast()`
**Mục đích**: Quản lý toast notifications

### 📊 **Data Composables** (`composables/data/`)

#### 1. `useCrudAdmin(options)`
**Mục đích**: Quản lý CRUD operations cho admin panel

**Tính năng**:
- State management tập trung
- Computed properties cho UI
- Debounced search
- Modal management
- Error handling
- Pagination

**Sử dụng**:
```javascript
const crud = useCrudAdmin({
  endpoints: {
    list: '/api/users',
    create: '/api/users',
    update: (id) => `/api/users/${id}`,
    delete: (id) => `/api/users/${id}`
  },
  resourceName: 'người dùng',
  defaultFilters: { status: 'active' },
  debounceTime: 300
})

// Sử dụng trong component
const { items, loading, pagination, createItem, updateItem } = crud
```

#### 2. `useDataTable(endpoint, options)`
**Mục đích**: Quản lý data table với caching và performance optimization

#### 3. `useFastEnums()`
**Mục đích**: Quản lý enums với hybrid approach (static + dynamic)

#### 4. `useSearch(options)`
**Mục đích**: Quản lý search với debouncing và caching

### 🛠️ **Utils Composables** (`composables/utils/`)

#### 1. `useAuthInit()`
**Mục đích**: Khởi tạo authentication

#### 2. `useSyncQueryPagination()`
**Mục đích**: Đồng bộ pagination với URL query

## 🔄 Migration Guide

### Từ cấu trúc cũ sang mới:

**Trước:**
```javascript
import { useApiClient } from '~/composables/useApiClient'
import { useCrudAdmin } from '~/composables/useCrudAdmin'
```

**Sau:**
```javascript
// Cách 1: Import từ thư mục cụ thể
import { useApiClient } from '~/composables/api'
import { useCrudAdmin } from '~/composables/data'

// Cách 2: Import từ index chính
import { useApiClient, useCrudAdmin } from '~/composables'
```

## 📈 Performance Tips

1. **Lazy Loading**: Import chỉ những composables cần thiết
2. **Tree Shaking**: Sử dụng named imports để tối ưu bundle size
3. **Caching**: Sử dụng composables có caching như `useFastEnums`, `useDataTable`
4. **Debouncing**: Sử dụng `useSearch` và `useCrudAdmin` với debouncing

## 🧪 Testing Strategy

### Test theo nhóm:
- **API Tests**: Test `useApiClient`, `useApiFetch`
- **Form Tests**: Test `useFormManager`, `useFormErrors`
- **UI Tests**: Test `useModal`, `useToast`
- **Data Tests**: Test `useCrudAdmin`, `useDataTable`
- **Utils Tests**: Test `useAuthInit`, `useSyncQueryPagination`

## 🎯 Best Practices

### 1. **Import Strategy**
```javascript
// ✅ Tốt - Import từ thư mục cụ thể
import { useApiClient } from '~/composables/api'

// ✅ Tốt - Import nhiều từ cùng nhóm
import { useModal, useToast, usePagination } from '~/composables/ui'

// ❌ Tránh - Import tất cả
import * as Composables from '~/composables'
```

### 2. **Naming Convention**
- Tất cả composables bắt đầu với `use`
- Tên file trùng với tên function
- Sử dụng camelCase cho tên function

### 3. **Documentation**
- Mỗi composable có JSDoc đầy đủ
- Examples trong README
- Type definitions (nếu dùng TypeScript)

### 4. **Error Handling**
- Luôn có error handling trong composables
- User-friendly error messages
- Proper logging cho debugging 