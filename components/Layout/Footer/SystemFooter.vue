<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Thông tin công ty -->
        <div>
          <h3 class="text-xl font-bold mb-4">{{ siteInfo.name }}</h3>
          <p class="text-gray-300 mb-4">{{ siteInfo.description }}</p>
          <div class="space-y-2">
            <p v-if="siteInfo.email" class="flex items-center">
              <span class="mr-2">📧</span>
              {{ siteInfo.email }}
            </p>
            <p v-if="siteInfo.phone" class="flex items-center">
              <span class="mr-2">📞</span>
              {{ siteInfo.phone }}
            </p>
            <p v-if="siteInfo.address" class="flex items-center">
              <span class="mr-2">📍</span>
              {{ siteInfo.address }}
            </p>
          </div>
        </div>

        <!-- Liên kết nhanh -->
        <div>
          <h3 class="text-xl font-bold mb-4">Liên kết nhanh</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/home" class="text-gray-300 hover:text-white">Trang chủ</NuxtLink></li>
            <li><NuxtLink to="/home/about" class="text-gray-300 hover:text-white">Giới thiệu</NuxtLink></li>
            <li><NuxtLink to="/home/contact" class="text-gray-300 hover:text-white">Liên hệ</NuxtLink></li>
          </ul>
        </div>

        <!-- Mạng xã hội -->
        <div v-if="Object.keys(socialLinks).length > 0">
          <h3 class="text-xl font-bold mb-4">Mạng xã hội</h3>
          <div class="flex space-x-4">
            <a 
              v-if="socialLinks.facebook" 
              :href="socialLinks.facebook" 
              target="_blank"
              class="text-gray-300 hover:text-white"
            >
              Facebook
            </a>
            <a 
              v-if="socialLinks.twitter" 
              :href="socialLinks.twitter" 
              target="_blank"
              class="text-gray-300 hover:text-white"
            >
              Twitter
            </a>
            <a 
              v-if="socialLinks.instagram" 
              :href="socialLinks.instagram" 
              target="_blank"
              class="text-gray-300 hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isConfigLoading" class="mt-4 text-center">
        <p class="text-gray-400">Đang tải thông tin...</p>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-700 mt-8 pt-4 text-center">
        <p class="text-gray-400">
          © {{ new Date().getFullYear() }} {{ siteInfo.name }}. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useSystemConfigInfo } from '@/composables/system/useSystemConfig'

const { siteInfo, socialLinks, isConfigLoading } = useSystemConfigInfo()
</script>
