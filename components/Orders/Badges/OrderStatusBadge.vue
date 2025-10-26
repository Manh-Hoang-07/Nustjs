<template>
  <StatusBadge
    :status="status"
    :status-options="ORDER_STATUS_OPTIONS"
    :show-icon="showIcon"
    :size="size"
  />
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types/orders'
import { ORDER_STATUS_OPTIONS } from '~/types/orders'
import StatusBadge from '~/components/Core/Badges/StatusBadge.vue'

interface Props {
  status: OrderStatus
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'md'
})
</script>