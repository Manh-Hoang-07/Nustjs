import { ref, computed } from 'vue'
import { useApiClient } from '../composables/api/useApiClient.js'

// Global auth state
const isAuthenticated = ref(false)
const user = ref(null)
const userRole = ref('')

// Auth helper class giống Laravel
class Auth {
  /**
   * Lấy token từ cookie
   */
  static getTokenFromCookie() {
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

  /**
   * Lưu token vào cookie
   */
  static setTokenToCookie(token, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `auth_token=${encodeURIComponent(token)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  /**
   * Xóa token khỏi cookie
   */
  static removeTokenFromCookie() {
    document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
  }
  /**
   * Kiểm tra user đã đăng nhập chưa
   */
  static check() {
    return isAuthenticated.value
  }

  /**
   * Lấy thông tin user hiện tại
   */
  static user() {
    return user.value
  }

  /**
   * Kiểm tra user chưa đăng nhập (guest)
   */
  static guest() {
    return !isAuthenticated.value
  }

  /**
   * Lấy role của user
   */
  static role() {
    return userRole.value
  }

  /**
   * Kiểm tra user có role admin không
   */
  static isAdmin() {
    return userRole.value === 'admin'
  }

  /**
   * Kiểm tra user có role user không
   */
  static isUser() {
    return userRole.value === 'user'
  }

  /**
   * Kiểm tra user có permission không
   */
  static can(permission) {
    if (!user.value || !user.value.permissions) return false
    return user.value.permissions.includes(permission)
  }

  /**
   * Kiểm tra user có role không
   */
  static hasRole(role) {
    if (!user.value || !user.value.roles) return false
    return user.value.roles.includes(role)
  }

  /**
   * Khởi tạo auth state từ cookie
   */
  static async init() {
    const token = this.getTokenFromCookie()
    const storedUser = localStorage.getItem('user')
    const storedRole = localStorage.getItem('userRole')

    if (token && storedUser) {
      try {
        // Thử lấy thông tin user từ API
        const apiClient = useApiClient()
        const response = await apiClient.get('/api/me')

        if (response.data.success) {
          // Cập nhật state
          isAuthenticated.value = true
          user.value = response.data.data
          userRole.value = response.data.data.role
          
          // Cập nhật localStorage cho user info
          localStorage.setItem('user', JSON.stringify(response.data.data))
          localStorage.setItem('userRole', response.data.data.role)
          
          return true
        } else {
          // Token không hợp lệ, chỉ xóa state, không gọi logout API
          isAuthenticated.value = false
          user.value = null
          userRole.value = ''
          this.removeTokenFromCookie()
          localStorage.removeItem('user')
          localStorage.removeItem('userRole')
          return false
        }
      } catch (error) {
        console.error('Auth init error:', error)
        // Chỉ xóa state, không gọi logout API
        isAuthenticated.value = false
        user.value = null
        userRole.value = ''
        this.removeTokenFromCookie()
        localStorage.removeItem('user')
        localStorage.removeItem('userRole')
        return false
      }
    } else if (storedUser) {
      // Có user data nhưng không có token, chỉ xóa state
      isAuthenticated.value = false
      user.value = null
      userRole.value = ''
      this.removeTokenFromCookie()
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      return false
    }

    return false
  }

  /**
   * Đăng nhập
   */
  static async login(credentials) {
    try {
      const apiClient = useApiClient()
      const response = await apiClient.post('/api/login', credentials)

      if (response.data.success) {
        // Cập nhật state
        isAuthenticated.value = true
        
        // Lưu token vào cookie
        if (response.data.data.token) {
          Auth.setTokenToCookie(response.data.data.token)
        }

        // Lấy thông tin user
        await Auth.fetchUserInfo()
        
        return { success: true, data: response.data.data }
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Đăng nhập thất bại',
          errors: response.data.errors
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Lỗi kết nối' }
    }
  }

  /**
   * Đăng xuất
   */
  static async logout() {
    try {
      const apiClient = useApiClient()
      await apiClient.post('/api/logout')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Xóa state
      isAuthenticated.value = false
      user.value = null
      userRole.value = ''
      
      // Xóa cookie và localStorage
      Auth.removeTokenFromCookie()
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
    }
  }

  /**
   * Lấy thông tin user từ API
   */
  static async fetchUserInfo() {
    try {
      const apiClient = useApiClient()
      const response = await apiClient.get('/api/me')

      if (response.data.success) {
        user.value = response.data.data
        userRole.value = response.data.data.role
        
        localStorage.setItem('user', JSON.stringify(response.data.data))
        localStorage.setItem('userRole', response.data.data.role)
        
        return true
      }
      return false
    } catch (error) {
      console.error('Fetch user info error:', error)
      return false
    }
  }

  /**
   * Đổi mật khẩu
   */
  static async changePassword(passwordData) {
    try {
      const token = Auth.getTokenFromCookie()
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || 'Đổi mật khẩu thất bại' }
      }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, message: 'Lỗi kết nối' }
    }
  }
}

// Reactive state cho Vue
const authState = {
  isAuthenticated: computed(() => isAuthenticated.value),
  user: computed(() => user.value),
  userRole: computed(() => userRole.value),
  isAdmin: computed(() => userRole.value === 'admin'),
  isUser: computed(() => userRole.value === 'user')
}

export { Auth, authState } 