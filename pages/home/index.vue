<template>

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="animate-bounce mb-6">
            <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Chào mừng đến với
            <span class="block text-yellow-300 animate-pulse">E-Commerce Platform</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Nền tảng thương mại điện tử hiện đại với đầy đủ tính năng quản lý, báo cáo thông minh và trải nghiệm người dùng tuyệt vời
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <NuxtLink to="/auth/register" class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Bắt đầu ngay
            </NuxtLink>
            <NuxtLink to="/home/about" class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Tìm hiểu thêm
            </NuxtLink>
          </div>
          
          <!-- Stats preview -->
          <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-300">1000+</div>
              <div class="text-sm text-blue-100">Sản phẩm</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-300">500+</div>
              <div class="text-sm text-blue-100">Đơn hàng</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-300">100+</div>
              <div class="text-sm text-blue-100">Khách hàng</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories & Search Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Danh mục sản phẩm</h2>
          <p class="text-lg text-gray-600">Khám phá các danh mục sản phẩm đa dạng</p>
        </div>
        
        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto mb-12">
          <div class="relative">
            <input 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text" 
              placeholder="Tìm kiếm sản phẩm theo tên, danh mục..." 
              class="w-full px-6 py-4 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <button 
              @click="handleSearch"
              class="absolute inset-y-0 right-0 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        
        <!-- Categories Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <NuxtLink 
            v-for="(category, index) in categories" 
            :key="category.name"
            :to="category.path"
            class="group rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer border"
            :class="getCategoryClasses(index)"
          >
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                 :class="getCategoryIconClasses(index)">
              <span class="text-2xl">{{ category.icon }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ getRandomProductCount() }} sản phẩm</p>
          </NuxtLink>
        </div>
        
        <!-- View All Categories Button -->
        <div class="text-center mt-8">
          <button class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            Xem tất cả danh mục
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">Khám phá những tính năng mạnh mẽ giúp doanh nghiệp của bạn phát triển</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 border border-blue-200">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-4">Quản lý sản phẩm</h3>
            <p class="text-gray-600 leading-relaxed">Quản lý danh mục sản phẩm, thuộc tính và biến thể một cách dễ dàng với giao diện trực quan</p>
          </div>

          <!-- Feature 2 -->
          <div class="group text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 border border-green-200">
            <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-4">Quản lý đơn hàng</h3>
            <p class="text-gray-600 leading-relaxed">Theo dõi và xử lý đơn hàng với hệ thống thông báo thông minh và báo cáo chi tiết</p>
          </div>

          <!-- Feature 3 -->
          <div class="group text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 border border-purple-200">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-4">Quản lý người dùng</h3>
            <p class="text-gray-600 leading-relaxed">Phân quyền và quản lý người dùng với hệ thống bảo mật cao và kiểm soát truy cập</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Showcase -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
          <p class="text-xl text-gray-600">Khám phá những sản phẩm chất lượng cao</p>
        </div>
        
        <div class="grid md:grid-cols-4 gap-6">
          <!-- Product 1 -->
          <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sản phẩm 1</h3>
              <p class="text-gray-600 text-sm mb-4">Mô tả sản phẩm chất lượng cao</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-blue-600">$99</span>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          <!-- Product 2 -->
          <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sản phẩm 2</h3>
              <p class="text-gray-600 text-sm mb-4">Sản phẩm với thiết kế hiện đại</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-green-600">$149</span>
                <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          <!-- Product 3 -->
          <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sản phẩm 3</h3>
              <p class="text-gray-600 text-sm mb-4">Sản phẩm cao cấp với chất lượng tốt</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-purple-600">$199</span>
                <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          <!-- Product 4 -->
          <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sản phẩm 4</h3>
              <p class="text-gray-600 text-sm mb-4">Sản phẩm được yêu thích nhất</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-pink-600">$299</span>
                <button class="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Tin tức mới nhất</h2>
          <p class="text-xl text-gray-600">Cập nhật những thông tin mới nhất về công nghệ và xu hướng</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- News 1 -->
          <div class="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                15 tháng 1, 2024
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Hướng dẫn xây dựng ứng dụng Vue.js từ cơ bản đến nâng cao</h3>
              <p class="text-gray-600 text-sm mb-4">Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng một ứng dụng Vue.js hoàn chỉnh từ những khái niệm cơ bản nhất...</p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-blue-600 font-medium">8 phút đọc</span>
                <NuxtLink to="/home/posts/huong-dan-xay-dung-ung-dung-vue-js-tu-co-ban-den-nang-cao" class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                  Đọc thêm →
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- News 2 -->
          <div class="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200">
            <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                14 tháng 1, 2024
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Tối ưu hóa hiệu suất React với useMemo và useCallback</h3>
              <p class="text-gray-600 text-sm mb-4">Tìm hiểu cách sử dụng useMemo và useCallback để tối ưu hóa hiệu suất của ứng dụng React, tránh re-render không cần thiết...</p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-green-600 font-medium">6 phút đọc</span>
                <NuxtLink to="/home/posts/toi-uu-hoa-hieu-suat-react-voi-usememo-va-usecallback" class="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
                  Đọc thêm →
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- News 3 -->
          <div class="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200">
            <div class="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                13 tháng 1, 2024
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Xây dựng API RESTful với Node.js và Express</h3>
              <p class="text-gray-600 text-sm mb-4">Hướng dẫn chi tiết cách xây dựng một API RESTful hoàn chỉnh sử dụng Node.js và Express framework...</p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-purple-600 font-medium">10 phút đọc</span>
                <NuxtLink to="/home/posts/xay-dung-api-restful-voi-node-js-va-express" class="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
                  Đọc thêm →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <!-- View All News Button -->
        <div class="text-center mt-8">
          <NuxtLink to="/home/posts" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            Xem tất cả tin tức
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-4">Đăng ký nhận tin tức</h2>
        <p class="text-xl text-blue-100 mb-8">Nhận thông tin mới nhất về tính năng và cập nhật từ chúng tôi</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Nhập email của bạn" 
            class="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
          <button class="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
            Đăng ký
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div class="group">
            <div class="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">1000+</div>
            <div class="text-gray-600 font-medium">Sản phẩm</div>
          </div>
          <div class="group">
            <div class="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div class="text-gray-600 font-medium">Đơn hàng</div>
          </div>
          <div class="group">
            <div class="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
            <div class="text-gray-600 font-medium">Khách hàng</div>
          </div>
          <div class="group">
            <div class="text-4xl font-bold text-yellow-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div class="text-gray-600 font-medium">Hỗ trợ</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-4">Sẵn sàng bắt đầu?</h2>
        <p class="text-xl text-blue-100 mb-8">Tham gia ngay để trải nghiệm nền tảng thương mại điện tử hiện đại</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register" class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Đăng ký miễn phí
          </NuxtLink>
          <NuxtLink to="/auth/login" class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
            Đăng nhập
          </NuxtLink>
        </div>
      </div>
    </section>

</template>

<script setup>
import { useUserNavigation } from '../../composables/navigation/useUserNavigation.js'

// Page meta
definePageMeta({
  layout: 'home',
  title: 'Trang chủ - E-Commerce Platform',
  description: 'Nền tảng thương mại điện tử hiện đại với đầy đủ tính năng quản lý'
})

// Sử dụng auth store
const authStore = useAuthStore()

// Sử dụng user navigation composable
const { 
  menuItems: navigationItems,
  getBreadcrumb,
  searchInMenuItems 
} = useUserNavigation()

// Reactive auth state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const userRole = computed(() => authStore.userRole)

// Breadcrumb cho trang hiện tại
const breadcrumb = computed(() => getBreadcrumb())

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  await navigateTo('/auth/login')
}

// Tìm kiếm sản phẩm
const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/home/products?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

// Lấy danh mục sản phẩm từ navigation
const categories = computed(() => {
  const categoryItem = navigationItems.value.find(item => item.name === 'Danh mục')
  return categoryItem?.children || []
})

// Helper functions cho categories
const getCategoryClasses = (index) => {
  const colorClasses = [
    'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200',
    'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200',
    'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200',
    'bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-yellow-200',
    'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200'
  ]
  return colorClasses[index % colorClasses.length]
}

const getCategoryIconClasses = (index) => {
  const iconClasses = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'bg-gradient-to-r from-red-500 to-red-600'
  ]
  return iconClasses[index % iconClasses.length]
}

const getRandomProductCount = () => {
  const counts = ['1,234', '2,156', '987', '756', '543', '1,890', '2,345', '1,567']
  return counts[Math.floor(Math.random() * counts.length)]
}
</script>

<style scoped>
/* Custom styles for the homepage */
.hero-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
