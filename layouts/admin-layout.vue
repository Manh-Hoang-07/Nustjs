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
      <ToastContainer />
    </div>
  </div>
</template>

<script setup>
import { useAdminNavigation } from '@/composables/navigation/useAdminNavigation'
import { defineAsyncComponent, ref, computed, onMounted } from 'vue';
import ToastContainer from '@/components/Core/Feedback/ToastContainer.vue'

// Lazy load components để tăng performance
const HeaderBar = defineAsyncComponent(() => import('../components/Layout/Header/HeaderBar.vue'))
const SidebarMenu = defineAsyncComponent(() => import('../components/Layout/Sidebar/SidebarMenu.vue'))

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Kiểm tra quyền truy cập - để middleware xử lý
onMounted(async () => {
  // Middleware sẽ xử lý authentication
  // Không cần gọi API thêm ở đây
});

// Đặt sidebarOpen mặc định là true
const sidebarOpen = ref(true);

function handleMenuClick() {
  if (window.innerWidth < 1024) sidebarOpen.value = false;
}

// Sử dụng composable cho admin navigation
const { menuItems, currentPath } = useAdminNavigation()

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
  await navigateTo('/auth/login');
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
