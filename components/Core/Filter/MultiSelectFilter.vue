<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
    <div class="relative">
      <div
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer min-h-[38px] flex flex-wrap gap-1"
        @click="toggleDropdown"
      >
        <span v-if="selectedValues.length === 0" class="text-gray-500">{{ placeholder }}</span>
        <span v-for="opt in selectedItems" :key="opt.value" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {{ opt.label }}
          <button class="ml-1" @click.stop="remove(opt.value)">×</button>
        </span>
      </div>
      <div v-if="open" class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        <div class="p-2 sticky top-0 bg-white border-b">
          <input v-model="search" type="text" placeholder="Tìm kiếm..." class="w-full px-2 py-1 border border-gray-300 rounded" />
        </div>
        <div v-for="opt in filteredOptions" :key="opt.value" @click="toggle(opt.value)" class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
          <input type="checkbox" class="mr-2" :checked="selectedValues.includes(opt.value)" readonly />
          {{ opt.label }}
        </div>
        <div v-if="!loading && filteredOptions.length === 0" class="px-3 py-2 text-gray-500">Không có dữ liệu</div>
        <div v-if="loading" class="px-3 py-2 text-gray-500">Đang tải...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient.js'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Chọn...' },
  options: { type: Array, default: () => [] }, // [{ id,name }] or [{ value,label }]
  apiEndpoint: { type: String, default: '' },
  apiParams: { type: Object, default: () => ({}) },
  valueField: { type: String, default: 'id' },
  labelField: { type: String, default: 'name' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)
const search = ref('')
const loading = ref(false)
const storeOptions = ref([])

function normalize(items) {
  return (items || []).map(i => ({
    value: i?.value ?? i?.[props.valueField],
    label: i?.label ?? i?.[props.labelField] ?? String(i?.[props.valueField] ?? '')
  }))
}

async function load() {
  if (!props.apiEndpoint) {
    storeOptions.value = normalize(props.options)
    return
  }
  loading.value = true
  try {
    const { apiClient } = useApiClient()
    const res = await apiClient.get(props.apiEndpoint, { params: props.apiParams })
    storeOptions.value = normalize(res.data?.data || [])
  } catch (e) {
    storeOptions.value = []
    // eslint-disable-next-line no-console
    console.error('MultiSelectFilter load error', e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => [props.options, props.apiEndpoint, props.apiParams, props.valueField, props.labelField], load, { deep: true })

const selectedValues = computed(() => props.modelValue)
const selectedItems = computed(() => selectedValues.value.map(v => storeOptions.value.find(o => o.value == v)).filter(Boolean))

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return storeOptions.value
  return storeOptions.value.filter(o => o.label.toLowerCase().includes(q))
})

function toggleDropdown() { open.value = !open.value }
function toggle(v) {
  const next = selectedValues.value.includes(v)
    ? selectedValues.value.filter(x => x !== v)
    : [...selectedValues.value, v]
  emit('update:modelValue', next)
  emit('change', next)
}
function remove(v) { toggle(v) }

// Close when clicking outside
function onDocClick(e) {
  if (!e.target.closest('.relative')) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
watch(open, (v) => { if (!v) search.value = '' })

</script>







