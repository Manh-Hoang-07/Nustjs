<template>
  <StatusBadge
    :status="status"
    :status-options="PAYMENT_STATUS_OPTIONS"
    :show-icon="showIcon"
    :size="size"
  />
</template>

<script setup lang="ts">
import type { PaymentStatus } from '~/types/orders'
import { PAYMENT_STATUS_OPTIONS } from '~/types/orders'
import StatusBadge from '~/components/Core/Badges/StatusBadge.vue'

interface Props {
  status: PaymentStatus
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'md'
})
</script>