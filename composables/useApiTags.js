import { ref, computed } from 'vue'
import { useApiClient } from './api/useApiClient.js'

export const useApiTags = () => {
  const apiClient = useApiClient()
  
  // State
  const tags = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Computed
  const tagsCount = computed(() => tags.value.length)
  
  // Methods
  const fetchTags = async (options = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const params = {
        per_page: options.limit || 50,
        ...options
      }
      
      const response = await apiClient.get('/api/post-tags', { params })
      
      if (response.data && response.data.data) {
        tags.value = response.data.data
      } else {
        tags.value = response.data || []
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Lỗi khi tải tags'
      tags.value = []
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const fetchPopularTags = async (limit = 10) => {
    return await fetchTags({ 
      limit,
      sort: 'posts_count',
      order: 'desc'
    })
  }
  
  const getTagById = (id) => {
    return tags.value.find(tag => tag.id === id)
  }
  
  const getTagBySlug = (slug) => {
    return tags.value.find(tag => tag.slug === slug)
  }
  
  return {
    // State
    tags,
    loading,
    error,
    
    // Computed
    tagsCount,
    
    // Methods
    fetchTags,
    fetchPopularTags,
    getTagById,
    getTagBySlug
  }
}
