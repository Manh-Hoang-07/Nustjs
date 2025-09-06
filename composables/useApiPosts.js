import { ref } from 'vue'
import api from '../api/apiClient.js'
import { POSTS_ENDPOINTS } from '../api/endpoints.js'

// State
const posts = ref([])
const categories = ref([])
const tags = ref([])
const loading = ref(false)
const error = ref(null)

// Methods
const fetchPosts = async (params = {}) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get(POSTS_ENDPOINTS.PUBLIC_POSTS, { params })
    const data = response.data.data || response.data
    
    // Cập nhật posts
    posts.value = data
    
    // Trả về cả data và meta để xử lý pagination
    return {
      data: data,
      meta: response.data.meta || response.data.pagination || null
    }
  } catch (err) {
    error.value = 'Không thể tải danh sách bài viết'
    console.error('Error fetching posts:', err)
    return { data: [], meta: null }
  } finally {
    loading.value = false
  }
}

const fetchPostBySlug = async (slug) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get(`${POSTS_ENDPOINTS.PUBLIC_POSTS}/slug/${slug}`)
    return response.data.data || response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Không thể tải bài viết'
    console.error('Error fetching post by slug:', err)
    return null
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await api.get(POSTS_ENDPOINTS.PUBLIC_POST_CATEGORIES)
    categories.value = response.data.data || response.data
    return categories.value
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
}

const fetchTags = async () => {
  try {
    const response = await api.get(POSTS_ENDPOINTS.PUBLIC_POST_TAGS)
    tags.value = response.data.data || response.data
    return tags.value
  } catch (err) {
    console.error('Error fetching tags:', err)
    return []
  }
}

const fetchRelatedPosts = async (postId, categoryId, limit = 3) => {
  try {
    const response = await api.get(POSTS_ENDPOINTS.PUBLIC_POSTS, {
      params: {
        category_id: categoryId,
        limit: limit + 1, // Lấy thêm 1 để loại trừ bài viết hiện tại
        exclude: postId
      }
    })
    
    const allPosts = response.data.data || response.data
    // Lọc ra bài viết hiện tại
    const filteredPosts = allPosts.filter(post => post.id !== postId)
    return filteredPosts.slice(0, limit)
  } catch (err) {
    console.error('Error fetching related posts:', err)
    return []
  }
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'Không có ngày'
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString))
  } catch (error) {
    return 'Ngày không hợp lệ'
  }
}

const formatExcerpt = (content, maxLength = 150) => {
  if (!content || content === 'undefined' || content === 'null') return 'Không có mô tả'
  
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '')
  
  if (textContent.length <= maxLength) {
    return textContent
  }
  
  return textContent.substring(0, maxLength) + '...'
}

const getCardGradient = (index) => {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600',
    'from-teal-400 to-teal-600'
  ]
  return gradients[index % gradients.length]
}

const getTextColor = (index) => {
  const colors = [
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-pink-600',
    'text-indigo-600',
    'text-yellow-600',
    'text-red-600',
    'text-teal-600'
  ]
  return colors[index % colors.length]
}

export const useApiPosts = () => {
  return {
    // State
    posts,
    categories,
    tags,
    loading,
    error,
    
    // Methods
    fetchPosts,
    fetchPostBySlug,
    fetchCategories,
    fetchTags,
    fetchRelatedPosts,
    
    // Utilities
    formatDate,
    formatExcerpt,
    getCardGradient,
    getTextColor
  }
}