<template>
  <ProductDisplay
    :item="item"
    variant="order"
    :show-actions="showActions"
    :show-edit-button="showActions"
    :show-delete-button="showActions"
    :show-simple-info="true"
    :show-simple-total="true"
    :show-item-id="showActions"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>

<script setup lang="ts">
import type { OrderItem } from '~/types/orders'
import ProductDisplay from '~/components/Shared/ProductDisplay.vue'

interface Props {
  item: OrderItem
  showActions?: boolean
}

interface Emits {
  (e: 'edit', item: OrderItem): void
  (e: 'delete', item: OrderItem): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false
})

const emit = defineEmits<Emits>()

const handleEdit = (item: any) => {
  emit('edit', item as OrderItem)
}

const handleDelete = (item: any) => {
  emit('delete', item as OrderItem)
}
</script>