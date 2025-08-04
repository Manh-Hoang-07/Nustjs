<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              Laravel Nuxt App
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/" 
              :class="[
                'nav-link',
                $route.path === '/' ? 'nav-link-active' : ''
              ]"
            >
              Home
            </NuxtLink>
            
            <NuxtLink 
              to="/about" 
              :class="[
                'nav-link',
                $route.path === '/about' ? 'nav-link-active' : ''
              ]"
            >
              About
            </NuxtLink>
            
            <template v-if="authStore.isAuthenticated">
              <NuxtLink 
                v-if="authStore.isAdmin"
                to="/admin" 
                :class="[
                  'nav-link',
                  $route.path.startsWith('/admin') ? 'nav-link-active' : ''
                ]"
              >
                Admin
              </NuxtLink>
              
              <button 
                @click="handleLogout" 
                class="btn btn-danger"
              >
                Logout
              </button>
            </template>
            
            <template v-else>
              <NuxtLink to="/login" class="btn btn-primary">
                Login
              </NuxtLink>
              <NuxtLink to="/register" class="btn btn-success">
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

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

// Check authentication on app start
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