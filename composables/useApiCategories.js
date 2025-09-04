import { ref, computed } from 'vue'
import { useApiClient } from './api/useApiClient.js'

export const useApiCategories = () => {
  const apiClient = useApiClient()
  
  // State
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Computed
  const categoriesCount = computed(() => categories.value.length)
  
  // Methods
  const fetchCategories = async (options = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const params = {
        per_page: options.limit || 50,
        ...options
      }
      
      const response = await apiClient.get('/api/post-categories', { params })
      
      if (response.data && response.data.data) {
        categories.value = response.data.data
      } else {
        categories.value = response.data || []
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Lỗi khi tải danh mục'
      categories.value = []
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const fetchPopularCategories = async (limit = 10) => {
    return await fetchCategories({ 
      limit,
      sort: 'posts_count',
      order: 'desc'
    })
  }
  
  const getCategoryById = (id) => {
    return categories.value.find(cat => cat.id === id)
  }
  
  const getCategoryBySlug = (slug) => {
    return categories.value.find(cat => cat.slug === slug)
  }
  
  return {
    // State
    categories,
    loading,
    error,
    
    // Computed
    categoriesCount,
    
    // Methods
    fetchCategories,
    fetchPopularCategories,
    getCategoryById,
    getCategoryBySlug
  }
}
