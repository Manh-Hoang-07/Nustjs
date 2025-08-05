# 🏗️ Component Structure Documentation

## 📁 Cấu trúc thư mục Components mới

```
components/
├── Admin/                    # Components dành riêng cho Admin
│   ├── Table/
│   │   └── AdminTable.vue
│   ├── Filter/
│   │   └── AdminFilterItem.vue
│   ├── Actions/
│   └── Index.vue            # Barrel export
├── Core/                     # Core components có thể tái sử dụng
│   ├── Form/                 # Form components
│   │   ├── FormWrapper.vue
│   │   ├── FormField.vue
│   │   ├── Inputs/           # Input components
│   │   │   ├── TextInput.vue
│   │   │   ├── SelectInput.vue
│   │   │   ├── CheckboxInput.vue
│   │   │   ├── RadioInput.vue
│   │   │   ├── TextareaInput.vue
│   │   │   ├── NumberInput.vue
│   │   │   ├── EmailInput.vue
│   │   │   ├── PasswordInput.vue
│   │   │   ├── DateInput.vue
│   │   │   ├── FileInput.vue
│   │   │   └── Index.vue     # Barrel export
│   │   └── Index.vue         # Barrel export
│   ├── Select/               # Select components
│   │   ├── EnumSelect.vue
│   │   ├── MultipleSelect.vue
│   │   ├── SearchableSelect.vue
│   │   ├── SearchableMultiSelect.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Image/                # Image components
│   │   ├── OptimizedImage.vue
│   │   ├── ImageUploader.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Content/              # Content components
│   │   ├── HtmlContent.vue
│   │   ├── CKEditorUltimate.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Table/                # Table components
│   │   ├── DataTable.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Modal/                # Modal components
│   │   ├── Modal.vue
│   │   ├── ConfirmModal.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Loading/              # Loading components
│   │   ├── LoadingSpinner.vue
│   │   ├── SkeletonLoader.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Navigation/           # Navigation components
│   │   ├── Pagination.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Feedback/             # Feedback components
│   │   ├── ToastContainer.vue
│   │   ├── Components/       # Sub-components
│   │   └── Index.vue         # Barrel export
│   ├── Actions/              # Action components
│   │   ├── Actions.vue
│   │   └── Index.vue         # Barrel export
│   └── Index.vue             # Main barrel export
├── Layout/                   # Layout components
│   ├── Header/
│   │   └── HeaderBar.vue
│   ├── Sidebar/
│   │   ├── SidebarMenu.vue
│   │   └── Components/       # Sub-components
│   ├── Sections/
│   │   └── CustomSection.vue
│   └── Index.vue             # Barrel export
├── User/                     # User-specific components
│   ├── Cards/
│   │   └── UserCard.vue
│   ├── Profile/
│   └── Index.vue             # Barrel export
└── Common/                   # Common utility components
    ├── Icons/
    │   ├── Icon.vue
    │   └── IconSet.vue
    ├── Buttons/
    │   ├── Button.vue
    │   ├── ButtonGroup.vue
    │   └── Variants/
    │       ├── PrimaryButton.vue
    │       ├── SecondaryButton.vue
    │       └── IconButton.vue
    └── Utils/
        ├── Tooltip.vue
        ├── Badge.vue
        └── Divider.vue
```

## 🎯 Lợi ích của cấu trúc mới

### 1. **📦 Logical Grouping**
- Components được nhóm theo chức năng và mục đích sử dụng
- Dễ dàng tìm kiếm và quản lý

### 2. **🔄 Reusability**
- Core components có thể tái sử dụng trong toàn bộ ứng dụng
- Barrel exports giúp import dễ dàng hơn

### 3. **📚 Scalability**
- Dễ dàng thêm components mới vào đúng nhóm
- Cấu trúc có thể mở rộng khi project phát triển

### 4. **🛠️ Maintainability**
- Mỗi component có trách nhiệm rõ ràng
- Dễ dàng refactor và debug

## 📝 Cách sử dụng

### Import từng component:
```javascript
import { FormWrapper, FormField } from '@/components/Core/Form'
import { Modal, ConfirmModal } from '@/components/Core/Modal'
import { AdminTable } from '@/components/Admin'
import { HeaderBar, SidebarMenu } from '@/components/Layout'
```

### Import tất cả Core components:
```javascript
import * as Core from '@/components/Core'
// Sử dụng: Core.FormWrapper, Core.Modal, etc.
```

### Import từng nhóm:
```javascript
import * as Form from '@/components/Core/Form'
import * as Select from '@/components/Core/Select'
import * as Image from '@/components/Core/Image'
```

## 🚀 Các bước tiếp theo

### Phase 1: Tạo Input Components
- Tạo các input components riêng biệt trong `Core/Form/Inputs/`
- Refactor `FormField.vue` để sử dụng các input components này

### Phase 2: Tạo Sub-components
- Tạo các sub-components trong thư mục `Components/` của mỗi nhóm
- Ví dụ: `Select/Components/SelectDisplay.vue`, `Modal/Components/ModalHeader.vue`

### Phase 3: Tạo Common Components
- Tạo các utility components trong `Common/`
- Ví dụ: `Button.vue`, `Icon.vue`, `Tooltip.vue`

## 📋 Migration Checklist

- [x] Tạo cấu trúc thư mục mới
- [x] Di chuyển components vào đúng vị trí
- [x] Tạo barrel exports cho tất cả nhóm
- [x] Cập nhật tất cả imports trong project
- [x] Cập nhật imports trong layouts
- [ ] Tạo các input components riêng biệt
- [ ] Refactor FormField để sử dụng input components
- [ ] Tạo sub-components cho các nhóm lớn
- [ ] Tạo Common components
- [ ] Cập nhật documentation

## 🔧 Troubleshooting

### Nếu gặp lỗi import:
1. Kiểm tra đường dẫn import có đúng không
2. Đảm bảo file barrel export (Index.vue) tồn tại
3. Restart development server

### Nếu component không hiển thị:
1. Kiểm tra tên component trong template
2. Đảm bảo component được import đúng cách
3. Kiểm tra console để xem lỗi

## 📞 Support

Nếu có vấn đề với cấu trúc components, hãy:
1. Kiểm tra file này trước
2. Xem lại migration checklist
3. Liên hệ team để được hỗ trợ 