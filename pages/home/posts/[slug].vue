<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Đang tải bài viết...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Không thể tải bài viết</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <NuxtLink 
            to="/home/posts"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Quay lại danh sách
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div v-else-if="post" class="bg-white">
      <!-- Hero Section -->
      <div class="relative h-96 lg:h-[500px]">
        <img 
          :src="post.featured_image || '/placeholder.jpg'" 
          :alt="post.title"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-white max-w-4xl mx-auto px-4">
            <div class="flex items-center justify-center space-x-4 mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                {{ getCategoryName(post.category_id) }}
              </span>
              <time :datetime="post.created_at" class="text-sm">{{ formatDate(post.created_at) }}</time>
              <span class="text-sm">{{ post.read_time || '5 phút đọc' }}</span>
            </div>
            <h1 class="text-4xl lg:text-6xl font-bold mb-4 leading-tight">{{ post.title }}</h1>
            <p v-if="post.excerpt" class="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto">{{ post.excerpt }}</p>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Author Info -->
        <div class="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div class="flex items-center space-x-4">
            <img 
              :src="post.author?.avatar || '/avatar-placeholder.jpg'" 
              :alt="post.author?.name"
              class="h-12 w-12 rounded-full"
            >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ post.author?.name || 'Admin' }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-6 text-sm text-gray-500">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              {{ post.views || 0 }} lượt xem
            </span>
            <button class="flex items-center hover:text-red-500 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              {{ post.likes || 0 }} lượt thích
            </button>
            <button class="flex items-center hover:text-blue-500 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>

        <!-- Post Content -->
        <div class="prose prose-lg max-w-none mb-12">
          <HtmlContent :content="post.content" />
        </div>

        <!-- Tags -->
        <div v-if="post.tags && post.tags.length > 0" class="border-t border-gray-200 pt-6 mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Tags:</h3>
          <div class="flex flex-wrap gap-2">
            <NuxtLink 
              v-for="tag in post.tags" 
              :key="tag.id"
              :to="`/posts/tag/${tag.slug || tag.id}`"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              #{{ tag.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between border-t border-gray-200 pt-6">
          <NuxtLink 
            v-if="previousPost"
            :to="`/posts/${previousPost.slug || previousPost.id}`"
            class="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span class="hidden sm:inline">Bài viết trước</span>
            <span class="sm:hidden">Trước</span>
          </NuxtLink>
          <div v-else></div>

          <NuxtLink 
            to="/home/posts"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Danh sách bài viết
          </NuxtLink>

          <NuxtLink 
            v-if="nextPost"
            :to="`/posts/${nextPost.slug || nextPost.id}`"
            class="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span class="hidden sm:inline">Bài viết tiếp theo</span>
            <span class="sm:hidden">Tiếp</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </NuxtLink>
          <div v-else></div>
        </div>
      </div>

      <!-- Related Posts -->
      <div v-if="relatedPosts.length > 0" class="bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Bài viết liên quan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article 
              v-for="relatedPost in relatedPosts" 
              :key="relatedPost.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <img 
                :src="relatedPost.featured_image || '/placeholder.jpg'" 
                :alt="relatedPost.title"
                class="w-full h-48 object-cover"
              >
              <div class="p-6">
                <div class="flex items-center text-sm text-gray-500 mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                    {{ getCategoryName(relatedPost.category_id) }}
                  </span>
                  <time :datetime="relatedPost.created_at">{{ formatDate(relatedPost.created_at) }}</time>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  <NuxtLink 
                    :to="`/posts/${relatedPost.slug || relatedPost.id}`"
                    class="hover:text-blue-600 transition-colors"
                  >
                    {{ relatedPost.title }}
                  </NuxtLink>
                </h3>
                <p class="text-gray-600 line-clamp-3">{{ relatedPost.excerpt }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts } from '../../composables/usePosts.js'
import HtmlContent from '../../components/Core/Content/HtmlContent.vue'

const route = useRoute()
const { 
  posts, 
  categories, 
  loading, 
  error,
  fetchPostBySlug, 
  fetchPublicPosts,
  fetchCategories 
} = usePosts()

// State
const post = ref(null)
const relatedPosts = ref([])
const previousPost = ref(null)
const nextPost = ref(null)

// Computed
const postSlug = computed(() => route.params.slug)

// Methods
const loadPost = async () => {
  try {
    // Try to fetch by slug first, then by ID if slug fails
    post.value = await fetchPostBySlug(postSlug.value)
    
    // Load related posts
    await loadRelatedPosts()
    
    // Load navigation posts
    await loadNavigationPosts()
  } catch (err) {
    console.error('Error loading post:', err)
    error.value = 'Không thể tải bài viết. Vui lòng thử lại sau.'
  }
}

const loadRelatedPosts = async () => {
  try {
    const response = await fetchPublicPosts({ 
      category: post.value.category_id,
      limit: 3,
      exclude: post.value.id
    })
    relatedPosts.value = response.slice(0, 3)
  } catch (err) {
    console.error('Error loading related posts:', err)
  }
}

const loadNavigationPosts = async () => {
  try {
    const allPosts = await fetchPublicPosts({ limit: 100 })
    const currentIndex = allPosts.findIndex(p => p.id === post.value.id)
    
    if (currentIndex > 0) {
      previousPost.value = allPosts[currentIndex - 1]
    }
    
    if (currentIndex < allPosts.length - 1) {
      nextPost.value = allPosts[currentIndex + 1]
    }
  } catch (err) {
    console.error('Error loading navigation posts:', err)
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Không có danh mục'
}

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString))
}

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    loadPost()
  ])
})

// Page meta
definePageMeta({
  layout: 'home'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  @apply text-gray-900;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply text-gray-900 font-bold;
}

.prose p {
  @apply text-gray-700 leading-relaxed;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.prose blockquote {
  @apply border-l-4 border-blue-500 pl-4 italic text-gray-700;
}

.prose ul, .prose ol {
  @apply text-gray-700;
}

.prose li {
  @apply mb-2;
}

.prose img {
  @apply rounded-lg shadow-md;
}

.prose code {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-900 text-white p-4 rounded-lg overflow-x-auto;
}
</style>

