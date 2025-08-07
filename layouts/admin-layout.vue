<template>
  <div class="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">

    
    <!-- Sidebar -->
    <SidebarMenu
      :menu-items="menuItems"
      :active-path="route.path"
      :sidebar-open="sidebarOpen"
      @close="sidebarOpen = false"
      @select="handleMenuClick"
    >
      <template #user>
        <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ userName }}</p>
            <p class="text-xs text-slate-400 truncate">admin@example.com</p>
          </div>
        </div>
        <button 
          @click="logout"
          class="w-full mt-3 flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Đăng xuất
        </button>
      </template>
    </SidebarMenu>

    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
    ></div>

    <!-- Main content -->
    <div :class="['flex-1 flex flex-col transition-all duration-300', sidebarOpen ? 'ml-64' : '']">
      <!-- HeaderBar cố định -->
      <HeaderBar
        :title="pageTitle"
        :user-name="userName"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @logout="logout"
      />
      <!-- Page content (có padding-top để không bị header che) -->
      <main class="flex-1 pt-16">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAdminNavigation } from '../composables/navigation/useAdminNavigation.js'
import { ref, computed, onMounted } from 'vue';
import HeaderBar from '../components/Layout/Header/HeaderBar.vue';
import SidebarMenu from '../components/Layout/Sidebar/SidebarMenu.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Kiểm tra quyền truy cập
onMounted(async () => {
  // Kiểm tra xem user có đăng nhập và có quyền admin không
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    await navigateTo('/login');
    return;
  }
});

// Đặt sidebarOpen mặc định là true
const sidebarOpen = ref(true);

function handleMenuClick() {
  if (window.innerWidth < 1024) sidebarOpen.value = false;
}

// Sử dụng composable cho admin navigation
const { menuItems, currentPath, preloadOnHover } = useAdminNavigation()

// Cập nhật current path
currentPath.value = route.path

// Dynamic page title
const pageTitle = computed(() => {
  // Tìm trong menu items chính
  const currentItem = menuItems.value.find(item => item.path === route.path);
  if (currentItem) {
    return currentItem.name;
  }
  
  // Tìm trong submenu items
  for (const item of menuItems.value) {
    if (item.children) {
      const childItem = item.children.find(child => child.path === route.path);
      if (childItem) {
        return childItem.name;
      }
    }
  }
  
  return 'Admin Panel';
});

const userName = computed(() => authStore.user?.name || 'Admin User');

const logout = async () => {
  await authStore.logout();
  await navigateTo('/login');
};
</script>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style> 
