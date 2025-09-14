<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Cài đặt Chung</h1>
      <p class="text-gray-600 mt-1">Cấu hình thông tin cơ bản của website</p>
    </div>



    <!-- Form cấu hình chung -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <div v-if="loading" class="space-y-6">
        <SkeletonLoader type="form" />
      </div>
      
      <!-- Thông báo khi chưa có dữ liệu -->
      <div v-else-if="!loading && sortedItems.length === 0" class="text-center py-8">
        <p class="text-gray-500">Không có dữ liệu cấu hình để hiển thị</p>
        <button @click="fetchData" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Tải lại dữ liệu
        </button>
      </div>
      
      <form v-else-if="sortedItems.length > 0" @submit.prevent="saveAllConfigs" class="space-y-8">
        <!-- Render form động từ dữ liệu API -->
        <div v-for="(config, index) in sortedItems" :key="config.id" class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ config.display_name }}
                <span v-if="config.is_required" class="text-red-500">*</span>
              </label>
              
              <!-- Input text/email -->
              <template v-if="config.config_type === 'string' || config.config_type === 'email'">
                <input
                  v-model="configForm[config.config_key]"
                  :type="config.config_type === 'email' ? 'email' : 'text'"
                  :placeholder="config.description || ''"
                  :required="config.is_required"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </template>
              
              <!-- Input file -->
              <template v-else-if="config.config_type === 'file'">
                <ImageUploader
                  v-model="configForm[config.config_key]"
                  :default-url="config.config_value"
                />
              </template>
              
              <!-- Checkbox boolean -->
              <template v-else-if="config.config_type === 'boolean'">
                <div class="flex items-center">
                  <input
                    v-model="configForm[config.config_key]"
                    type="checkbox"
                    :id="config.config_key"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label :for="config.config_key" class="ml-2 block text-sm text-gray-700">
                    {{ config.display_name }}
                  </label>
                </div>
              </template>
              
              <!-- Textarea cho description dài -->
              <template v-else-if="config.config_type === 'textarea'">
                <textarea
                  v-model="configForm[config.config_key]"
                  :placeholder="config.description || ''"
                  :required="config.is_required"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </template>
              
              <!-- Description -->
              <p v-if="config.description" class="text-sm text-gray-500 mt-1">
                {{ config.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Nút lưu -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving">Đang lưu...</span>
            <span v-else>Lưu cấu hình</span>
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin-layout',
  requiresAuth: true,
  requiresAdmin: true
})

import { ref, reactive, onMounted, computed } from 'vue'
import { useDataTable } from '@/composables/data/useDataTable'
import { useSystemConfig } from '@/composables/api'
import { useToast } from '@/composables/ui/useToast'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ImageUploader from '@/components/Core/Image/ImageUploader.vue'

// Use composables
const { 
  items, 
  loading, 
  pagination, 
  filters, 
  fetchData, 
  updateFilters, 
  deleteItem 
} = useDataTable('/api/admin/system-configs', {
  defaultFilters: {
    search: '',
    group: 'general',
    status: '',
    sort_by: 'created_at_desc'
  }
})

const { updateConfigsByGroup } = useSystemConfig()
const { showSuccess, showError } = useToast()

// Computed để sắp xếp items theo sort_order và lọc active
const sortedItems = computed(() => {
  if (!items.value) return []
  // Lọc chỉ các item có status = 'active' và sắp xếp theo sort_order
  return [...items.value]
    .filter(item => item.status === 'active')
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
})

// State
const selectedConfig = ref(null)
const saving = ref(false)

// Form state - sẽ được khởi tạo động từ API
const configForm = reactive({})

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Fetch data
onMounted(async () => {
  try {
    await fetchData()
    loadConfigToForm()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

// Load config data to form - khởi tạo động từ API
function loadConfigToForm() {
  if (sortedItems.value && sortedItems.value.length > 0) {
    // Xóa tất cả properties cũ
    Object.keys(configForm).forEach(key => {
      delete configForm[key]
    })
    
    // Khởi tạo form với dữ liệu từ API (chỉ các item active)
    sortedItems.value.forEach(config => {
      if (config.config_type === 'boolean') {
        // Với boolean, ưu tiên config_value trước, sau đó mới đến value
        configForm[config.config_key] = config.config_value === 'true' || config.value === true
      } else {
        // Với các kiểu khác, ưu tiên config_value (giá trị thực tế) trước
        configForm[config.config_key] = config.config_value || config.value || config.default_value || ''
      }
    })
  }
}

// Save all configs - gửi tất cả dữ liệu từ form động
async function saveAllConfigs() {
  saving.value = true
  try {
    // Gửi toàn bộ configForm object
    await updateConfigsByGroup('general', configForm)
    showSuccess('Cấu hình chung đã được lưu thành công')
    await fetchData()
  } catch (error) {
    showError('Không thể lưu cấu hình chung')
  } finally {
    saving.value = false
  }
}

// Reset form
function resetForm() {
  loadConfigToForm()
}


</script>

