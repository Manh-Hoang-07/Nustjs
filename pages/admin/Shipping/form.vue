<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Tên khu vực</label>
      <input v-model="form.name" type="text" class="w-full px-4 py-2 border rounded-xl" maxlength="100" required />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Phí cơ bản</label>
      <input v-model="form.base_fee" type="number" class="w-full px-4 py-2 border rounded-xl" required />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Phí theo kg</label>
      <input v-model="form.weight_fee" type="number" class="w-full px-4 py-2 border rounded-xl" required />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Thời gian (ngày)</label>
      <input v-model="form.estimated_days" type="number" class="w-full px-4 py-2 border rounded-xl" required />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Tỉnh/Thành (phân cách bằng dấu phẩy)</label>
      <input v-model="form.provinces" type="text" class="w-full px-4 py-2 border rounded-xl" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Trạng thái</label>
      <select v-model="form.status" class="w-full px-4 py-2 border rounded-xl">
        <option value="active">Hoạt động</option>
        <option value="inactive">Không hoạt động</option>
      </select>
    </div>
    
    <!-- Form Actions -->
    <div class="flex justify-end gap-2 pt-4">
      <button 
        type="button" 
        @click="$emit('cancel')" 
        class="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
      >
        Hủy
      </button>
      <button 
        type="submit" 
        class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
      >
        Lưu
      </button>
    </div>
  </form>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  shippingZone: Object,
  mode: String
})
const emit = defineEmits(['submit', 'cancel'])
const form = ref({ name: '', base_fee: '', weight_fee: '', estimated_days: '', provinces: '', status: 'active' })
watch(() => props.shippingZone, (val) => {
  if (val) {
    form.value = { name: val.name || '', base_fee: val.base_fee || '', weight_fee: val.weight_fee || '', estimated_days: val.estimated_days || '', provinces: Array.isArray(val.provinces) ? val.provinces.join(', ') : (val.provinces || ''), status: val.status || 'active' }
  } else {
    form.value = { name: '', base_fee: '', weight_fee: '', estimated_days: '', provinces: '', status: 'active' }
  }
}, { immediate: true })
function onSubmit() {
  const formData = new FormData()
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })
  emit('submit', formData)
}
</script> 
