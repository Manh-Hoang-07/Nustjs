<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
    <select
      :value="modelValue"
      @change="onChange($event.target.value)"
      :disabled="disabled || loading"
      :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500', error ? 'border-red-500' : 'border-gray-300']"
    >
      <option :value="''">{{ placeholder }}</option>
      <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Chọn...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  // Static options: [{ id, name, ... }] or [{ value, label }]
  options: {
    type: Array,
    default: () => []
  },
  // API endpoint to fetch options (either provide this or options)
  apiEndpoint: {
    type: String,
    default: ''
  },
  // Optional query params for API
  apiParams: {
    type: Object,
    default: () => ({})
  },
  // Map fields in API items
  valueField: { type: String, default: 'id' },
  labelField: { type: String, default: 'name' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const loading = ref(false)
const normalizedOptions = ref([])

function normalize(items) {
  return (items || []).map(i => ({
    value: i?.value ?? i?.[props.valueField],
    label: i?.label ?? i?.[props.labelField] ?? String(i?.[props.valueField] ?? '')
  }))
}

async function loadOptions() {
  if (!props.apiEndpoint) {
    normalizedOptions.value = normalize(props.options)
    return
  }
  loading.value = true
  try {
    const { apiClient } = useApiClient()
    const res = await apiClient.get(props.apiEndpoint, { params: props.apiParams })
    // Expecting { success, message, data: [...]} per provided format
    normalizedOptions.value = normalize(res.data?.data || [])
  } catch (e) {
    normalizedOptions.value = []
    // eslint-disable-next-line no-console
    console.error('SelectFilter loadOptions error', e)
  } finally {
    loading.value = false
  }
}

watch(() => [props.options, props.apiEndpoint, props.apiParams, props.valueField, props.labelField], loadOptions, { deep: true })

onMounted(loadOptions)

function onChange(val) {
  const casted = val === '' ? '' : isNaN(Number(val)) ? val : Number(val)
  emit('update:modelValue', casted)
  emit('change', casted)
}
</script>







