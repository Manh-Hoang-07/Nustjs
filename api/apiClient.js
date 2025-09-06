import axios from 'axios'

// Tạo function để lấy base URL
function getApiBaseURL() {
  // Trong browser, lấy từ window.__NUXT__.config
  if (typeof window !== 'undefined' && window.__NUXT__?.config?.public?.apiBase) {
    return window.__NUXT__.config.public.apiBase
  }
  
  // Fallback cho server-side hoặc khi không có config
  return process.env.API_BASE_URL || 'http://127.0.0.1:8000'
}

const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true,
})

// Helper function để lấy token từ cookie
function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      const token = decodeURIComponent(value);
      return token;
    }
  }
  return null;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Tự động thêm token vào header nếu có trong cookie
    const token = getTokenFromCookie()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message
    })
    
    // Xử lý lỗi authentication
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Authentication error detected
    }
    
    return Promise.reject(error)
  }
)

export default api 