<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Cấu hình khuyến mãi vận chuyển</h1>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="space-y-6">
        <!-- Cấu hình khuyến mãi -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Cấu hình khuyến mãi</h2>
          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" id="free-shipping" class="mr-2" />
              <label for="free-shipping">Miễn phí vận chuyển cho đơn hàng trên 500k</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="discount-shipping" class="mr-2" />
              <label for="discount-shipping">Giảm 50% phí vận chuyển cho khách VIP</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="first-order" class="mr-2" />
              <label for="first-order">Miễn phí vận chuyển cho đơn hàng đầu tiên</label>
            </div>
          </div>
        </div>

        <!-- Điều kiện áp dụng -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Điều kiện áp dụng</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Giá trị đơn hàng tối thiểu (VNĐ)</label>
              <input type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Số lượng sản phẩm tối thiểu</label>
              <input type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" min="1" />
            </div>
          </div>
        </div>

        <!-- Thời gian áp dụng -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Thời gian áp dụng</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Ngày bắt đầu</label>
              <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Ngày kết thúc</label>
              <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
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
  layout: 'admin-layout',
  middleware: ['auth']
})
</script> 
