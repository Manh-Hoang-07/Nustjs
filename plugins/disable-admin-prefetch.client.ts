export default defineNuxtPlugin(() => {
  // Disable automatic prefetching for admin routes
  const router = useRouter()
  
  // Override prefetch behavior for admin routes
  const originalPrefetch = router.prefetch
  
  router.prefetch = async (to: string) => {
    // Only prefetch if it's not an admin route
    if (!to.startsWith('/admin')) {
      return originalPrefetch(to)
    }
    
    // For admin routes, disable prefetch completely
    return Promise.resolve()
  }
}) 