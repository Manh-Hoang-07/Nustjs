import { ref } from 'vue'
import { useApiClient } from './api/useApiClient.js'

// State
const loading = ref(false)
const error = ref(null)
const data = ref(null)

// Test API function
export const useTestApi = () => {
  const testPostsApi = async () => {
    loading.value = true
    error.value = null
    data.value = null
    
    try {
      console.log('🚀 Testing Posts API...')
      
      // Sử dụng API client có sẵn
      const apiClient = useApiClient()
      
      // Test với data thực tế từ API
      const response = await apiClient.get('/api/posts', {
        params: {
          page: 1,
          per_page: 3
        }
      })
      
      console.log('✅ API Response received:', response.data)
      
      data.value = response.data
      
      return response.data
    } catch (err) {
      console.error('❌ API Error:', err)
      error.value = err.message || 'API call failed'
      
      // Log chi tiết lỗi
      if (err.response) {
        console.error('Response status:', err.response.status)
        console.error('Response data:', err.response.data)
      } else if (err.request) {
        console.error('Request error:', err.request)
      } else {
        console.error('Error message:', err.message)
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const testWithMockData = () => {
    console.log('🧪 Using mock data for testing...')
    
    // Sử dụng data mẫu mà bạn đã cung cấp
    const mockData = {
      "data": [
        {
          "id": 7,
          "name": "Nobis asperiores fuga eum ut.",
          "slug": "nobis-asperiores-fuga-eum-ut-2078",
          "excerpt": null,
          "content": null,
          "image": null,
          "cover_image": null,
          "status": "published",
          "is_featured": false,
          "is_pinned": false,
          "published_at": "2025-08-20T01:23:36.000000Z",
          "view_count": 0,
          "primary_postcategory_id": null,
          "meta_title": null,
          "meta_description": null,
          "canonical_url": null,
          "og_title": null,
          "og_description": null,
          "og_image": null,
          "categories": [],
          "tags": [
            {"id": 9, "name": "Et Sequi", "slug": "et-sequi-4660"},
            {"id": 12, "name": "Incidunt", "slug": "incidunt-5974"}
          ],
          "created_at": "2025-08-28T16:28:47.000000Z",
          "updated_at": null
        },
        {
          "id": 8,
          "name": "Sunt occaecati deleniti ipsum.",
          "slug": "sunt-occaecati-deleniti-ipsum-8041",
          "excerpt": null,
          "content": null,
          "image": "https://via.placeholder.com/800x600.png/00aa00?text=business+non",
          "cover_image": null,
          "status": "published",
          "is_featured": false,
          "is_pinned": false,
          "published_at": "2025-08-16T03:45:01.000000Z",
          "view_count": 0,
          "primary_postcategory_id": null,
          "meta_title": null,
          "meta_description": null,
          "canonical_url": null,
          "og_title": null,
          "og_description": null,
          "og_image": null,
          "categories": [
            {"id": 4, "name": "Hướng dẫn", "slug": "huong-dan-2"},
            {"id": 8, "name": "Non Enim Mollitia", "slug": "non-enim-mollitia-8993"},
            {"id": 9, "name": "Delectus", "slug": "delectus-3112"}
          ],
          "tags": [
            {"id": 1, "name": "Ưu đãi", "slug": "uu-dai-2"},
            {"id": 14, "name": "Nisi", "slug": "nisi-2875"},
            {"id": 15, "name": "Autem Sint", "slug": "autem-sint-4931"}
          ],
          "created_at": "2025-08-28T16:28:47.000000Z",
          "updated_at": null
        }
      ],
      "links": {
        "first": "http://127.0.0.1:8000/api/posts?page=1",
        "last": "http://127.0.0.1:8000/api/posts?page=1",
        "prev": null,
        "next": null
      },
      "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "links": [
          {"url": null, "label": "&laquo; Previous", "active": false},
          {"url": "http://127.0.0.1:8000/api/posts?page=1", "label": "1", "active": true},
          {"url": null, "label": "Next &raquo;", "active": false}
        ],
        "path": "http://127.0.0.1:8000/api/posts",
        "per_page": 20,
        "to": 11,
        "total": 11
      }
    }
    
    data.value = mockData
    return mockData
  }
  
  return {
    loading,
    error,
    data,
    testPostsApi,
    testWithMockData
  }
}
