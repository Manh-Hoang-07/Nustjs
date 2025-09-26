import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'

// ===== TYPES =====

interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
  status: 'active' | 'inactive' | 'pending'
  role?: string
  avatar?: string
}

interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role?: string
}

interface UpdateUserData {
  name?: string
  email?: string
  role?: string
  status?: 'active' | 'inactive' | 'pending'
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

// ===== STORE =====

export const useUserStore = defineStore('user', () => {
  // State
  const users: Ref<User[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  // Getters
  const getUserById: ComputedRef<(id: number) => User | undefined> = computed(() => {
    return (id: number) => users.value.find(user => user.id === id)
  })

  const totalUsers: ComputedRef<number> = computed(() => users.value.length)

  const activeUsers: ComputedRef<User[]> = computed(() => {
    return users.value.filter(user => user.status !== 'inactive')
  })

  const inactiveUsers: ComputedRef<User[]> = computed(() => {
    return users.value.filter(user => user.status === 'inactive')
  })

  const usersByRole: ComputedRef<(role: string) => User[]> = computed(() => {
    return (role: string) => users.value.filter(user => user.role === role)
  })

  // Actions
  const fetchUsers = async (): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call - replace with actual Laravel API endpoint
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Không thể tải dữ liệu người dùng')
      
      const data: ApiResponse<User[]> = await response.json()
      users.value = data.data || []
    } catch (err: any) {
      error.value = err.message
      // Fallback data for demo
      users.value = [
        { 
          id: 1, 
          name: 'Nguyễn Văn A', 
          email: 'nguyenvana@example.com', 
          created_at: '2024-01-15', 
          updated_at: '2024-01-15',
          status: 'active',
          role: 'admin'
        },
        { 
          id: 2, 
          name: 'Trần Thị B', 
          email: 'tranthib@example.com', 
          created_at: '2024-01-16', 
          updated_at: '2024-01-16',
          status: 'active',
          role: 'user'
        },
        { 
          id: 3, 
          name: 'Lê Văn C', 
          email: 'levanc@example.com', 
          created_at: '2024-01-17', 
          updated_at: '2024-01-17',
          status: 'inactive',
          role: 'user'
        }
      ]
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
      // Simulate API call
      const newUser: User = {
        id: Math.max(...users.value.map(u => u.id), 0) + 1,
        ...userData,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        status: 'active'
      }
      
      users.value.push(newUser)
      return newUser
    } catch (err: any) {
      error.value = 'Không thể tạo người dùng'
      throw err
    }
  }

  const updateUser = async (id: number, userData: UpdateUserData): Promise<User> => {
    try {
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = { 
          ...users.value[index], 
          ...userData,
          updated_at: new Date().toISOString().split('T')[0]
        }
        return users.value[index]
      }
      throw new Error('Không tìm thấy người dùng')
    } catch (err: any) {
      error.value = 'Không thể cập nhật người dùng'
      throw err
    }
  }

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value.splice(index, 1)
        return true
      }
      throw new Error('Không tìm thấy người dùng')
    } catch (err: any) {
      error.value = 'Không thể xóa người dùng'
      throw err
    }
  }

  const toggleUserStatus = async (id: number): Promise<User> => {
    try {
      const user = users.value.find(u => u.id === id)
      if (!user) throw new Error('Không tìm thấy người dùng')
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      return await updateUser(id, { status: newStatus })
    } catch (err: any) {
      error.value = 'Không thể thay đổi trạng thái người dùng'
      throw err
    }
  }

  const searchUsers = (query: string): User[] => {
    if (!query.trim()) return users.value
    
    const lowercaseQuery = query.toLowerCase()
    return users.value.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    )
  }

  const getUsersByStatus = (status: 'active' | 'inactive' | 'pending'): User[] => {
    return users.value.filter(user => user.status === status)
  }

  const clearError = (): void => {
    error.value = null
  }

  const resetStore = (): void => {
    users.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    users,
    loading,
    error,
    
    // Getters
    getUserById,
    totalUsers,
    activeUsers,
    inactiveUsers,
    usersByRole,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    searchUsers,
    getUsersByStatus,
    clearError,
    resetStore
  }
})
