<template>
  <div class="grid grid-cols-2 gap-2">
    <div>
      <label v-if="label" class="block text-sm font-medium mb-1">{{ labelStart }}</label>
      <input type="date" :value="start" @change="onStart($event.target.value)" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div>
      <label v-if="label" class="block text-sm font-medium mb-1">{{ labelEnd }}</label>
      <input type="date" :value="end" @change="onEnd($event.target.value)" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ start: '', end: '' }) },
  label: { type: String, default: '' },
  startLabel: { type: String, default: 'Từ ngày' },
  endLabel: { type: String, default: 'Đến ngày' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const start = computed(() => props.modelValue?.start || '')
const end = computed(() => props.modelValue?.end || '')
const labelStart = computed(() => props.startLabel || props.label)
const labelEnd = computed(() => props.endLabel || props.label)

function onStart(v) {
  const next = { start: v, end: end.value }
  emit('update:modelValue', next)
  emit('change', next)
}

function onEnd(v) {
  const next = { start: start.value, end: v }
  emit('update:modelValue', next)
  emit('change', next)
}
</script>







