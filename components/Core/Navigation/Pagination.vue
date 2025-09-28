<template>
  <div v-if="showPagination" class="mt-8">
    <nav class="flex flex-wrap items-center justify-center gap-2 py-3 select-none" aria-label="Pagination">
      <button
        class="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1 || loading"
        @click="handlePageChange(1)"
        title="Trang đầu"
      >
        <ChevronDoubleLeftIcon class="w-4 h-4" />
      </button>
      <button
        class="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1 || loading"
        @click="handlePageChange(currentPage - 1)"
        title="Trang trước"
      >
        <ChevronLeftIcon class="w-4 h-4" />
      </button>

      <span v-if="totalPages <= 7">
        <button
          v-for="page in totalPages"
          :key="page"
          class="mx-0.5 px-3 py-1 rounded-lg font-semibold transition"
          :class="page === currentPage ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 hover:bg-indigo-100 text-gray-700'"
          :disabled="loading"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </span>
      <span v-else>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="mx-0.5 px-3 py-1 rounded-lg font-semibold transition"
          :class="page === currentPage ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 hover:bg-indigo-100 text-gray-700'"
          :disabled="loading || page === '...'"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </span>

      <button
        class="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages || loading"
        @click="handlePageChange(currentPage + 1)"
        title="Trang sau"
      >
        <ChevronRightIcon class="w-4 h-4" />
      </button>
      <button
        class="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages || loading"
        @click="handlePageChange(totalPages)"
        title="Trang cuối"
      >
        <ChevronDoubleRightIcon class="w-4 h-4" />
      </button>

      <div class="flex items-center gap-1 ml-4 text-sm text-gray-500">
        <span>Trang</span>
        <input
          type="number"
          min="1"
          :max="totalPages"
          v-model.number="inputPage"
          @keyup.enter="jumpToPage"
          class="w-12 px-2 py-1 border rounded focus:outline-none focus:ring focus:border-indigo-400 text-center"
          :disabled="loading"
        />
        <span>/ {{ totalPages }}</span>
      </div>
      <div class="ml-4 text-sm text-gray-500 hidden sm:block">
        Tổng: <span class="font-semibold text-indigo-600">{{ totalItems }}</span> bản ghi
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import usePagination from '@/composables/ui/usePagination'
import useUrlState from '@/composables/utils/useUrlState'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/24/solid'

// Props
const props = defineProps({
  // API configuration
  fetchFunction: { type: Function, default: null },
  autoLoad: { type: Boolean, default: true },
  
  // External data (if not using autoLoad)
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  
  // URL parameters
  searchParam: { type: String, default: 'search' },
  categoryParam: { type: String, default: 'category' },
  sortParam: { type: String, default: 'sort' },
  pageParam: { type: String, default: 'page' },
  perPageParam: { type: String, default: 'per_page' },
  
  // Admin mode
  isAdmin: { type: Boolean, default: false },
  
  // URL state management
  enableUrlSync: { type: Boolean, default: true }
})

// Emits
const emit = defineEmits(['page-change', 'data-loaded'])

// Use pagination composable
const {
  currentPage: paginationCurrentPage,
  perPage: paginationPerPage,
  total: paginationTotal,
  setPage,
  setTotal
} = usePagination()

// URL state management (if enabled)
const urlState = props.enableUrlSync ? (() => {
  const filters = ref({})
  const pagination = ref({ currentPage: props.currentPage, perPage: 10 })
  const sort = ref({})
  
  const urlStateResult = useUrlState(
    filters,
    pagination,
    sort,
    () => {}, // No auto fetch
    {
      filterKeys: [],
      debounceMs: 300,
      resetPageOnFilter: false,
      resetPageOnSort: false
    }
  )
  
  return {
    ...urlStateResult,
    pagination
  }
})() : null

// Local perPage variable
const perPage = ref(10)

// Local state
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')
const currentPage = ref(props.currentPage)
const totalPages = ref(props.totalPages)
const totalRecords = ref(props.totalItems)
const loading = ref(props.loading)
const error = ref(null)
const data = ref([])

// Watch for props changes
watch(() => props.totalPages, (newVal) => {
  totalPages.value = newVal
})

watch(() => props.currentPage, (newVal) => {
  currentPage.value = newVal
})

watch(() => props.totalItems, (newVal) => {
  totalRecords.value = newVal
})

watch(() => props.loading, (newVal) => {
  loading.value = newVal
})

// Computed properties
const hasPagination = computed(() => {
  // Fallback: nếu totalPages không có, kiểm tra totalRecords
  if (totalPages.value === undefined || totalPages.value === null) {
    return totalRecords.value > 10 // Nếu có hơn 10 bản ghi thì có pagination
  }
  return totalPages.value > 1
})
const hasData = computed(() => data.value.length > 0)
const showPagination = computed(() => {
  const show = hasPagination.value && !loading.value
  return show
})
const hasFilters = computed(() => searchQuery.value || selectedCategory.value || sortBy.value !== 'latest')

// Load data function
const loadData = async () => {
  if (props.fetchFunction) {
    loading.value = true
    try {
      const result = await props.fetchFunction({
        page: currentPage.value,
        search: searchQuery.value,
        category_id: selectedCategory.value,
        sort: sortBy.value
      })
      
      if (result) {
        data.value = result.data || result
        if (result.meta) {
          totalPages.value = result.meta.last_page || 1
          totalRecords.value = result.meta.total || 0
        }
        emit('data-loaded', result)
      }
    } catch (err) {
      error.value = err.message || 'Lỗi tải dữ liệu'
    } finally {
      loading.value = false
    }
  }
}

// Handle page change
const handlePageChange = (page) => {
  if (page === '...' || page === currentPage.value || loading.value) return
  
  currentPage.value = page
  setPage(page)
  
  // Update URL state if enabled
  if (urlState && page !== '...') {
    urlState.onPageChange(page)
  }
  
  if (props.autoLoad) {
    loadData()
  }
  
  emit('page-change', page)
}

// Set data
const setData = (newData) => {
  data.value = newData
}

// Get API params
const getApiParams = () => {
  return {
    page: currentPage.value,
    search: searchQuery.value,
    category_id: selectedCategory.value,
    sort: sortBy.value
  }
}

// Computed
const inputPage = ref(currentPage.value)
watch(() => currentPage.value, (val) => {
  inputPage.value = val
})

// Sync URL state with current page
if (urlState) {
  watch(() => urlState.pagination.value.currentPage, (newPage) => {
    if (newPage && newPage !== currentPage.value) {
      currentPage.value = newPage
      setPage(newPage)
      if (props.autoLoad) {
        loadData()
      }
    }
  })
}

// Methods

const jumpToPage = () => {
  let page = inputPage.value
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  handlePageChange(page)
}

const visiblePages = computed(() => {
  const pages = []
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    return pages
  }
  if (currentPage.value <= 4) {
    return [1,2,3,4,5,'...',totalPages.value]
  }
  if (currentPage.value >= totalPages.value - 3) {
    return [1,'...',totalPages.value-4,totalPages.value-3,totalPages.value-2,totalPages.value-1,totalPages.value]
  }
  return [1,'...',currentPage.value-1,currentPage.value,currentPage.value+1,'...',totalPages.value]
})

// Watch for data changes
watch(data, (newData) => {
  emit('data-loaded', newData)
}, { deep: true })

// Expose for parent components
defineExpose({
  searchQuery,
  selectedCategory,
  sortBy,
  currentPage,
  totalPages,
  totalRecords,
  loading,
  error,
  data,
  hasPagination,
  hasData,
  showPagination,
  hasFilters,
  loadData,
  setData,
  getApiParams,
  handlePageChange,
  jumpToPage
})
</script>

<style scoped>
nav {
  user-select: none;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style> 
