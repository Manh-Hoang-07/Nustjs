<template>
  <StatusBadge
    :status="status"
    :status-options="SHIPPING_STATUS_OPTIONS"
    :show-icon="showIcon"
    :size="size"
  />
</template>

<script setup lang="ts">
import type { ShippingStatus } from '~/types/orders'
import { SHIPPING_STATUS_OPTIONS } from '~/types/orders'
import StatusBadge from '~/components/Core/Badges/StatusBadge.vue'

interface Props {
  status: ShippingStatus
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'md'
})
</script>