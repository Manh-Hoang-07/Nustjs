<template>
  <span 
    :class="[
      'inline-flex items-center rounded-full font-medium',
      statusClasses
    ]"
  >
    <svg 
      v-if="showIcon" 
      :class="['-ml-0.5 mr-1.5 h-2 w-2', iconClasses]" 
      fill="currentColor" 
      viewBox="0 0 8 8"
    >
      <circle cx="4" cy="4" r="3" />
    </svg>
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface StatusOption {
  value: string
  label: string
  color: string
}

interface Props {
  status: string
  statusOptions: StatusOption[]
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'md'
})

const statusConfig = computed(() => {
  return props.statusOptions.find(option => option.value === props.status) || {
    value: props.status,
    label: props.status,
    color: 'gray'
  }
})

const statusLabel = computed(() => statusConfig.value.label)

const statusClasses = computed(() => {
  const color = statusConfig.value.color
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  }
  
  return `${sizeClasses[props.size]} ${colorClasses[color as keyof typeof colorClasses]}`
})

const iconClasses = computed(() => {
  const color = statusConfig.value.color
  const colorClasses = {
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    indigo: 'text-indigo-400',
    orange: 'text-orange-400',
    green: 'text-green-400',
    red: 'text-red-400',
    gray: 'text-gray-400'
  }
  
  return colorClasses[color as keyof typeof colorClasses]
})
</script>