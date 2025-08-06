<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Check authentication on app start - call immediately
await authStore.checkAuth()

// Also check on mount for safety
onMounted(() => {
  authStore.checkAuth()
})

const handleLogout = async () => {
  await authStore.logout()
  await navigateTo('/login')
}
</script>

<style>
/* Custom component styles */
.btn {
  @apply px-4 py-2 rounded-lg transition-colors text-sm font-medium;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn-success {
  @apply bg-green-500 text-white hover:bg-green-600;
}

.btn-danger {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.nav-link {
  @apply text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium;
}

.nav-link-active {
  @apply text-blue-600;
}
</style> 