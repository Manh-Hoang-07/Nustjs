<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main content - no header, no sidebar, just the slot -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Auth layout - no header, no sidebar, no complex navigation
// This layout is specifically for login and register pages
</script>

<style scoped>
/* Simple styles for auth pages - no header, no sidebar styles */
</style> 