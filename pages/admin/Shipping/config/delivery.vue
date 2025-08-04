<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Cấu hình giao hàng</h1>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="space-y-6">
        <!-- Cấu hình thời gian giao hàng -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Thời gian giao hàng</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Thời gian giao hàng chuẩn (ngày)</label>
              <input type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" min="1" value="3" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Thời gian giao hàng nhanh (ngày)</label>
              <input type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" min="1" value="1" />
            </div>
          </div>
        </div>

        <!-- Cấu hình khu vực giao hàng -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Khu vực giao hàng</h2>
          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" id="hanoi" class="mr-2" checked />
              <label for="hanoi">Hà Nội</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="hcm" class="mr-2" checked />
              <label for="hcm">TP. Hồ Chí Minh</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="danang" class="mr-2" />
              <label for="danang">Đà Nẵng</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="other-cities" class="mr-2" />
              <label for="other-cities">Các thành phố khác</label>
            </div>
          </div>
        </div>

        <!-- Cấu hình phí giao hàng -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Phí giao hàng</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Phí giao hàng chuẩn (VNĐ)</label>
              <input type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" min="0" value="30000" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Phí giao hàng nhanh (VNĐ)</label>
              <input type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" min="0" value="50000" />
            </div>
          </div>
        </div>

        <!-- Cấu hình thời gian làm việc -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Thời gian làm việc</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Giờ bắt đầu</label>
              <input type="time" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="08:00" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Giờ kết thúc</label>
              <input type="time" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="18:00" />
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-3 pt-6">
          <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Huỷ
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script> 
