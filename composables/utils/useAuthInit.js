import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

export function useAuthInit() {
  const isClientReady = ref(false)
  const authStore = useAuthStore()

  onMounted(() => {
    // Đánh dấu client đã sẵn sàng
    isClientReady.value = true
  })

  // Computed để kiểm tra xem có nên render auth-dependent content không
  const shouldRenderAuthContent = computed(() => {
    // Chỉ render khi client đã sẵn sàng và auth đã được khởi tạo
    return isClientReady.value && authStore.isInitialized
  })

  // Computed để lấy trạng thái auth an toàn
  const safeAuthState = computed(() => {
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