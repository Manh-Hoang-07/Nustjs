import { ref, onMounted, computed, type Ref, type ComputedRef } from 'vue'
import { useAuthStore } from '../../stores/auth'

// ===== TYPES =====

interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  isUser: boolean
  user: any
}

interface AuthInitResult {
  isClientReady: Ref<boolean>
  shouldRenderAuthContent: ComputedRef<boolean>
  safeAuthState: ComputedRef<AuthState>
}

// ===== COMPOSABLE =====

export function useAuthInit(): AuthInitResult {
  const isClientReady: Ref<boolean> = ref(false)
  const authStore = useAuthStore()

  onMounted(() => {
    // Đánh dấu client đã sẵn sàng
    isClientReady.value = true
  })

  // Computed để kiểm tra xem có nên render auth-dependent content không
  const shouldRenderAuthContent: ComputedRef<boolean> = computed(() => {
    // Chỉ render khi client đã sẵn sàng và auth đã được khởi tạo
    return isClientReady.value && authStore.isInitialized
  })

  // Computed để lấy trạng thái auth an toàn
  const safeAuthState: ComputedRef<AuthState> = computed(() => {
    if (!shouldRenderAuthContent.value) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        isUser: false,
        user: null
      }
    }
    
    return {
      isAuthenticated: authStore.isAuthenticated,
      isAdmin: authStore.isAdmin,
      isUser: authStore.isUser,
      user: authStore.user
    }
  })

  return {
    isClientReady,
    shouldRenderAuthContent,
    safeAuthState
  }
}
