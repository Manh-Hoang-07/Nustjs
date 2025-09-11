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
      
      <form v-else @submit.prevent="saveAllConfigs" class="space-y-8">
        <!-- Thông tin website -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Thông tin website</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tên website -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên website <span class="text-red-500">*</span>
              </label>
              <input
                v-model="configForm.site_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Website Name"
                required
              />
            </div>

            <!-- Mô tả website -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mô tả website
              </label>
              <input
                v-model="configForm.site_description"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả website"
              />
            </div>

            <!-- Logo website -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Logo website
              </label>
              <div class="flex">
                <input
                  v-model="configForm.site_logo"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/images/logo.png"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none"
                >
                  Chọn file
                </button>
              </div>
            </div>

            <!-- Favicon -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <div class="flex">
                <input
                  v-model="configForm.site_favicon"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/images/favicon.ico"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none"
                >
                  Chọn file
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Thông tin liên hệ -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Thông tin liên hệ</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Email liên hệ -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email liên hệ
              </label>
              <input
                v-model="configForm.contact_email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@website.com"
              />
            </div>

            <!-- Số điện thoại -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                v-model="configForm.contact_phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0123456789"
              />
            </div>

            <!-- Địa chỉ -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <input
                v-model="configForm.contact_address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
              />
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

import { ref, reactive, onMounted } from 'vue'
import { useDataTable } from '../../../../composables/data/useDataTable.js'
import { useSystemConfig } from '../../../../composables/api'
import { useToast } from '../../../../composables/ui/useToast.js'
import SkeletonLoader from '../../../../components/Core/Loading/SkeletonLoader.vue'

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

// State
const selectedConfig = ref(null)
const saving = ref(false)

// Form state
const configForm = reactive({
  site_name: '',
  site_description: '',
  site_logo: '',
  site_favicon: '',
  contact_email: '',
  contact_phone: '',
  contact_address: ''
})

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Fetch data
onMounted(async () => {
  await fetchData()
  loadConfigToForm()
})

// Load config data to form
function loadConfigToForm() {
  if (items.value && items.value.length > 0) {
    items.value.forEach(config => {
      switch (config.config_key) {
        case 'site_name':
          configForm.site_name = config.config_value || ''
          break
        case 'site_description':
          configForm.site_description = config.config_value || ''
          break
        case 'site_logo':
          configForm.site_logo = config.config_value || ''
          break
        case 'site_favicon':
          configForm.site_favicon = config.config_value || ''
          break
        case 'contact_email':
          configForm.contact_email = config.config_value || ''
          break
        case 'contact_phone':
          configForm.contact_phone = config.config_value || ''
          break
        case 'contact_address':
          configForm.contact_address = config.config_value || ''
          break
      }
    })
  }
}

// Save all configs
async function saveAllConfigs() {
  saving.value = true
  try {
    const configs = {
      site_name: configForm.site_name,
      site_description: configForm.site_description,
      site_logo: configForm.site_logo,
      site_favicon: configForm.site_favicon,
      contact_email: configForm.contact_email,
      contact_phone: configForm.contact_phone,
      contact_address: configForm.contact_address
    }
    
    await updateConfigsByGroup('general', configs)
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

