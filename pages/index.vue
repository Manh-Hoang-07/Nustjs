<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">E-Commerce Platform</h1>
          </div>
          <nav class="flex space-x-8">
            <NuxtLink to="/about" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Giới thiệu
            </NuxtLink>
            
            <!-- Hiển thị navigation dựa trên trạng thái đăng nhập -->
            <template v-if="authStore.isAuthenticated">
              <NuxtLink 
                v-if="authStore.isAdmin"
                to="/admin" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin Panel
              </NuxtLink>
              <NuxtLink 
                v-else
                to="/user" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </NuxtLink>
              <button 
                @click="handleLogout" 
                class="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Đăng xuất
              </button>
            </template>
            
            <template v-else>
              <NuxtLink to="/login" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Đăng nhập
              </NuxtLink>
              <NuxtLink to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Đăng ký
              </NuxtLink>
            </template>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Chào mừng đến với
            <span class="block text-yellow-300">E-Commerce Platform</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            Nền tảng thương mại điện tử hiện đại với đầy đủ tính năng quản lý
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/register" class="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors">
              Bắt đầu ngay
            </NuxtLink>
            <NuxtLink to="/about" class="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Tìm hiểu thêm
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
          <p class="text-lg text-gray-600">Khám phá những tính năng mạnh mẽ của nền tảng</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Quản lý sản phẩm</h3>
            <p class="text-gray-600">Quản lý danh mục sản phẩm, thuộc tính và biến thể một cách dễ dàng</p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Quản lý đơn hàng</h3>
            <p class="text-gray-600">Theo dõi và xử lý đơn hàng với hệ thống thông báo thông minh</p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Quản lý người dùng</h3>
            <p class="text-gray-600">Phân quyền và quản lý người dùng với hệ thống bảo mật cao</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl font-bold text-blue-600 mb-2">1000+</div>
            <div class="text-gray-600">Sản phẩm</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div class="text-gray-600">Đơn hàng</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-600 mb-2">100+</div>
            <div class="text-gray-600">Khách hàng</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
            <div class="text-gray-600">Hỗ trợ</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Sẵn sàng bắt đầu?</h2>
        <p class="text-xl text-blue-100 mb-8">Tham gia ngay để trải nghiệm nền tảng thương mại điện tử hiện đại</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/register" class="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Đăng ký miễn phí
          </NuxtLink>
          <NuxtLink to="/login" class="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Đăng nhập
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">E-Commerce Platform</h3>
            <p class="text-gray-400">Nền tảng thương mại điện tử hiện đại với đầy đủ tính năng quản lý</p>
          </div>
          <div>
            <h4 class="text-md font-semibold mb-4">Sản phẩm</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Quản lý sản phẩm</a></li>
              <li><a href="#" class="hover:text-white">Quản lý đơn hàng</a></li>
              <li><a href="#" class="hover:text-white">Báo cáo thống kê</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-md font-semibold mb-4">Hỗ trợ</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Hướng dẫn sử dụng</a></li>
              <li><a href="#" class="hover:text-white">Liên hệ hỗ trợ</a></li>
              <li><a href="#" class="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-md font-semibold mb-4">Liên hệ</h4>
            <ul class="space-y-2 text-gray-400">
              <li>Email: support@example.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>Address: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 E-Commerce Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: 'home',
  title: 'Trang chủ - E-Commerce Platform',
  description: 'Nền tảng thương mại điện tử hiện đại với đầy đủ tính năng quản lý'
})

// Check if user is authenticated
const authStore = useAuthStore()

// Không tự động redirect nữa - để người dùng tự chọn
// onMounted(async () => {
//   // Đảm bảo auth được kiểm tra trước
//   await authStore.checkAuth()
//   
//   if (authStore.isAuthenticated) {
//     if (authStore.isAdmin) {
//       await navigateTo('/admin')
//     } else {
//       await navigateTo('/user')
//     }
//   }
// })

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  await navigateTo('/login')
}
</script>

<style scoped>
/* Custom styles for the homepage */
.hero-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
