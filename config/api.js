// API Configuration
export const API_CONFIG = {
  // Base URL của server API (backend)
  BASE_URL: 'http://127.0.0.1:8000',
  
  // Hoặc nếu server API ở domain khác:
  // BASE_URL: 'https://your-api-domain.com',
  // BASE_URL: 'http://192.168.1.100:8000',
  
  // Endpoints
  ENDPOINTS: {
    UPLOAD_IMAGE: '/api/upload-image',
    POSTS: '/api/admin/posts',
    POST_CATEGORIES: '/api/post-categories',
    POST_TAGS: '/api/post-tags'
  }
}

// Helper function để lấy full URL cho images
export function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  
  // Nếu path bắt đầu bằng /storage/, thêm BASE_URL vào đầu
  if (path.startsWith('/storage/')) {
    return `${API_CONFIG.BASE_URL}${path}`
  }
  
  // Nếu path không bắt đầu bằng /, thêm /storage/ vào
  const storagePath = path.startsWith('/') ? path : `/storage/${path}`
  return `${API_CONFIG.BASE_URL}${storagePath}`
}
