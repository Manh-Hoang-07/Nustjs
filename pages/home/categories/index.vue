<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Danh mục sản phẩm</h1>
    <div class="bg-white rounded-lg shadow p-4">
      <div v-if="loading" class="py-8 text-center">Đang tải...</div>
      <div v-else>
        <ul class="space-y-2">
          <li v-for="cat in categories" :key="cat.id" class="flex items-center justify-between">
            <NuxtLink :to="`/home/categories/${cat.id}`" class="text-blue-600 hover:underline">{{ cat.name }}</NuxtLink>
            <span class="text-sm text-gray-500" v-if="cat.children?.length">{{ cat.children.length }} danh mục con</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'home' })
import { ref, onMounted } from 'vue'
import { useGlobalApiClient } from '@/composables/api'
import { publicEndpoints } from '@/api/endpoints'

const { apiClient } = useGlobalApiClient()
const categories = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await apiClient.get(publicEndpoints.productCategories.tree)
    categories.value = res.data?.data || res.data || []
  } finally {
    loading.value = false
  }
})
</script>


