import { ref, computed } from 'vue'
import { useApiClient } from './api/useApiClient.js'

// State
const posts = ref([])
const loading = ref(false)
const error = ref(null)

// Computed
const publishedPosts = computed(() => {
  return posts.value.filter(post => post.status === 'published')
})

// Helper function để format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function để format excerpt
const formatExcerpt = (content, maxLength = 150) => {
  if (!content) return ''
  const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Helper function để lấy màu gradient cho card
const getCardGradient = (index) => {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600', 
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600'
  ]
  return gradients[index % gradients.length]
}

// Helper function để lấy màu text cho link
const getTextColor = (index) => {
  const colors = [
    'text-blue-600 hover:text-blue-800',
    'text-green-600 hover:text-green-800',
    'text-purple-600 hover:text-purple-800',
    'text-pink-600 hover:text-pink-800',
    'text-yellow-600 hover:text-yellow-800',
    'text-red-600 hover:text-red-800',
    'text-indigo-600 hover:text-indigo-800',
    'text-teal-600 hover:text-teal-800'
  ]
  return colors[index % colors.length]
}

// Methods
const fetchPosts = async (options = {}) => {
  loading.value = true
  error.value = null
  
  try {
    // Sử dụng API client có sẵn trong dự án
    const apiClient = useApiClient()
    
    // Chuẩn bị parameters cho API
    const params = {
      page: options.page || 1,
      per_page: options.limit || 10
    }
    
    // Thêm filtering parameters
    if (options.category) {
      params.category_id = options.category
    }
    if (options.tag) {
      params.tag_id = options.tag
    }
    if (options.search) {
      params.search = options.search
    }
    if (options.sort) {
      params.sort = options.sort
    }
    
    console.log('API Request params:', params) // Debug log
    
    // Gọi API để lấy danh sách posts
    const response = await apiClient.get('/api/posts', { params })
    
    console.log('API Response:', response.data) // Debug log
    console.log('API Response meta:', response.data?.meta) // Debug meta
    
    // Xử lý response data
    if (response.data && response.data.data) {
      posts.value = response.data.data.map(post => ({
        ...post,
        formattedDate: formatDate(post.published_at || post.created_at),
        formattedExcerpt: formatExcerpt(post.excerpt || post.content),
        cardGradient: getCardGradient(post.id),
        textColor: getTextColor(post.id)
      }))
      console.log('✅ Posts processed and set:', posts.value.length, 'posts')
    } else {
      console.warn('⚠️ No data in API response:', response.data)
      posts.value = []
    }
    
    const result = {
      data: posts.value,
      meta: response.data?.meta || null,
      links: response.data?.links || null
    }
    
    console.log('📊 Returning result:', result)
    console.log('📊 Result meta:', result.meta)
    
    return result
  } catch (err) {
    error.value = 'Không thể tải danh sách tin tức'
    console.error('Error fetching posts:', err)
    console.error('Error details:', err.response?.data || err.message)
    return { data: [], meta: null, links: null }
  } finally {
    loading.value = false
  }
}

const fetchLatestPosts = async (limit = 3) => {
  return await fetchPosts({ 
    limit,
    sort: 'latest'
  })
}

const fetchPostBySlug = async (slug) => {
  loading.value = true
  error.value = null
  
  try {
    const apiClient = useApiClient()
    const response = await apiClient.get(`/api/posts/${slug}`)
    
    if (response.data) {
      return {
        ...response.data,
        formattedDate: formatDate(response.data.published_at || response.data.created_at),
        formattedExcerpt: formatExcerpt(response.data.excerpt || response.data.content)
      }
    }
    
    throw new Error('Bài viết không tồn tại')
  } catch (err) {
    error.value = err.message || 'Không thể tải bài viết'
    console.error('Error fetching post:', err)
    throw err
  } finally {
    loading.value = false
  }
}

export const useApiPosts = () => {
  return {
    // State
    posts,
    loading,
    error,
    publishedPosts,
    
    // Methods
    fetchPosts,
    fetchLatestPosts,
    fetchPostBySlug,
    
    // Helper functions
    formatDate,
    formatExcerpt,
    getCardGradient,
    getTextColor
  }
}
