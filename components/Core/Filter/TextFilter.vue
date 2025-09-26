<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
    <input
      :value="internalValue"
      type="text"
      :placeholder="placeholder"
      @input="onInput"
      @blur="flush"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounce } from '@/utils/optimization.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Nhập từ khóa...'
  },
  debounceMs: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (v) => {
  if (v !== internalValue.value) internalValue.value = v
})

const debouncedEmit = debounce((val) => {
  emit('update:modelValue', val)
  emit('change', val)
}, props.debounceMs)

function onInput(e) {
  internalValue.value = e.target.value
  debouncedEmit(internalValue.value)
}

function flush() {
  if (debouncedEmit.flush) debouncedEmit.flush()
}
</script>







