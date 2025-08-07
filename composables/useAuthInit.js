import { ref, onMounted } from 'vue'

/**
 * Composable để xử lý authentication initialization
 * Tránh hydration mismatch bằng cách chỉ render auth content sau khi client đã load
 */
export function useAuthInit() {
  const isClient = ref(false)
  const shouldRenderAuthContent = ref(false)
  const safeAuthState = ref({
    isAuthenticated: false,
    user: null,
    userRole: ''
  })

  onMounted(() => {
    isClient.value = true
    // Delay một chút để đảm bảo auth store đã được khởi tạo
    setTimeout(() => {
      shouldRenderAuthContent.value = true
    }, 100)
  })

  return {
    isClient,
    shouldRenderAuthContent,
    safeAuthState
  }
} 