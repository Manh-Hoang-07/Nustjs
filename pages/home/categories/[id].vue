<template>
  <div class="container mx-auto p-4">
    <div class="mb-4">
      <NuxtLink to="/home/categories" class="text-blue-600 hover:underline">← Danh mục</NuxtLink>
    </div>
    <div class="bg-white rounded-lg shadow p-4">
      <div v-if="loading" class="py-8 text-center">Đang tải...</div>
      <div v-else>
        <h1 class="text-2xl font-bold mb-2">{{ category?.name }}</h1>
        <p class="text-gray-600 mb-4" v-if="category?.description">{{ category.description }}</p>

        <h2 class="text-xl font-semibold mb-3">Sản phẩm</h2>
        <div v-if="products.length === 0" class="text-gray-500">Chưa có sản phẩm</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="p in products" :key="p.id" class="border rounded p-3">
            <div class="font-medium">{{ p.name }}</div>
            <div class="text-sm text-gray-500">SKU: {{ p.sku }}</div>
            <div class="text-red-600 font-semibold mt-1">{{ p.price }}</div>
            <div class="text-xs mt-1" :class="p.status === 'active' ? 'text-green-600' : 'text-gray-400'">{{ p.status }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'home' })
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalApiClient } from '@/composables/api'
import { publicEndpoints } from '@/api/endpoints'

const route = useRoute()
const { apiClient } = useGlobalApiClient()
const category = ref(null)
const products = ref([])
const loading = ref(false)

onMounted(async () => {
  const id = route.params.id
  loading.value = true
  try {
    const [catRes, prodRes] = await Promise.all([
      apiClient.get(publicEndpoints.productCategories.show(id) + '?relations=parent,children'),
      apiClient.get(publicEndpoints.productCategories.products(id) + '?per_page=20&status=active&fields=id,name,sku,price,status')
    ])
    category.value = catRes.data?.data || catRes.data
    const dataBlock = prodRes.data?.data || prodRes.data
    products.value = Array.isArray(dataBlock?.data) ? dataBlock.data : []
  } finally {
    loading.value = false
  }
})
</script>


