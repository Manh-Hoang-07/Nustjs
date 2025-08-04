import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const apiClient = useApiClient()
  // State
  const isAuthenticated = ref(false)
  const user = ref(null)
  const userRole = ref('')
  const isFetchingUser = ref(false)
  const lastFetchTime = ref(0)
  const fetchCacheDuration = 30000 // Cache trong 30 giây

  // Getters
  const isAdmin = computed(() => userRole.value === 'admin')
  const isUser = computed(() => userRole.value === 'user')

  // Helper function để lưu token vào cookie
  const setTokenToCookie = (token, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `auth_token=${encodeURIComponent(token)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  // Helper function để xóa token khỏi cookie
  const removeTokenFromCookie = () => {
    document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
  }

  // Actions
  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/api/login', credentials)

      if (response.data.success) {
        isAuthenticated.value = true
        
        // Lưu token vào cookie
        if (response.data.data.token) {
          setTokenToCookie(response.data.data.token)
        }
        
        await fetchUserInfo()
        return { success: true, data: response.data.data }
      } else {
        return { success: false, message: response.data.message || 'Đăng nhập thất bại' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Lỗi kết nối' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/api/register', userData)

      if (response.data.success) {
        return { success: true, data: response.data.data }
      } else {
        return { success: false, message: response.data.message || 'Đăng ký thất bại' }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: 'Lỗi kết nối' }
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/api/logout')
    } catch (error) {
      console.error('Logout API error:', error)
    }
    
    // Xóa state
    isAuthenticated.value = false
    user.value = null
    userRole.value = ''
    lastFetchTime.value = 0
    
    // Xóa token khỏi cookie
    removeTokenFromCookie()
  }

  const fetchUserInfo = async (force = false) => {
    // Kiểm tra cache
    const now = Date.now()
    if (!force && isFetchingUser.value) {
      return // Đang fetch, không fetch nữa
    }
    
    if (!force && lastFetchTime.value && (now - lastFetchTime.value) < fetchCacheDuration) {
      return // Cache còn hiệu lực
    }

    try {
      isFetchingUser.value = true
      const response = await apiClient.get('/api/me')
      
      if (response.data.success) {
        user.value = response.data.data
        userRole.value = response.data.data.role || 'user'
        isAuthenticated.value = true
        lastFetchTime.value = now
      } else {
        // Token không hợp lệ
        isAuthenticated.value = false
        user.value = null
        userRole.value = ''
      }
    } catch (error) {
      console.error('Fetch user info error:', error)
      isAuthenticated.value = false
      user.value = null
      userRole.value = ''
    } finally {
      isFetchingUser.value = false
    }
  }

  const checkAuth = async () => {
    if (isAuthenticated.value && user.value) {
      return true
    }
    
    await fetchUserInfo()
    return isAuthenticated.value
  }

  const refreshUserInfo = async () => {
    await fetchUserInfo(true)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await $fetch('/api/profile', {
        method: 'PUT',
        body: profileData
      })

      if (response.success) {
        user.value = { ...user.value, ...response.data }
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.message || 'Cập nhật thất bại' }
      }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, message: 'Lỗi kết nối' }
    }
  }

  const changePassword = async (passwordData) => {
    try {
      const response = await $fetch('/api/change-password', {
        method: 'POST',
        body: passwordData
      })

      if (response.success) {
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Đổi mật khẩu thất bại' }
      }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, message: 'Lỗi kết nối' }
    }
  }

  // Demo methods for testing
  const loginAsAdmin = () => {
    isAuthenticated.value = true
    user.value = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    }
    userRole.value = 'admin'
  }

  const loginAsUser = () => {
    isAuthenticated.value = true
    user.value = {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user'
    }
    userRole.value = 'user'
  }

  return {
    // State
    isAuthenticated,
    user,
    userRole,
    isFetchingUser,
    
    // Getters
    isAdmin,
    isUser,
    
    // Actions
    login,
    register,
    logout,
    fetchUserInfo,
    checkAuth,
    refreshUserInfo,
    updateProfile,
    changePassword,
    loginAsAdmin,
    loginAsUser
  }
}) 