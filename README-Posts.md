# Posts Module - Hệ thống quản lý bài viết

## Tổng quan

Module Posts cung cấp hệ thống quản lý bài viết hoàn chỉnh cho cả admin và người dùng cuối, bao gồm:

- **Admin Panel**: Quản lý bài viết, danh mục, tags
- **Public Interface**: Hiển thị bài viết cho người dùng
- **API Integration**: Tích hợp với Laravel backend

## Cấu trúc thư mục

```
├── api/
│   └── endpoints.js                 # API endpoints cho Posts
├── composables/
│   └── data/
│       └── usePosts.js             # Composable quản lý Posts data
├── pages/
│   ├── admin/
│   │   ├── posts/
│   │   │   └── index.vue           # Trang quản lý bài viết
│   │   ├── post-categories/
│   │   │   └── index.vue           # Trang quản lý danh mục
│   │   └── post-tags/
│   │       └── index.vue           # Trang quản lý tags
│   └── posts/
│       ├── index.vue               # Trang danh sách bài viết (public)
│       └── [slug].vue              # Trang chi tiết bài viết
└── README-Posts.md                 # Tài liệu này
```

## API Endpoints

### Admin API
- `POST /admin/posts` - Tạo bài viết mới
- `GET /admin/posts` - Lấy danh sách bài viết (admin)
- `PUT /admin/posts/{id}` - Cập nhật bài viết
- `DELETE /admin/posts/{id}` - Xóa bài viết
- `GET /admin/post-categories` - Lấy danh sách danh mục
- `POST /admin/post-categories` - Tạo danh mục mới
- `PUT /admin/post-categories/{id}` - Cập nhật danh mục
- `DELETE /admin/post-categories/{id}` - Xóa danh mục
- `GET /admin/posttags` - Lấy danh sách tags
- `POST /admin/posttags` - Tạo tag mới
- `PUT /admin/posttags/{id}` - Cập nhật tag
- `DELETE /admin/posttags/{id}` - Xóa tag

### Public API
- `GET /posts` - Lấy danh sách bài viết (public)
- `GET /posts/{id}` - Lấy bài viết theo ID
- `GET /posts/slug/{slug}` - Lấy bài viết theo slug
- `GET /post-categories` - Lấy danh sách danh mục (public)
- `GET /post-categories/{id}` - Lấy danh mục theo ID
- `GET /post-categories/slug/{slug}` - Lấy danh mục theo slug
- `GET /post-tags` - Lấy danh sách tags (public)
- `GET /post-tags/{id}` - Lấy tag theo ID
- `GET /post-tags/slug/{slug}` - Lấy tag theo slug

## Tính năng chính

### Admin Panel

#### 1. Quản lý bài viết (`/admin/posts`)
- **Dashboard**: Thống kê tổng quan (tổng bài viết, đã xuất bản, bản nháp, danh mục)
- **CRUD Operations**: Thêm, sửa, xóa bài viết
- **Rich Text Editor**: Sử dụng CKEditor cho nội dung
- **Image Upload**: Upload ảnh đại diện
- **Advanced Filters**: Tìm kiếm, lọc theo trạng thái, danh mục, tác giả
- **Bulk Actions**: Thao tác hàng loạt
- **Status Management**: Quản lý trạng thái (draft, published, archived)

#### 2. Quản lý danh mục (`/admin/post-categories`)
- **Category CRUD**: Thêm, sửa, xóa danh mục
- **Statistics**: Hiển thị số bài viết trong mỗi danh mục
- **Status Control**: Bật/tắt danh mục
- **Slug Management**: Tự động tạo slug từ tên danh mục

#### 3. Quản lý tags (`/admin/post-tags`)
- **Tag CRUD**: Thêm, sửa, xóa tags
- **Usage Statistics**: Hiển thị số bài viết sử dụng mỗi tag
- **Search & Filter**: Tìm kiếm và sắp xếp tags
- **Grid Layout**: Hiển thị dạng grid với thông tin chi tiết

### Public Interface

#### 1. Trang danh sách bài viết (`/posts`)
- **Modern Design**: Giao diện hiện đại, responsive
- **Advanced Search**: Tìm kiếm theo tiêu đề, nội dung
- **Category Filter**: Lọc theo danh mục
- **Sorting Options**: Sắp xếp theo thời gian, độ phổ biến
- **Pagination**: Phân trang hiệu quả
- **Sidebar**: Danh mục, tags phổ biến, bài viết gần đây

#### 2. Trang chi tiết bài viết (`/posts/[slug]`)
- **Hero Section**: Ảnh đại diện lớn với overlay
- **Author Info**: Thông tin tác giả, ngày đăng
- **Social Features**: Lượt xem, lượt thích, chia sẻ
- **Rich Content**: Hiển thị nội dung HTML với styling
- **Tags Display**: Hiển thị tags liên quan
- **Navigation**: Bài viết trước/sau
- **Related Posts**: Bài viết liên quan cùng danh mục

## Composable: usePosts

```javascript
import { usePosts } from '~/composables/data/usePosts'

const { 
  posts, 
  categories, 
  tags, 
  loading, 
  error,
  fetchAdminPosts, 
  createPost, 
  updatePost, 
  deletePost,
  fetchPublicPosts,
  fetchPostBySlug,
  fetchCategories,
  fetchTags,
  publishedPosts,
  draftPosts
} = usePosts()
```

### State
- `posts`: Danh sách bài viết
- `categories`: Danh sách danh mục
- `tags`: Danh sách tags
- `loading`: Trạng thái loading
- `error`: Thông báo lỗi

### Methods
- `fetchAdminPosts(params)`: Lấy danh sách bài viết cho admin
- `createPost(postData)`: Tạo bài viết mới
- `updatePost(id, postData)`: Cập nhật bài viết
- `deletePost(id)`: Xóa bài viết
- `fetchPublicPosts(params)`: Lấy danh sách bài viết công khai
- `fetchPostBySlug(slug)`: Lấy bài viết theo slug
- `fetchCategories()`: Lấy danh sách danh mục
- `fetchTags()`: Lấy danh sách tags

### Computed
- `publishedPosts`: Bài viết đã xuất bản
- `draftPosts`: Bài viết bản nháp

## Cách sử dụng

### 1. Cài đặt dependencies
```bash
# Đảm bảo các component cần thiết đã có
npm install @ckeditor/ckeditor5-vue
```

### 2. Sử dụng trong component
```vue
<template>
  <div>
    <div v-if="loading">Đang tải...</div>
    <div v-else>
      <div v-for="post in posts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <p>{{ post.excerpt }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePosts } from '~/composables/data/usePosts'

const { posts, loading, fetchPublicPosts } = usePosts()

onMounted(async () => {
  await fetchPublicPosts()
})
</script>
```

### 3. Tích hợp với API
```javascript
// Tạo bài viết mới
const newPost = await createPost({
  title: 'Tiêu đề bài viết',
  content: 'Nội dung bài viết',
  category_id: 1,
  status: 'draft'
})

// Cập nhật bài viết
await updatePost(1, {
  title: 'Tiêu đề mới',
  status: 'published'
})
```

## Styling & UI Components

### Design System
- **Color Scheme**: Blue, Green, Purple, Gray
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale (4, 6, 8, 12, 16, 24, 32)
- **Shadows**: Subtle shadows for depth
- **Border Radius**: Consistent rounded corners

### Responsive Design
- **Mobile First**: Thiết kế ưu tiên mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid với fallback Flexbox
- **Touch Friendly**: Buttons và interactions tối ưu cho touch

### Component Library
- **Modal**: Reusable modal component
- **Actions**: Action buttons (edit, delete, view)
- **Pagination**: Phân trang với navigation
- **ImageUploader**: Upload và preview ảnh
- **CKEditor**: Rich text editor
- **MultipleSelect**: Multi-select dropdown

## Performance Optimization

### 1. Lazy Loading
- **Image Lazy Loading**: Sử dụng Intersection Observer
- **Component Lazy Loading**: Dynamic imports cho components lớn
- **API Pagination**: Load dữ liệu theo trang

### 2. Caching
- **API Response Caching**: Cache responses trong composable
- **Image Optimization**: Tối ưu hóa ảnh với WebP format
- **Static Generation**: Pre-render các trang tĩnh

### 3. Bundle Optimization
- **Tree Shaking**: Loại bỏ unused code
- **Code Splitting**: Chia nhỏ bundle theo route
- **Asset Optimization**: Minify CSS/JS, compress images

## Security Considerations

### 1. Input Validation
- **Client-side Validation**: Validate form inputs
- **XSS Prevention**: Sanitize HTML content
- **CSRF Protection**: CSRF tokens cho admin actions

### 2. Authentication & Authorization
- **Admin Access Control**: Middleware bảo vệ admin routes
- **Role-based Access**: Phân quyền theo vai trò
- **Session Management**: Secure session handling

### 3. Data Protection
- **SQL Injection Prevention**: Parameterized queries
- **File Upload Security**: Validate file types và sizes
- **Rate Limiting**: Giới hạn API requests

## Testing

### 1. Unit Tests
```bash
# Test composables
npm run test:unit composables/data/usePosts

# Test components
npm run test:unit components/Posts
```

### 2. Integration Tests
```bash
# Test API integration
npm run test:integration posts

# Test admin workflows
npm run test:integration admin/posts
```

### 3. E2E Tests
```bash
# Test user flows
npm run test:e2e posts-flow

# Test admin flows
npm run test:e2e admin-posts-flow
```

## Deployment

### 1. Build Process
```bash
# Build production
npm run build

# Preview build
npm run preview
```

### 2. Environment Variables
```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=https://api.example.com
NUXT_PUBLIC_API_TIMEOUT=10000

# Feature Flags
NUXT_PUBLIC_ENABLE_POSTS=true
NUXT_PUBLIC_ENABLE_COMMENTS=false
```

### 3. CDN Configuration
- **Image CDN**: Cloudinary, AWS S3
- **Static Assets**: Vercel, Netlify
- **API CDN**: Cloudflare, AWS CloudFront

## Troubleshooting

### Common Issues

#### 1. API Connection Errors
```javascript
// Check API endpoint configuration
console.log('API Base URL:', useRuntimeConfig().public.apiBaseUrl)

// Verify network connectivity
try {
  await fetch('/api/health')
} catch (error) {
  console.error('Network error:', error)
}
```

#### 2. Image Loading Issues
```javascript
// Check image URL format
const imageUrl = post.featured_image || '/placeholder.jpg'

// Verify image exists
const img = new Image()
img.onload = () => console.log('Image loaded successfully')
img.onerror = () => console.error('Image failed to load')
img.src = imageUrl
```

#### 3. Editor Issues
```javascript
// Check CKEditor configuration
const editorConfig = {
  toolbar: ['heading', 'bold', 'italic'],
  placeholder: 'Nhập nội dung...'
}

// Verify editor instance
onMounted(() => {
  if (editor.value) {
    console.log('Editor initialized:', editor.value)
  }
})
```

## Contributing

### 1. Code Standards
- **ESLint**: Follow project ESLint rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety cho complex logic
- **Vue Style Guide**: Follow Vue.js best practices

### 2. Git Workflow
```bash
# Create feature branch
git checkout -b feature/posts-enhancement

# Make changes and commit
git add .
git commit -m "feat: enhance posts module with advanced filtering"

# Push and create PR
git push origin feature/posts-enhancement
```

### 3. Documentation
- **Code Comments**: JSDoc style comments
- **API Documentation**: OpenAPI/Swagger specs
- **Component Props**: Document component interfaces
- **Changelog**: Keep track of changes

## Roadmap

### Phase 1 (Current)
- ✅ Basic CRUD operations
- ✅ Admin interface
- ✅ Public interface
- ✅ Category management
- ✅ Tag management

### Phase 2 (Next)
- 🔄 Advanced search & filtering
- 🔄 SEO optimization
- 🔄 Social sharing
- 🔄 Comment system
- 🔄 Analytics dashboard

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced content types
- 📋 Workflow management
- 📋 Content scheduling
- 📋 Advanced permissions

## Support

### 1. Documentation
- **API Reference**: `/api/docs`
- **Component Library**: `/storybook`
- **Design System**: `/design-system`

### 2. Community
- **GitHub Issues**: Report bugs và feature requests
- **Discord**: Community discussions
- **Stack Overflow**: Tag với `nuxt-posts`

### 3. Professional Support
- **Enterprise Support**: Dedicated support team
- **Consulting**: Custom development services
- **Training**: Team training sessions

---

**Lưu ý**: Module này được thiết kế để tích hợp với Laravel backend. Đảm bảo API endpoints được implement đúng theo specification.

