# Chức năng Liên hệ (Contact Feature)

## Tổng quan
Chức năng liên hệ cho phép người dùng gửi tin nhắn liên hệ và admin quản lý các tin nhắn này.

## Cấu trúc Database
```sql
Schema::create('contacts', function (Blueprint $table) {
    $table->id();
    $table->string('name')->nullable();
    $table->string('email');
    $table->string('phone')->nullable();
    $table->string('subject')->nullable();
    $table->text('content');
    $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])
          ->default('pending');
    $table->text('admin_notes')->nullable();
    $table->unsignedBigInteger('admin_id')->nullable();
    $table->timestamp('responded_at')->nullable();
    $table->timestamps();
    $table->softDeletes();

    // Indexes
    $table->index('status');
    $table->index('email');
    $table->index('created_at');
    $table->index(['status', 'created_at']);

    // Foreign key
    $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');
});
```

## API Endpoints

### Public API
- `POST /api/contacts` - Tạo liên hệ mới

### Admin API
- `GET /api/admin/contacts` - Lấy danh sách liên hệ
- `GET /api/admin/contacts/{id}` - Xem chi tiết liên hệ
- `PUT /api/admin/contacts/{id}` - Cập nhật liên hệ
- `DELETE /api/admin/contacts/{id}` - Xóa liên hệ
- `PATCH /api/admin/contacts/{id}/status` - Cập nhật trạng thái
- `PATCH /api/admin/contacts/{id}/mark-responded` - Đánh dấu đã phản hồi
- `POST /api/admin/contacts/bulk-update-status` - Cập nhật trạng thái hàng loạt

## Giao diện người dùng

### Trang liên hệ (`/home/contact`)
- Form liên hệ với các trường:
  - Họ và tên (bắt buộc)
  - Email (bắt buộc)
  - Số điện thoại (tùy chọn)
  - Chủ đề (tùy chọn)
  - Nội dung (bắt buộc)
- Thông tin liên hệ
- FAQ section

### Tính năng
- Validation form sử dụng hệ thống validation rules chung
- Gửi tin nhắn qua API
- Hiển thị thông báo thành công/lỗi
- Responsive design
- Sử dụng FormWrapper và FormField components

## Giao diện Admin

### Trang quản lý liên hệ (`/admin/contacts`)
- Bảng danh sách liên hệ với:
  - Thông tin cơ bản (tên, email, điện thoại, chủ đề)
  - Trạng thái (có thể thay đổi trực tiếp)
  - Ngày tạo
  - Thao tác (xem, sửa, xóa, ghi chú, đánh dấu phản hồi)
- Bộ lọc:
  - Tìm kiếm theo tên, email, chủ đề
  - Lọc theo trạng thái
  - Lọc theo khoảng thời gian
  - Sắp xếp
- Phân trang
- Xuất Excel
- Thống kê nhanh

### Modal xem chi tiết
- Hiển thị đầy đủ thông tin liên hệ
- Cập nhật trạng thái
- Đánh dấu đã phản hồi

### Modal chỉnh sửa
- Chỉnh sửa thông tin liên hệ
- Cập nhật trạng thái
- Thêm/sửa ghi chú admin

### Modal ghi chú
- Xem ghi chú hiện tại
- Thêm/sửa ghi chú
- Thao tác nhanh với các mẫu ghi chú có sẵn

## Trạng thái liên hệ
- `pending` - Chờ xử lý (màu vàng)
- `in_progress` - Đang xử lý (màu xanh dương)
- `completed` - Hoàn thành (màu xanh lá)
- `cancelled` - Đã hủy (màu đỏ)

## Các file đã tạo/cập nhật

### Frontend Files
1. `pages/home/contact.vue` - Trang liên hệ cho người dùng
2. `pages/admin/contacts/index.vue` - Trang quản lý liên hệ admin
3. `pages/admin/contacts/filter.vue` - Component bộ lọc
4. `pages/admin/contacts/view.vue` - Modal xem chi tiết
5. `pages/admin/contacts/edit.vue` - Modal chỉnh sửa
6. `pages/admin/contacts/notes.vue` - Modal ghi chú
7. `api/endpoints.js` - Thêm endpoints cho contacts
8. `constants/enums.js` - Thêm contact_status enum
9. `composables/navigation/useUserNavigation.js` - Thêm link liên hệ
10. `composables/navigation/useAdminNavigation.js` - Thêm menu liên hệ admin

### Backend API (cần implement)
- `PublicContactController@store` - Tạo liên hệ mới
- `ContactController@index` - Lấy danh sách liên hệ
- `ContactController@show` - Xem chi tiết liên hệ
- `ContactController@update` - Cập nhật liên hệ
- `ContactController@destroy` - Xóa liên hệ
- `ContactController@updateStatus` - Cập nhật trạng thái
- `ContactController@markAsResponded` - Đánh dấu đã phản hồi
- `ContactController@bulkUpdateStatus` - Cập nhật trạng thái hàng loạt

## Cách sử dụng

### Cho người dùng
1. Truy cập `/home/contact`
2. Điền thông tin vào form
3. Nhấn "Gửi tin nhắn"
4. Nhận thông báo xác nhận

### Cho admin
1. Truy cập `/admin/contacts`
2. Xem danh sách liên hệ
3. Sử dụng bộ lọc để tìm kiếm
4. Thay đổi trạng thái trực tiếp hoặc qua modal
5. Thêm ghi chú cho từng liên hệ
6. Xuất dữ liệu ra Excel

## Tính năng nổi bật
- Giao diện responsive, thân thiện
- Validation form sử dụng hệ thống validation rules chung
- Thao tác nhanh với dropdown trạng thái
- Ghi chú admin với các mẫu có sẵn
- Xuất Excel
- Thống kê trực quan
- Cache dữ liệu để tối ưu hiệu suất
- Sử dụng FormWrapper và FormField components cho consistency
