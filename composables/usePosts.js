import { ref, computed } from 'vue'

// Mock data for static interface
const mockPosts = ref([
  {
    id: 1,
    title: 'Hướng dẫn xây dựng ứng dụng Vue.js từ cơ bản đến nâng cao',
    slug: 'huong-dan-xay-dung-ung-dung-vue-js-tu-co-ban-den-nang-cao',
    excerpt: 'Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng một ứng dụng Vue.js hoàn chỉnh từ những khái niệm cơ bản nhất đến các kỹ thuật nâng cao.',
    content: `
      <h2>Giới thiệu về Vue.js</h2>
      <p>Vue.js là một framework JavaScript tiến bộ được sử dụng để xây dựng giao diện người dùng. Không giống như các framework khác, Vue được thiết kế từ đầu để có thể áp dụng từng phần.</p>
      
      <h3>Ưu điểm của Vue.js</h3>
      <ul>
        <li>Dễ học và sử dụng</li>
        <li>Hiệu suất cao</li>
        <li>Ecosystem phong phú</li>
        <li>Cộng đồng lớn mạnh</li>
      </ul>
      
      <h3>Bắt đầu với Vue.js</h3>
      <p>Để bắt đầu với Vue.js, bạn có thể sử dụng CDN hoặc cài đặt qua npm:</p>
      <pre><code>npm install vue@next</code></pre>
      
      <p>Vue.js cung cấp một cách tiếp cận linh hoạt và hiệu quả để xây dựng các ứng dụng web hiện đại.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    category_id: 1,
    author: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    tags: [
      { id: 1, name: 'Vue.js', slug: 'vue-js' },
      { id: 2, name: 'JavaScript', slug: 'javascript' },
      { id: 3, name: 'Frontend', slug: 'frontend' }
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    read_time: '8 phút đọc',
    views: 1250,
    likes: 89,
    status: 'published'
  },
  {
    id: 2,
    title: 'Tối ưu hóa hiệu suất React với useMemo và useCallback',
    slug: 'toi-uu-hoa-hieu-suat-react-voi-usememo-va-usecallback',
    excerpt: 'Tìm hiểu cách sử dụng useMemo và useCallback để tối ưu hóa hiệu suất của ứng dụng React, tránh re-render không cần thiết.',
    content: `
      <h2>Giới thiệu về tối ưu hóa React</h2>
      <p>React là một thư viện JavaScript mạnh mẽ để xây dựng giao diện người dùng. Tuy nhiên, việc tối ưu hóa hiệu suất là rất quan trọng để đảm bảo ứng dụng chạy mượt mà.</p>
      
      <h3>useMemo Hook</h3>
      <p>useMemo cho phép bạn memoize kết quả của một phép tính phức tạp và chỉ tính toán lại khi dependencies thay đổi.</p>
      
      <h3>useCallback Hook</h3>
      <p>useCallback tương tự như useMemo nhưng dành cho functions. Nó trả về một memoized version của callback function.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    category_id: 2,
    author: {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    tags: [
      { id: 2, name: 'JavaScript', slug: 'javascript' },
      { id: 4, name: 'React', slug: 'react' },
      { id: 5, name: 'Performance', slug: 'performance' }
    ],
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    read_time: '6 phút đọc',
    views: 980,
    likes: 67,
    status: 'published'
  },
  {
    id: 3,
    title: 'Xây dựng API RESTful với Node.js và Express',
    slug: 'xay-dung-api-restful-voi-node-js-va-express',
    excerpt: 'Hướng dẫn chi tiết cách xây dựng một API RESTful hoàn chỉnh sử dụng Node.js và Express framework.',
    content: `
      <h2>Giới thiệu về RESTful API</h2>
      <p>REST (Representational State Transfer) là một kiến trúc phần mềm được sử dụng để thiết kế các dịch vụ web. RESTful API tuân theo các nguyên tắc REST.</p>
      
      <h3>Thiết lập dự án</h3>
      <p>Đầu tiên, chúng ta cần khởi tạo một dự án Node.js mới:</p>
      <pre><code>npm init -y</code></pre>
      
      <h3>Cài đặt Express</h3>
      <pre><code>npm install express</code></pre>
    `,
    featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    category_id: 3,
    author: {
      id: 3,
      name: 'Lê Văn C',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    tags: [
      { id: 6, name: 'Node.js', slug: 'node-js' },
      { id: 7, name: 'Express', slug: 'express' },
      { id: 8, name: 'Backend', slug: 'backend' },
      { id: 9, name: 'API', slug: 'api' }
    ],
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    read_time: '10 phút đọc',
    views: 1450,
    likes: 112,
    status: 'published'
  },
  {
    id: 4,
    title: 'CSS Grid vs Flexbox: Khi nào sử dụng cái gì?',
    slug: 'css-grid-vs-flexbox-khi-nao-su-dung-cai-gi',
    excerpt: 'So sánh chi tiết giữa CSS Grid và Flexbox, giúp bạn lựa chọn công cụ phù hợp cho từng tình huống layout.',
    content: `
      <h2>Giới thiệu</h2>
      <p>CSS Grid và Flexbox là hai công cụ layout mạnh mẽ trong CSS. Mỗi cái có ưu điểm riêng và phù hợp với các tình huống khác nhau.</p>
      
      <h3>CSS Grid</h3>
      <p>CSS Grid phù hợp cho layout 2 chiều (2D), cho phép bạn tạo ra các layout phức tạp với hàng và cột.</p>
      
      <h3>Flexbox</h3>
      <p>Flexbox phù hợp cho layout 1 chiều (1D), tuyệt vời cho việc căn chỉnh và phân phối không gian trong một container.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    category_id: 1,
    author: {
      id: 4,
      name: 'Phạm Thị D',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    tags: [
      { id: 10, name: 'CSS', slug: 'css' },
      { id: 11, name: 'Grid', slug: 'grid' },
      { id: 12, name: 'Flexbox', slug: 'flexbox' },
      { id: 13, name: 'Layout', slug: 'layout' }
    ],
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    read_time: '7 phút đọc',
    views: 890,
    likes: 54,
    status: 'published'
  },
  {
    id: 5,
    title: 'TypeScript: Từ cơ bản đến nâng cao',
    slug: 'typescript-tu-co-ban-den-nang-cao',
    excerpt: 'Khám phá TypeScript - một superset của JavaScript với static typing, giúp phát triển ứng dụng an toàn và dễ bảo trì hơn.',
    content: `
      <h2>Giới thiệu về TypeScript</h2>
      <p>TypeScript là một ngôn ngữ lập trình được phát triển bởi Microsoft, là superset của JavaScript với static typing.</p>
      
      <h3>Lợi ích của TypeScript</h3>
      <ul>
        <li>Static typing</li>
        <li>Better IDE support</li>
        <li>Early error detection</li>
        <li>Better refactoring</li>
      </ul>
      
      <h3>Cài đặt TypeScript</h3>
      <pre><code>npm install -g typescript</code></pre>
    `,
    featured_image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    category_id: 2,
    author: {
      id: 5,
      name: 'Hoàng Văn E',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    tags: [
      { id: 2, name: 'JavaScript', slug: 'javascript' },
      { id: 14, name: 'TypeScript', slug: 'typescript' },
      { id: 15, name: 'Programming', slug: 'programming' }
    ],
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z',
    read_time: '12 phút đọc',
    views: 1100,
    likes: 78,
    status: 'published'
  },
  {
    id: 6,
    title: 'Docker cho người mới bắt đầu',
    slug: 'docker-cho-nguoi-moi-bat-dau',
    excerpt: 'Hướng dẫn cơ bản về Docker - công cụ containerization phổ biến nhất hiện nay, giúp đóng gói và triển khai ứng dụng dễ dàng.',
    content: `
      <h2>Docker là gì?</h2>
      <p>Docker là một platform cho phép bạn đóng gói ứng dụng và dependencies của nó vào một container nhẹ, portable.</p>
      
      <h3>Lợi ích của Docker</h3>
      <ul>
        <li>Consistency across environments</li>
        <li>Easy deployment</li>
        <li>Resource efficiency</li>
        <li>Scalability</li>
      </ul>
      
      <h3>Cài đặt Docker</h3>
      <p>Bạn có thể tải Docker từ trang chủ chính thức hoặc sử dụng package manager của hệ điều hành.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=800&h=400&fit=crop',
    category_id: 3,
    author: {
      id: 6,
      name: 'Vũ Thị F',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    tags: [
      { id: 16, name: 'Docker', slug: 'docker' },
      { id: 17, name: 'DevOps', slug: 'devops' },
      { id: 18, name: 'Container', slug: 'container' },
      { id: 19, name: 'Deployment', slug: 'deployment' }
    ],
    created_at: '2024-01-10T08:30:00Z',
    updated_at: '2024-01-10T08:30:00Z',
    read_time: '9 phút đọc',
    views: 750,
    likes: 45,
    status: 'published'
  }
])

const mockCategories = ref([
  {
    id: 1,
    name: 'Frontend Development',
    slug: 'frontend-development',
    description: 'Các bài viết về phát triển giao diện người dùng',
    post_count: 2,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'JavaScript & Frameworks',
    slug: 'javascript-frameworks',
    description: 'JavaScript và các framework phổ biến',
    post_count: 2,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Backend Development',
    slug: 'backend-development',
    description: 'Phát triển phía server và API',
    post_count: 2,
    created_at: '2024-01-01T00:00:00Z'
  }
])

const mockTags = ref([
  { id: 1, name: 'Vue.js', slug: 'vue-js', post_count: 1 },
  { id: 2, name: 'JavaScript', slug: 'javascript', post_count: 3 },
  { id: 3, name: 'Frontend', slug: 'frontend', post_count: 1 },
  { id: 4, name: 'React', slug: 'react', post_count: 1 },
  { id: 5, name: 'Performance', slug: 'performance', post_count: 1 },
  { id: 6, name: 'Node.js', slug: 'node-js', post_count: 1 },
  { id: 7, name: 'Express', slug: 'express', post_count: 1 },
  { id: 8, name: 'Backend', slug: 'backend', post_count: 1 },
  { id: 9, name: 'API', slug: 'api', post_count: 1 },
  { id: 10, name: 'CSS', slug: 'css', post_count: 1 },
  { id: 11, name: 'Grid', slug: 'grid', post_count: 1 },
  { id: 12, name: 'Flexbox', slug: 'flexbox', post_count: 1 },
  { id: 13, name: 'Layout', slug: 'layout', post_count: 1 },
  { id: 14, name: 'TypeScript', slug: 'typescript', post_count: 1 },
  { id: 15, name: 'Programming', slug: 'programming', post_count: 1 },
  { id: 16, name: 'Docker', slug: 'docker', post_count: 1 },
  { id: 17, name: 'DevOps', slug: 'devops', post_count: 1 },
  { id: 18, name: 'Container', slug: 'container', post_count: 1 },
  { id: 19, name: 'Deployment', slug: 'deployment', post_count: 1 }
])

// State
const posts = ref([])
const categories = ref([])
const tags = ref([])
const loading = ref(false)
const error = ref(null)

// Computed
const publishedPosts = computed(() => {
  return posts.value.filter(post => post.status === 'published')
})

// Methods
const fetchPublicPosts = async (options = {}) => {
  loading.value = true
  error.value = null
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredPosts = [...mockPosts.value]
    
    // Filter by category
    if (options.category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category_id === options.category || 
        post.category?.slug === options.category
      )
    }
    
    // Filter by tag
    if (options.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags && post.tags.some(tag => 
          tag.slug === options.tag || tag.id === options.tag
        )
      )
    }
    
    // Search
    if (options.search) {
      const searchTerm = options.search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm)
      )
    }
    
    // Sort
    if (options.sort) {
      switch (options.sort) {
        case 'oldest':
          filteredPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          break
        case 'popular':
          filteredPosts.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
        default: // latest
          filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
    }
    
    // Pagination
    const page = options.page || 1
    const limit = options.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    posts.value = filteredPosts.slice(startIndex, endIndex)
    
    return filteredPosts
  } catch (err) {
    error.value = 'Không thể tải danh sách bài viết'
    console.error('Error fetching posts:', err)
    return []
  } finally {
    loading.value = false
  }
}

const fetchPostBySlug = async (slug) => {
  loading.value = true
  error.value = null
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const post = mockPosts.value.find(p => p.slug === slug || p.id === slug)
    
    if (!post) {
      throw new Error('Bài viết không tồn tại')
    }
    
    return post
  } catch (err) {
    error.value = err.message || 'Không thể tải bài viết'
    console.error('Error fetching post:', err)
    throw err
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    categories.value = [...mockCategories.value]
    return categories.value
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
}

const fetchTags = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    tags.value = [...mockTags.value]
    return tags.value
  } catch (err) {
    console.error('Error fetching tags:', err)
    return []
  }
}

const fetchRelatedPosts = async (postId, categoryId, limit = 3) => {
  try {
    const related = mockPosts.value
      .filter(post => post.id !== postId && post.category_id === categoryId)
      .slice(0, limit)
    
    return related
  } catch (err) {
    console.error('Error fetching related posts:', err)
    return []
  }
}

export const usePosts = () => {
  return {
    // State
    posts,
    categories,
    tags,
    loading,
    error,
    publishedPosts,
    
    // Methods
    fetchPublicPosts,
    fetchPostBySlug,
    fetchCategories,
    fetchTags,
    fetchRelatedPosts
  }
}
