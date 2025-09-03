# Hướng dẫn Test API Tin Tức

## 🎯 Mục tiêu
Kiểm tra xem API tin tức có hoạt động đúng không và hiển thị data thực tế trên trang home.

## 🚀 Cách test

### 1. Chạy ứng dụng
```bash
npm run dev
```

### 2. Truy cập các trang test

#### Trang Demo chính:
- **URL:** `http://localhost:3000/demo`
- **Mô tả:** Trang demo đầy đủ với các nút test API, hiển thị trạng thái và data

#### Trang Test API:
- **URL:** `http://localhost:3000/test-api`
- **Mô tả:** Trang test API chi tiết với raw response

#### Trang Home (đã cập nhật):
- **URL:** `http://localhost:3000/home`
- **Mô tả:** Trang home với section tin tức sử dụng API thực tế

### 3. Kiểm tra Console
Mở Developer Tools (F12) và xem tab Console để theo dõi:
- ✅ API calls thành công
- ❌ Lỗi API (nếu có)
- 🔄 Quá trình loading
- 📊 Data được fetch

## 🔧 Các tính năng đã implement

### ✅ API Integration
- Sử dụng `useApiClient()` có sẵn trong dự án
- Endpoint: `/api/posts`
- Hỗ trợ pagination và filtering
- Error handling đầy đủ

### ✅ Fallback System
- Nếu API không hoạt động → tự động sử dụng mock data
- Mock data sử dụng chính data mẫu bạn đã cung cấp
- Đảm bảo trang luôn hiển thị content

### ✅ UI Components
- `NewsSection.vue`: Component hiển thị tin tức
- Loading states với skeleton
- Empty states khi không có data
- Responsive design

### ✅ Data Processing
- Format ngày tháng tiếng Việt
- Cắt ngắn excerpt
- Hiển thị categories và tags
- Gradient colors cho cards

## 🐛 Troubleshooting

### Nếu API không hoạt động:
1. Kiểm tra server backend có chạy không
2. Kiểm tra URL API trong `nuxt.config.ts`
3. Xem console để biết lỗi cụ thể
4. Component sẽ tự động fallback sang mock data

### Nếu không thấy data:
1. Kiểm tra console logs
2. Thử click nút "Use Mock Data" trên trang demo
3. Kiểm tra network tab trong DevTools

## 📊 Data Structure

API response cần có format:
```json
{
  "data": [
    {
      "id": 7,
      "name": "Title",
      "slug": "title-slug",
      "image": "image-url",
      "published_at": "2025-08-20T01:23:36.000000Z",
      "categories": [{"id": 1, "name": "Category"}],
      "tags": [{"id": 1, "name": "Tag"}],
      "view_count": 0
    }
  ],
  "meta": {...},
  "links": {...}
}
```

## 🎨 UI Features

- **Loading States**: Skeleton loading khi fetch data
- **Error Handling**: Hiển thị lỗi rõ ràng
- **Empty States**: Thông báo khi không có data
- **Responsive**: Hoạt động tốt trên mobile
- **Hover Effects**: Animation khi hover cards
- **Color Coding**: Mỗi post có màu gradient riêng

## 🔄 Next Steps

1. **Test API**: Chạy ứng dụng và kiểm tra các trang demo
2. **Verify Data**: Đảm bảo data hiển thị đúng
3. **Check Console**: Xem logs để debug nếu cần
4. **Customize**: Điều chỉnh UI theo ý muốn

---

**Lưu ý:** Nếu API backend chưa sẵn sàng, component sẽ tự động sử dụng mock data để đảm bảo trang hoạt động bình thường.
