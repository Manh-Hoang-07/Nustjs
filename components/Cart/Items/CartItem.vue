<template>
  <ProductDisplay
    :item="item"
    variant="cart"
    :show-quantity-badge="true"
    :show-quantity-selector="true"
    :show-remove-button="true"
    @update-quantity="handleUpdateQuantity"
    @remove="handleRemove"
  />
</template>

<script setup lang="ts">
import type { CartItem as CartItemType } from '~/types/cart'
import ProductDisplay from '~/components/Shared/ProductDisplay.vue'

interface Props {
  item: CartItemType
}

interface Emits {
  'update-quantity': [itemId: string, quantity: number]
  'remove': [itemId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleUpdateQuantity = (itemId: string, quantity: number) => {
  emit('update-quantity', itemId, quantity)
}

const handleRemove = (itemId: string) => {
  emit('remove', itemId)
}
</script>