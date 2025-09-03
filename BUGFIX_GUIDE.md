# 🐛 Bug Fix Guide - Identifier Conflict

## ✅ **Lỗi đã được khắc phục:**

### 🐛 **Lỗi gốc:**
```
[plugin:vite:vue] [vue/compiler-sfc] Identifier 'formatDate' has already been declared.
```

### 🔍 **Nguyên nhân:**
- Function `formatDate` và `formatExcerpt` đã được import từ `useApiPosts` composable
- Nhưng lại được định nghĩa lại trong component
- Gây ra conflict identifier

### ✅ **Giải pháp:**
- Xóa các function duplicate trong component
- Sử dụng functions đã được import từ composable

## 🔧 **Files đã sửa:**

### **1. `pages/home/posts/index.vue`:**
```javascript
// ❌ Trước (có conflict):
const formatDate = (dateString) => { ... }
const formatExcerpt = (content, maxLength = 150) => { ... }

// ✅ Sau (đã sửa):
// formatDate và formatExcerpt đã được import từ useApiPosts composable
```

### **2. `pages/home/posts/category/[slug].vue`:**
```javascript
// ❌ Trước (có conflict):
const formatDate = (dateString) => { ... }
const formatExcerpt = (content, maxLength = 150) => { ... }

// ✅ Sau (đã sửa):
// formatDate và formatExcerpt đã được import từ useApiPosts composable
```

### **3. `pages/home/posts/tag/[slug].vue`:**
```javascript
// ❌ Trước (có conflict):
const formatDate = (dateString) => { ... }
const formatExcerpt = (content, maxLength = 150) => { ... }

// ✅ Sau (đã sửa):
// formatDate và formatExcerpt đã được import từ useApiPosts composable
```

## 🎯 **Functions được import từ composable:**

### **Từ `useApiPosts` composable:**
```javascript
const { 
  posts,
  loading,
  error,
  fetchPosts,
  formatDate,        // ✅ Đã có sẵn
  formatExcerpt      // ✅ Đã có sẵn
} = useApiPosts()
```

### **Implementation trong composable:**
```javascript
// composables/useApiPosts.js
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString))
}

const formatExcerpt = (content, maxLength = 150) => {
  if (!content) return ''
  const text = content.replace(/<[^>]*>/g, '')
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
```

## 🚀 **Kết quả:**

### ✅ **Sau khi sửa:**
- Không còn conflict identifier
- Sử dụng functions từ composable (DRY principle)
- Code cleaner và maintainable hơn
- Không có linter errors

### 🔄 **Cách hoạt động:**
1. Import functions từ `useApiPosts` composable
2. Sử dụng trực tiếp trong template: `{{ formatDate(post.published_at) }}`
3. Không cần định nghĩa lại trong component

## 📊 **Best Practices:**

### ✅ **Nên làm:**
- Import functions từ composables
- Sử dụng functions đã có sẵn
- Tránh duplicate code

### ❌ **Không nên:**
- Định nghĩa lại functions đã có
- Tạo conflict identifier
- Duplicate code logic

## 🎉 **Kết quả cuối cùng:**

- **✅ Không còn lỗi identifier conflict**
- **✅ Code cleaner và maintainable**
- **✅ Sử dụng composable pattern đúng cách**
- **✅ Không có linter errors**
- **✅ Functions hoạt động bình thường**

---

**🎯 Lỗi đã được khắc phục hoàn toàn!**
