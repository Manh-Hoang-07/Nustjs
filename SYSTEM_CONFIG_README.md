# Menu Cấu Hình Hệ Thống

## Tổng Quan

Menu cấu hình hệ thống đã được xây dựng hoàn chỉnh với các tính năng quản lý cấu hình theo nhóm, tương thích với API backend đã cung cấp.

## Cấu Trúc Menu

### 1. Menu Admin Navigation
- **Cấu hình hệ thống** (icon: ⚙️)
  - **Cài đặt chung** (`/admin/system-configs/general`) - icon: 🌐
  - **Cài đặt email** (`/admin/system-configs/email`) - icon: 📧  
  - **Cài đặt bảo mật** (`/admin/system-configs/security`) - icon: 🔒
  - **Tất cả cấu hình** (`/admin/system-configs`) - icon: 📋

### 2. Trang Dashboard Cài Đặt
- **Trang chính**: `/admin/settings`
- Hiển thị tổng quan và quick actions
- Trạng thái hệ thống
- Quản lý chế độ bảo trì và cache

## Các Trang Cấu Hình

### 1. Cài Đặt Chung (`/admin/system-configs/general`)
**Các cấu hình được quản lý:**
- `site_name` - Tên website (bắt buộc)
- `site_description` - Mô tả website
- `site_logo` - Logo website
- `site_favicon` - Favicon
- `site_address` - Địa chỉ liên hệ
- `site_phone` - Số điện thoại
- `site_email` - Email liên hệ
- `timezone` - Múi giờ (bắt buộc)
- `currency` - Đơn vị tiền tệ (bắt buộc)
- `maintenance_mode` - Chế độ bảo trì

### 2. Cài Đặt Email (`/admin/system-configs/email`)
**Các cấu hình được quản lý:**
- `mail_mailer` - Mail Driver (bắt buộc)
- `mail_scheme` - Mail Scheme
- `mail_host` - Mail Host (bắt buộc)
- `mail_port` - Mail Port (bắt buộc)
- `mail_username` - Mail Username
- `mail_password` - Mail Password
- `mail_from_address` - Email gửi đi (bắt buộc)
- `mail_from_name` - Tên người gửi (bắt buộc)

**Tính năng đặc biệt:**
- Test email để kiểm tra cấu hình SMTP
- Hiển thị/ẩn mật khẩu

### 3. Cài Đặt Bảo Mật (`/admin/system-configs/security`)
**Các cấu hình được quản lý:**
- `session_lifetime` - Thời gian session (phút) (bắt buộc)
- `max_login_attempts` - Số lần đăng nhập sai tối đa (bắt buộc)
- `lockout_duration` - Thời gian khóa tài khoản (phút) (bắt buộc)
- `password_min_length` - Độ dài mật khẩu tối thiểu (bắt buộc)
- `require_uppercase` - Yêu cầu chữ hoa
- `require_numbers` - Yêu cầu số
- `require_special_chars` - Yêu cầu ký tự đặc biệt
- `two_factor_enabled` - Bật xác thực 2 yếu tố
- `rate_limit_requests` - Giới hạn request (phút) (bắt buộc)

### 4. Quản Lý Tất Cả Cấu Hình (`/admin/system-configs`)
**Tính năng:**
- Danh sách tất cả cấu hình với bảng
- Tìm kiếm cấu hình
- Lọc theo nhóm
- Thêm/sửa/xóa cấu hình
- Cập nhật/xóa hàng loạt
- Xóa cache
- Phân trang

## API Composable

### `useSystemConfig()`
Composable cung cấp các phương thức:

**State:**
- `configs` - Danh sách cấu hình
- `loading` - Trạng thái loading
- `error` - Lỗi nếu có

**Computed:**
- `configsByGroup` - Cấu hình được nhóm theo group
- `publicConfigs` - Cấu hình công khai
- `requiredConfigs` - Cấu hình bắt buộc

**Methods:**
- `fetchConfigs()` - Lấy danh sách cấu hình
- `fetchConfigsByGroup(group)` - Lấy cấu hình theo nhóm
- `fetchConfigForm(group)` - Lấy form cấu hình nhóm
- `fetchGroups()` - Lấy danh sách nhóm
- `createConfig(data)` - Tạo cấu hình mới
- `updateConfig(id, data)` - Cập nhật cấu hình
- `updateConfigsByGroup(group, configs)` - Cập nhật cấu hình theo nhóm
- `deleteConfig(id)` - Xóa cấu hình
- `bulkUpdate(configs)` - Cập nhật hàng loạt
- `bulkDelete(ids)` - Xóa hàng loạt
- `clearCache()` - Xóa cache
- `searchConfigs(query)` - Tìm kiếm cấu hình

## API Endpoints Sử Dụng

```
GET    /api/admin/system-configs                    // Danh sách cấu hình
POST   /api/admin/system-configs                    // Tạo cấu hình mới
GET    /api/admin/system-configs/{id}               // Chi tiết cấu hình
PUT    /api/admin/system-configs/{id}               // Cập nhật cấu hình
DELETE /api/admin/system-configs/{id}               // Xóa cấu hình

GET    /api/admin/system-configs/group/{group}      // Lấy cấu hình theo nhóm
PUT    /api/admin/system-configs/group/{group}      // Cập nhật cấu hình theo nhóm
GET    /api/admin/system-configs/group/{group}/form // Lấy form cấu hình nhóm

POST   /api/admin/system-configs/bulk-update        // Cập nhật hàng loạt
POST   /api/admin/system-configs/bulk-delete        // Xóa hàng loạt
POST   /api/admin/system-configs/clear-cache        // Xóa cache

GET    /api/admin/system-configs/groups/list        // Danh sách nhóm
GET    /api/admin/system-configs/search             // Tìm kiếm
```

## Cách Sử Dụng

### 1. Truy Cập Menu
- Đăng nhập với tài khoản admin
- Vào menu "Cấu hình hệ thống" trong sidebar
- Chọn nhóm cấu hình cần quản lý

### 2. Cấu Hình Theo Nhóm
- Mỗi nhóm có giao diện riêng phù hợp với loại cấu hình
- Form validation cho các trường bắt buộc
- Lưu tự động khi submit form

### 3. Quản Lý Chi Tiết
- Sử dụng trang "Tất cả cấu hình" để quản lý toàn bộ
- Tìm kiếm và lọc theo nhóm
- Thao tác hàng loạt với nhiều cấu hình

### 4. Dashboard Tổng Quan
- Trang `/admin/settings` hiển thị tổng quan
- Quick actions để truy cập nhanh
- Quản lý chế độ bảo trì và cache

## Tính Năng Đặc Biệt

### 1. Responsive Design
- Giao diện tối ưu cho desktop và mobile
- Layout linh hoạt theo kích thước màn hình

### 2. User Experience
- Loading states và error handling
- Confirmation dialogs cho các thao tác quan trọng
- Toast notifications cho feedback

### 3. Security
- Validation phía client
- Xác thực admin bắt buộc
- Bảo vệ các thao tác nhạy cảm

### 4. Performance
- Lazy loading cho các trang
- Caching cho API calls
- Optimized rendering

## Cấu Hình Mặc Định

Hệ thống đã được cấu hình sẵn với các giá trị mặc định từ seeder:

**General Group:**
- site_name: "Website Name"
- timezone: "Asia/Ho_Chi_Minh"
- currency: "VND"
- maintenance_mode: false

**Email Group:**
- mail_mailer: "log"
- mail_port: 2525
- mail_from_address: "hello@example.com"

**Security Group:**
- session_lifetime: 120
- max_login_attempts: 5
- password_min_length: 8
- rate_limit_requests: 100

## Lưu Ý

1. **Backup**: Luôn backup cấu hình trước khi thay đổi
2. **Testing**: Test cấu hình email trước khi sử dụng production
3. **Security**: Cẩn thận với các cài đặt bảo mật
4. **Cache**: Xóa cache sau khi thay đổi cấu hình quan trọng
