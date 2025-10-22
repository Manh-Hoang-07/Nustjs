<template>
  <div class="flex items-center space-x-2">
    <!-- Edit button -->
    <button
      v-if="showEdit"
      @click="handleClick('edit')"
      class="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
      :title="editTitle || 'Sửa'"
    >
      <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
    </button>

    <!-- Delete button -->
    <button
      v-if="showDelete"
      @click="handleClick('delete')"
      class="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
      :title="deleteTitle || 'Xóa'"
    >
      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </button>

    <!-- View button -->
    <button
      v-if="showView"
      @click="handleClick('view')"
      class="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
      :title="viewTitle || 'Xem'"
    >
      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    </button>

    <!-- Additional actions -->
    <button
      v-for="(action, index) in additionalActions"
      :key="`action-${index}-${item.id || index}`"
      @click="handleActionClick(action, index)"
      class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      :title="action.label"
    >
      <!-- Play icon -->
      <svg v-if="action.icon === 'play'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <!-- Pause icon -->
      <svg v-else-if="action.icon === 'pause'" class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <!-- Star icon -->
      <svg v-else-if="action.icon === 'star'" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
      <!-- Star outline icon -->
      <svg v-else-if="action.icon === 'star-outline'" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>
      <!-- Default icon -->
      <svg v-else class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>

    <!-- Custom actions -->
    <slot name="custom" :item="item"></slot>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  showView: {
    type: Boolean,
    default: false
  },
  editTitle: {
    type: String,
    default: 'Sửa'
  },
  deleteTitle: {
    type: String,
    default: 'Xóa'
  },
  viewTitle: {
    type: String,
    default: 'Xem'
  },
  additionalActions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete', 'view'])

// Handle button clicks to prevent hydration issues
const handleClick = (action) => {
  emit(action, props.item)
}

const handleActionClick = (action, index) => {
  if (typeof action.action === 'function') {
    action.action()
  }
}

// Ensure component is hydrated on client side
onMounted(() => {
  // This ensures the component is properly mounted on the client
})
</script>
