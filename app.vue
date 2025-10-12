<template>
  <div id="app">
    <!-- System Config Loading -->
    <div v-if="systemConfigLoading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Đang tải cấu hình hệ thống...</p>
      </div>
    </div>
    
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useGlobalSystemConfig } from '~/composables/system-config'

// Sử dụng system config ở app level
const { loading: systemConfigLoading, systemInfo } = useGlobalSystemConfig()

// Set page title từ system config
useHead({
  title: systemInfo.value.name || 'Laravel System',
  meta: [
    { name: 'description', content: `Hệ thống ${systemInfo.value.name || 'Laravel System'} phiên bản ${systemInfo.value.version || '1.0.0'}` }
  ]
})
</script>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#app {
  min-height: 100vh;
}

/* Remove any unnecessary preload styles */
</style> 
