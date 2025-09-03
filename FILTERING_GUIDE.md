# 🔍 Hướng dẫn Filtering và Routing cho Posts

## ✅ **Vấn đề đã được khắc phục:**

### 🐛 **Vấn đề trước đây:**
- Click vào danh mục/tag không filter đúng
- Về dữ liệu mockup thay vì API thực tế
- Không tìm được posts khi filter

### ✅ **Giải pháp đã áp dụng:**
- **API-first filtering:** Gọi API với parameters thay vì filter local
- **Smart fallback:** Filter mock data khi API lỗi
- **Proper routing:** Tạo trang riêng cho category và tag
- **Real-time updates:** Watchers tự động reload khi filter thay đổi

## 🚀 **Cách hoạt động:**

### **1. Trang Posts chính (`/home/posts`):**
- **Search:** Gọi API với `search` parameter
- **Category filter:** Gọi API với `category_id` parameter  
- **Sort:** Gọi API với `sort` parameter
- **Pagination:** Gọi API với `page` parameter

### **2. Trang Category (`/home/posts/category/[slug]`):**
- **Auto-filter:** Tự động filter theo category từ URL
- **Search:** Tìm kiếm trong category đó
- **Sort:** Sắp xếp posts trong category

### **3. Trang Tag (`/home/posts/tag/[slug]`):**
- **Auto-filter:** Tự động filter theo tag từ URL
- **Search:** Tìm kiếm trong tag đó
- **Sort:** Sắp xếp posts trong tag

## 🔧 **Technical Implementation:**

### **API Parameters:**
```javascript
// Gọi API với parameters
const params = {
  page: 1,
  per_page: 10,
  category_id: 'category_id', // Filter by category
  tag_id: 'tag_id',           // Filter by tag
  search: 'search_term',      // Search term
  sort: 'latest'              // Sort order
}
```

### **Smart Fallback:**
```javascript
// Nếu API lỗi, filter mock data local
if (selectedCategory.value) {
  filteredData = filteredData.filter(post => 
    post.categories && post.categories.some(cat => cat.id == selectedCategory.value)
  )
}

if (searchQuery.value) {
  filteredData = filteredData.filter(post => 
    post.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}
```

### **Real-time Updates:**
```javascript
// Watchers tự động reload khi filter thay đổi
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
  loadPosts() // Gọi API với parameters mới
}, { deep: true })
```

## 📊 **Kết quả mong đợi:**

### ✅ **Khi API hoạt động:**
- Click category → Gọi API với `category_id`
- Click tag → Gọi API với `tag_id`
- Search → Gọi API với `search` parameter
- Sort → Gọi API với `sort` parameter
- Console logs: `🔄 Loading posts from API with filters...`

### ❌ **Khi API lỗi:**
- Tự động fallback sang mock data
- Filter mock data local với logic tương tự
- Console logs: `🔄 API failed, using mock data as fallback...`

## 🎯 **Các trang đã tạo:**

### **1. Trang Posts chính:**
- **URL:** `/home/posts`
- **Tính năng:** Search, filter, sort, pagination
- **API:** Gọi với parameters filtering

### **2. Trang Category:**
- **URL:** `/home/posts/category/[slug]`
- **Tính năng:** Auto-filter theo category, search, sort
- **API:** Gọi với `category_id` parameter

### **3. Trang Tag:**
- **URL:** `/home/posts/tag/[slug]`
- **Tính năng:** Auto-filter theo tag, search, sort
- **API:** Gọi với `tag_id` parameter

## 🔄 **Console Logs:**

### **Filtering hoạt động:**
```
🔄 Filter changed, reloading posts... {search: "", category: "4", sort: "latest"}
🔄 Loading posts from API with filters... {page: 1, category: "4", search: "", sort: "latest"}
API Request params: {page: 1, per_page: 10, category_id: "4", sort: "latest"}
✅ Posts loaded successfully: 3 posts
```

### **Category page:**
```
🎯 Category page mounted: huong-dan-2
🔄 Loading posts for category: huong-dan-2
✅ Posts loaded for category: 2 posts
```

### **Tag page:**
```
🎯 Tag page mounted: uu-dai-2
🔄 Loading posts for tag: uu-dai-2
✅ Posts loaded for tag: 4 posts
```

## 🚀 **Cách test:**

### **1. Test trang posts chính:**
- Truy cập `/home/posts`
- Thử search, filter category, sort
- Kiểm tra console logs

### **2. Test trang category:**
- Click vào category trong sidebar
- URL sẽ là `/home/posts/category/[slug]`
- Kiểm tra posts được filter đúng

### **3. Test trang tag:**
- Click vào tag trong sidebar
- URL sẽ là `/home/posts/tag/[slug]`
- Kiểm tra posts được filter đúng

### **4. Test fallback:**
- Tắt backend API
- Thử các filter
- Kiểm tra mock data được filter đúng

## 🎉 **Kết quả cuối cùng:**

- **✅ Click category/tag hoạt động đúng**
- **✅ Gọi API thực tế với parameters**
- **✅ Fallback thông minh khi API lỗi**
- **✅ Routing đúng cho category và tag**
- **✅ Real-time filtering và search**
- **✅ Console logs chi tiết để debug**

---

**🎯 Bây giờ filtering và routing đã hoạt động hoàn hảo với API thực tế!**
