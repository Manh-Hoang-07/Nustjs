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
import { ref, computed } from 'vue';
import HeaderBar from '~/components/Layout/HeaderBar.vue';
import SidebarMenu from '~/components/Layout/SidebarMenu.vue';

const router = useRouter();
const route = useRoute();

// Đặt sidebarOpen mặc định là true
const sidebarOpen = ref(true);

function handleMenuClick() {
  if (window.innerWidth < 1024) sidebarOpen.value = false;
}

// Menu items with emoji icons
const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: '📊'
  },
  {
    name: 'Sản phẩm',
    path: '/admin/products',
    icon: '📦'
  },
  {
    name: 'Danh mục',
    path: '/admin/categories',
    icon: '📁'
  },
  {
    name: 'Thương hiệu',
    path: '/admin/brands',
    icon: '🏷️'
  },
  {
    name: 'Thuộc tính',
    path: '/admin/attributes',
    icon: '⚙️'
  },
  {
    name: 'Giá trị thuộc tính',
    path: '/admin/attribute-values',
    icon: '🔧'
  },
  {
    name: 'Đơn hàng',
    path: '/admin/orders',
    icon: '📋'
  },
  {
    name: 'Người dùng',
    path: '/admin/users',
    icon: '👥'
  },
  {
    name: 'Quyền',
    path: '/admin/permissions',
    icon: '🔑'
  },
  {
    name: 'Quản lý vai trò',
    path: '/admin/roles',
    icon: '👤'
  },
  {
    name: 'Kho hàng',
    path: '/admin/warehouses',
    icon: '🏪'
  },
  {
    name: 'Quản lý Tồn kho',
    path: '/admin/inventory',
    icon: '📦'
  },
  {
    name: 'Vận chuyển',
    icon: '🚚',
    children: [
      {
        name: 'Tích hợp api',
        path: '/admin/shipping/api',
        icon: '🔌'
      },
      {
        name: 'Dịch vụ vận chuyển',
        path: '/admin/shipping/services',
        icon: '🚛'
      },
      {
        name: 'Zone Mapping',
        path: '/admin/shipping/zones',
        icon: '🗺️'
      },
      {
        name: 'Quy tắc giá',
        path: '/admin/shipping/pricing',
        icon: '💰'
      },
      {
        name: 'Khuyến mãi',
        path: '/admin/shipping/promotions',
        icon: '🎉'
      },
      {
        name: 'Giao hàng',
        path: '/admin/shipping/delivery',
        icon: '📮'
      },
      {
        name: 'Nâng cao',
        path: '/admin/shipping/advanced',
        icon: '⚡'
      }
    ]
  },
  {
    name: 'Báo cáo',
    path: '/admin/reports',
    icon: '📈'
  },
  {
    name: 'Cài đặt',
    path: '/admin/settings',
    icon: '⚙️'
  }
];

// Dynamic page title
const pageTitle = computed(() => {
  const currentItem = menuItems.find(item => item.path === route.path);
  return currentItem ? currentItem.name : 'Admin Panel';
});

const userName = 'Admin User'; // Có thể lấy từ store hoặc props sau này

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  navigateTo('/');
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
