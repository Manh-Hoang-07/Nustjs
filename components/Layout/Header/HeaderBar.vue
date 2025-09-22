<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-slate-200 h-12 flex items-center fixed top-0 left-0 right-0 z-40" style="height: 48px;">
    <div class="flex items-center justify-between h-12 px-1 lg:px-2 w-full">
      <div class="flex items-center space-x-3">
        <slot name="menu-btn">
          <!-- Hamburger button mặc định -->
          <button 
            @click="$emit('toggle-sidebar')"
            class="p-0.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </slot>
        <h1 class="text-sm font-semibold text-slate-900">{{ title }}</h1>
      </div>
      <div class="flex items-center space-x-1">
        <slot name="actions"></slot>
        
        <!-- User Dropdown -->
        <div class="relative" ref="dropdownRef">
          <button 
            @click="toggleDropdown"
            class="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors duration-200 focus:outline-none"
          >
            <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span class="text-[11px] text-slate-700 font-medium">{{ userName }}</span>
            <svg 
              class="w-3 h-3 text-slate-500 transition-transform duration-200"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
          >
            <!-- User Info -->
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="text-sm font-medium text-slate-900">{{ userName }}</p>
              <p class="text-xs text-slate-500">{{ userEmail }}</p>
            </div>
            
            <!-- Menu Items -->
            <button 
              @click="handleProfile"
              class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Thông tin cá nhân
            </button>
            
            <button 
              @click="handleSettings"
              class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Cài đặt
            </button>
            
            <div class="border-t border-slate-100 my-1"></div>
            
            <button 
              @click="handleLogout"
              class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps({
  title: { type: String, default: 'Admin Panel' },
  userName: { type: String, default: 'Admin User' }
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

// Auth store
const authStore = useAuthStore()

// Computed user email
const userEmail = computed(() => {
  return authStore.user?.email || 'admin@example.com'
})

// Dropdown state
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

// Toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Handle menu actions
const handleProfile = () => {
  isDropdownOpen.value = false
  // TODO: Navigate to profile page
}

const handleSettings = () => {
  isDropdownOpen.value = false
  // TODO: Navigate to settings page
}

const handleLogout = () => {
  isDropdownOpen.value = false
  emit('logout')
}

// Add event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
header {
  height: 48px;
}
</style> 
