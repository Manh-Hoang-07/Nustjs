<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 w-64 h-screen overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out',
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-6 border-b border-slate-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <span class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AdminHub
        </span>
      </div>
      <button 
        @click="$emit('close')"
        class="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <slot name="menu-header"></slot>
      
      <!-- Menu Items -->
      <div v-for="item in menuItemsArray" :key="item.name">
        <!-- Menu with children -->
        <button
          v-if="item.children"
          @click="toggleSubmenu(item.name)"
          :class="[
            'group flex items-center w-full justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[48px]',
            'hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white',
            'hover:shadow-lg hover:scale-105',
            (expandedMenus.includes(item.name) || isSubmenuActive(item))
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
              : 'text-slate-300'
          ]"
        >
          <div class="flex items-center w-full truncate">
            <span class="w-5 h-5 mr-3 transition-transform duration-200 text-center">{{ item.icon }}</span>
            <span class="truncate" :title="item.name">{{ item.name }}</span>
          </div>
          <svg 
            :class="[
              'w-4 h-4 transition-transform duration-200 ml-2',
              expandedMenus.includes(item.name) ? 'rotate-180' : ''
            ]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <!-- Submenu -->
        <div 
          v-if="item.children"
          v-show="expandedMenus.includes(item.name)"
          class="ml-6 space-y-1 transition-all duration-200"
        >
          <NuxtLink 
            v-for="child in item.children" 
            :key="child.path"
            :to="child.path" 
            :prefetch="false"
            @click="() => { $emit('select', child); router.push(child.path) }"
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              'hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white',
              'hover:shadow-md hover:scale-105',
                           route.path === child.path 
               ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-md scale-105' 
               : 'text-slate-400'
            ]"
          >
            <span class="w-4 h-4 mr-3 transition-transform duration-200 text-center">{{ child.icon }}</span>
            <span class="truncate" :title="child.name">{{ child.name }}</span>
                         <div v-if="route.path === child.path" class="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
           </NuxtLink>
        </div>
        <!-- Menu without children -->
        <NuxtLink 
          v-else
          :to="item.path" 
          :prefetch="false"
          @click="() => { $emit('select', item); router.push(item.path) }"
          :class="[
            'group flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[48px]',
            'hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white',
            'hover:shadow-lg hover:scale-105',
                         route.path === item.path 
               ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
               : 'text-slate-300'
          ]"
        >
          <span class="w-5 h-5 mr-3 transition-transform duration-200 text-center">{{ item.icon }}</span>
          <span class="truncate" :title="item.name">{{ item.name }}</span>
                     <div v-if="route.path === item.path" class="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
         </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  menuItems: { type: [Array, Object], required: true },
  activePath: { type: String, required: true },
  sidebarOpen: { type: Boolean, default: true }
})

const route = useRoute()
const router = useRouter()

const expandedMenus = ref([])

// Handle menuItems (could be computed or array)
const menuItemsArray = computed(() => {
  return Array.isArray(props.menuItems) ? props.menuItems : props.menuItems.value || []
})

const toggleSubmenu = (menuName) => {
  const index = expandedMenus.value.indexOf(menuName)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(menuName)
  }
}

const isSubmenuActive = (item) => {
  if (!item.children) return false
  return item.children.some(child => child.path === route.path)
}

// Auto-expand submenu if current path is in it
const currentSubmenu = computed(() => {
  for (const item of menuItemsArray.value) {
    if (item.children && item.children.some(child => child.path === route.path)) {
      return item.name
    }
  }
  return null
})

// Auto-expand submenu on mount
onMounted(() => {
  if (currentSubmenu.value && !expandedMenus.value.includes(currentSubmenu.value)) {
    expandedMenus.value.push(currentSubmenu.value)
  }
})


</script>

<style scoped>
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
</style> 
