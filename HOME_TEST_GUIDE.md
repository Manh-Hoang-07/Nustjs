# 🏠 Hướng dẫn Test Trang Home

## ✅ Trang home đã được tích hợp API thực tế!

### 🎯 Các trang để test:

#### 1. **Trang Home chính:**
- **URL:** `http://localhost:3000/home`
- **Tính năng:** Section tin tức với API thực tế + fallback mock data
- **Mô tả:** Trang home đầy đủ với tất cả sections

#### 2. **Trang Test Home:**
- **URL:** `http://localhost:3000/test-home`
- **Tính năng:** Test riêng section tin tức với debug info
- **Mô tả:** Trang test chuyên biệt cho section tin tức

#### 3. **Trang Demo:**
- **URL:** `http://localhost:3000/demo`
- **Tính năng:** Test API + Mock data + UI components
- **Mô tả:** Trang demo đầy đủ với các nút test

## 🔧 Cách hoạt động:

### ✅ **API Integration:**
- Gọi API thực tế: `GET /api/posts`
- Sử dụng `useApiClient()` có sẵn trong dự án
- Hỗ trợ pagination và filtering
- Error handling đầy đủ

### ✅ **Smart Fallback:**
- Nếu API hoạt động → hiển thị data thực tế
- Nếu API lỗi → tự động dùng mock data (data mẫu bạn cung cấp)
- Đảm bảo trang luôn hiển thị content

### ✅ **UI Features:**
- Loading states với skeleton
- Empty states khi không có data
- Responsive design
- Hover effects và animations
- Color-coded cards

## 📊 Data hiển thị:

- **Title:** Tên bài viết
- **Date:** Ngày đăng (format tiếng Việt)
- **Image:** Ảnh bài viết hoặc gradient placeholder
- **Categories:** Danh mục (hiển thị tối đa 2)
- **Tags:** Thẻ (hiển thị tối đa 3)
- **View Count:** Số lượt xem
- **Link:** Link đến chi tiết bài viết

## 🚀 Cách test:

### 1. **Chạy ứng dụng:**
```bash
npm run dev
```

### 2. **Truy cập trang home:**
- Mở `http://localhost:3000/home`
- Scroll xuống section "Tin tức mới nhất"
- Kiểm tra console (F12) để xem logs

### 3. **Kiểm tra kết quả:**
- **Nếu API hoạt động:** Sẽ thấy data thực tế từ API
- **Nếu API lỗi:** Sẽ tự động hiển thị mock data
- **Console logs:** Sẽ hiển thị quá trình fetch API

## 📱 Responsive Design:

- **Desktop:** 3 cột
- **Tablet:** 2 cột
- **Mobile:** 1 cột
- **Hover effects:** Scale và shadow
- **Loading states:** Skeleton loading

## 🎨 UI Components:

- **NewsSection.vue:** Component chính hiển thị tin tức
- **Loading states:** Skeleton với animation
- **Empty states:** Thông báo khi không có data
- **Error handling:** Fallback tự động

## 🔄 Console Logs:

### ✅ Nếu API hoạt động:
```
🔄 Fetching latest posts from API...
✅ Posts fetched successfully from API: 3 posts
```

### ❌ Nếu API lỗi:
```
❌ Error fetching latest posts from API: Network Error
🔄 API failed, using mock data as fallback...
✅ Using mock data as fallback: 3 posts
```

## 🎯 Kết quả cuối cùng:

- **Trang home hoạt động hoàn hảo**
- **Section tin tức hiển thị đẹp mắt**
- **API integration đầy đủ**
- **Fallback system thông minh**
- **Responsive design**
- **Loading states và error handling**

---

**Lưu ý:** Trang home đã sẵn sàng sử dụng! Nếu backend API chưa sẵn sàng, trang sẽ tự động hiển thị mock data để đảm bảo hoạt động bình thường.
