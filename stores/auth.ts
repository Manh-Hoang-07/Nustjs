import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

// ===== TYPES =====

interface User {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
  avatar?: string
  created_at: string
  updated_at: string
}

interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface ProfileData {
  name?: string
  email?: string
  avatar?: File
}

interface PasswordData {
  current_password: string
  password: string
  password_confirmation: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

interface AuthResult {
  success: boolean
  data?: any
  message?: string
}

// ===== STORE =====

export const useAuthStore = defineStore('auth', () => {
  const { apiClient } = useApiClient()
  
  // State
  const isAuthenticated: Ref<boolean> = ref(false)
  const user: Ref<User | null> = ref(null)
  const userRole: Ref<string> = ref('')
  const userPermissions: Ref<string[]> = ref([])
  const isFetchingUser: Ref<boolean> = ref(false)
  const lastFetchTime: Ref<number> = ref(0)
  const fetchCacheDuration = 30000 // Cache trong 30 giây
  const isInitialized: Ref<boolean> = ref(false) // Flag để đánh dấu đã khởi tạo

  // Getters
  const isAdmin: ComputedRef<boolean> = computed(() => userRole.value === 'admin')
  const isUser: ComputedRef<boolean> = computed(() => userRole.value === 'user')
  
  // Permission getters
  const can = (permission: string): boolean => {
    if (!userPermissions.value || !Array.isArray(userPermissions.value)) return false
    return userPermissions.value.includes(permission)
  }
  
  const canAny = (permissions: string[]): boolean => {
    if (!Array.isArray(permissions)) return false
    return permissions.some(permission => can(permission))
  }
  
  const canAll = (permissions: string[]): boolean => {
    if (!Array.isArray(permissions)) return false
    return permissions.every(permission => can(permission))
  }

  // Helper function để lấy token từ cookie
  const getTokenFromCookie = (): string | null => {
    if (process.client) {
      const cookies = document.cookie.split(';')
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'auth_token') {
          return decodeURIComponent(value)
        }
      }
    }
    return null
  }

  // Helper function để lưu token vào cookie
  const setTokenToCookie = (token: string, days: number = 7): void => {
    if (process.client) {
      const expires = new Date()
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
      document.cookie = `auth_token=${encodeURIComponent(token)};expires=${expires.toUTCString()};path=/;SameSite=Strict`
    }
  }

  // Helper function để xóa token khỏi cookie
  const removeTokenFromCookie = (): void => {
    if (process.client) {
      document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
    }
  }

  // Actions
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
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
    } catch (error: any) {
      // Enhanced error handling
      if (error.response?.status === 401) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng' }
      } else if (error.response?.status === 422) {
        return { success: false, message: 'Dữ liệu không hợp lệ' }
      } else if (error.code === 'ECONNABORTED') {
        return { success: false, message: 'Kết nối bị timeout, vui lòng thử lại' }
      } else if (!error.response) {
        return { success: false, message: 'Không thể kết nối đến server' }
      }
      
      return { success: false, message: error.userMessage || 'Lỗi kết nối' }
    }
  }

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      const response = await apiClient.post('/api/register', userData)

      if (response.data.success) {
        return { success: true, data: response.data.data }
      } else {
        return { success: false, message: response.data.message || 'Đăng ký thất bại' }
      }
    } catch (error: any) {
      // Enhanced error handling
      if (error.response?.status === 422) {
        return { success: false, message: 'Dữ liệu không hợp lệ' }
      } else if (error.response?.status === 409) {
        return { success: false, message: 'Email đã tồn tại' }
      } else if (error.code === 'ECONNABORTED') {
        return { success: false, message: 'Kết nối bị timeout, vui lòng thử lại' }
      } else if (!error.response) {
        return { success: false, message: 'Không thể kết nối đến server' }
      }
      
      return { success: false, message: error.userMessage || 'Lỗi kết nối' }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post('/api/logout')
    } catch (error) {
      // Ignore logout errors
    }
    
    // Xóa state
    isAuthenticated.value = false
    user.value = null
    userRole.value = ''
    userPermissions.value = []
    lastFetchTime.value = 0
    
    // Xóa token khỏi cookie và localStorage
    removeTokenFromCookie()
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('userPermissions')
    }
  }

  const fetchUserInfo = async (force: boolean = false): Promise<void> => {
    try {
      isFetchingUser.value = true
      
      // Kiểm tra token trước
      const token = getTokenFromCookie()
      
      if (!token) {
        isAuthenticated.value = false
        user.value = null
        userRole.value = ''
        return
      }
      
      const response = await apiClient.get('/api/me')
      
      if (response.data.success) {
        user.value = response.data.data
        userRole.value = response.data.data.role || 'user'
        userPermissions.value = response.data.data.permissions || []
        isAuthenticated.value = true
        lastFetchTime.value = Date.now()
        
        // Lưu vào localStorage cho offline access
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(response.data.data))
          localStorage.setItem('userPermissions', JSON.stringify(response.data.data.permissions || []))
        }
      } else {
        // Token không hợp lệ
        isAuthenticated.value = false
        user.value = null
        userRole.value = ''
        userPermissions.value = []
        removeTokenFromCookie()
      }
    } catch (error: any) {
      // Handle specific errors
      if (error.response?.status === 401) {
        // Token expired or invalid
        isAuthenticated.value = false
        user.value = null
        userRole.value = ''
        userPermissions.value = []
        removeTokenFromCookie()
        if (process.client) {
          localStorage.removeItem('user')
          localStorage.removeItem('userPermissions')
        }
      } else if (error.response?.status === 403) {
        // User not authorized
        isAuthenticated.value = false
        user.value = null
        userRole.value = ''
        userPermissions.value = []
        if (process.client) {
          localStorage.removeItem('user')
          localStorage.removeItem('userPermissions')
        }
      }
    } finally {
      isFetchingUser.value = false
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    // Đánh dấu đã khởi tạo
    isInitialized.value = true
    
    // Kiểm tra token trong cookie trước
    const token = getTokenFromCookie()
    if (!token) {
      isAuthenticated.value = false
      user.value = null
      userRole.value = ''
      userPermissions.value = []
      return false
    }

    // Nếu đã có user info và chưa hết hạn cache, không cần gọi API
    if (isAuthenticated.value && user.value && (Date.now() - lastFetchTime.value) < fetchCacheDuration) {
      return true
    }
    
    await fetchUserInfo()
    return isAuthenticated.value
  }

  const refreshUserInfo = async (): Promise<void> => {
    await fetchUserInfo(true)
  }

  const updateProfile = async (profileData: ProfileData): Promise<AuthResult> => {
    try {
      const response = await $fetch('/api/profile', {
        method: 'PUT',
        body: profileData
      })

      if (response.success) {
        user.value = { ...user.value, ...response.data } as User
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.message || 'Cập nhật thất bại' }
      }
    } catch (error: any) {
      return { success: false, message: error.userMessage || 'Lỗi cập nhật' }
    }
  }

  const changePassword = async (passwordData: PasswordData): Promise<AuthResult> => {
    try {
      const response = await $fetch('/api/change-password', {
        method: 'POST',
        body: passwordData
      })

      if (response.success) {
        return { success: true, message: 'Đổi mật khẩu thành công' }
      } else {
        return { success: false, message: response.message || 'Đổi mật khẩu thất bại' }
      }
    } catch (error: any) {
      return { success: false, message: error.userMessage || 'Lỗi đổi mật khẩu' }
    }
  }

  // Initialize auth from localStorage
  const initFromStorage = async (): Promise<boolean> => {
    if (process.client) {
      const token = getTokenFromCookie()
      const storedUser = localStorage.getItem('user')
      const storedPermissions = localStorage.getItem('userPermissions')

      if (token && storedUser) {
        try {
          // Thử lấy thông tin user từ API để verify token
          const response = await apiClient.get('/api/me')

          if (response.data.success) {
            // Cập nhật state
            isAuthenticated.value = true
            user.value = response.data.data
            userRole.value = response.data.data.role || 'user'
            userPermissions.value = response.data.data.permissions || []
            
            // Cập nhật localStorage
            localStorage.setItem('user', JSON.stringify(response.data.data))
            localStorage.setItem('userPermissions', JSON.stringify(response.data.data.permissions || []))
            
            return true
          } else {
            // Token không hợp lệ, xóa state
            clearAuthState()
            return false
          }
        } catch (error) {
          console.error('Auth init error:', error)
          // Fallback: sử dụng data từ localStorage nếu API fail
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            isAuthenticated.value = true
            user.value = userData
            userRole.value = userData.role || 'user'
            userPermissions.value = JSON.parse(storedPermissions || '[]')
            return true
          } else {
            clearAuthState()
            return false
          }
        }
      } else if (storedUser) {
        // Có user data nhưng không có token, xóa state
        clearAuthState()
        return false
      }
    }
    return false
  }

  // Clear auth state
  const clearAuthState = (): void => {
    isAuthenticated.value = false
    user.value = null
    userRole.value = ''
    userPermissions.value = []
    removeTokenFromCookie()
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('userPermissions')
    }
  }

  // Static methods for easy access
  const Auth = {
    // State getters
    get isAuthenticated() { return isAuthenticated.value },
    get user() { return user.value },
    get userRole() { return userRole.value },
    get userPermissions() { return userPermissions.value },
    get isAdmin() { return isAdmin.value },
    get isUser() { return isUser.value },
    
    // Permission methods
    can,
    canAny,
    canAll,
    
    // Auth methods
    login,
    register,
    logout,
    checkAuth,
    refreshUserInfo,
    updateProfile,
    changePassword,
    initFromStorage,
    clearAuthState,
    
    // Utility methods
    getTokenFromCookie,
    setTokenToCookie,
    removeTokenFromCookie
  }

  return {
    // State
    isAuthenticated,
    user,
    userRole,
    userPermissions,
    isFetchingUser,
    lastFetchTime,
    isInitialized,
    
    // Getters
    isAdmin,
    isUser,
    
    // Permission methods
    can,
    canAny,
    canAll,
    
    // Actions
    login,
    register,
    logout,
    fetchUserInfo,
    checkAuth,
    refreshUserInfo,
    updateProfile,
    changePassword,
    initFromStorage,
    clearAuthState,
    
    // Static methods
    Auth
  }
})
