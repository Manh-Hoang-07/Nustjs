<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">CKEditor Ultimate - Phiên bản đầy đủ nhất</h1>
    
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h2 class="text-lg font-semibold text-blue-800 mb-2">✨ Tính năng đầy đủ nhất</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
        <div>
          <strong>📝 Text Formatting:</strong>
          <ul class="mt-1 ml-4">
            <li>• Font size (8-96px)</li>
            <li>• Font family (13 loại)</li>
            <li>• Color & Background</li>
            <li>• Subscript/Superscript</li>
          </ul>
        </div>
        <div>
          <strong>🖼️ Media & Content:</strong>
          <ul class="mt-1 ml-4">
            <li>• Image upload & resize</li>
            <li>• Video embed (YouTube, Vimeo)</li>
            <li>• Tables với styling</li>
            <li>• Todo lists</li>
          </ul>
        </div>
        <div>
          <strong>🔧 Advanced Features:</strong>
          <ul class="mt-1 ml-4">
            <li>• Find & Replace</li>
            <li>• Special characters</li>
            <li>• Page breaks</li>
            <li>• Code blocks</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Ultimate Editor -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">CKEditor Ultimate</h2>
      
      <CKEditorUltimate
        v-model="ultimateContent"
        label="Nội dung đầy đủ"
        placeholder="Nhập nội dung với tất cả tính năng..."
        height="600px"
        :show-counts="true"
        :show-stats="true"
        @change="handleUltimateChange"
        @character-count="handleCharacterCount"
        @word-count="handleWordCount"
        @stats="handleStats"
      />
    </div>

    <!-- Content Preview -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Preview Nội dung</h2>
      <div class="bg-gray-50 p-6 rounded border min-h-96" v-html="ultimateContent"></div>
    </div>

    <!-- Sample Content -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Nội dung mẫu</h2>
      
      <div class="space-y-4">
        <button 
          @click="loadSampleContent"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Load Sample Content
        </button>
        
        <button 
          @click="clearContent"
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-2"
        >
          Clear Content
        </button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Thống kê chi tiết</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ characterCount }}</div>
          <div class="text-sm text-blue-700">Ký tự</div>
        </div>
        
        <div class="bg-green-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-600">{{ wordCount }}</div>
          <div class="text-sm text-green-700">Từ</div>
        </div>
        
        <div class="bg-purple-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-purple-600">{{ stats.paragraphs }}</div>
          <div class="text-sm text-purple-700">Đoạn văn</div>
        </div>
        
        <div class="bg-orange-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-orange-600">{{ stats.headings }}</div>
          <div class="text-sm text-orange-700">Tiêu đề</div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div class="bg-red-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-red-600">{{ stats.images }}</div>
          <div class="text-sm text-red-700">Hình ảnh</div>
        </div>
        
        <div class="bg-indigo-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ stats.links }}</div>
          <div class="text-sm text-indigo-700">Liên kết</div>
        </div>
        
        <div class="bg-teal-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-teal-600">{{ contentLength }}</div>
          <div class="text-sm text-teal-700">HTML Length</div>
        </div>
        
        <div class="bg-pink-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-pink-600">{{ lastChange }}</div>
          <div class="text-sm text-pink-700">Lần thay đổi</div>
        </div>
      </div>
    </div>

    <!-- HTML Output -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">HTML Output</h2>
      <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64 border">{{ ultimateContent }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CKEditorUltimate from '../../../components/Core/Content/CKEditorUltimate.vue'

const ultimateContent = ref('')
const characterCount = ref(0)
const wordCount = ref(0)
const stats = ref({
  paragraphs: 0,
  headings: 0,
  images: 0,
  links: 0
})
const lastChange = ref('')

const contentLength = computed(() => ultimateContent.value.length)

const sampleContent = `
<h1 style="color: #1f2937; font-size: 2.5rem; font-weight: 800; text-align: center; margin: 2rem 0; border-bottom: 4px solid #3b82f6; padding-bottom: 1rem;">
  🚀 CKEditor Ultimate - Phiên bản đầy đủ nhất
</h1>

<p style="font-size: 1.1rem; line-height: 1.8; color: #374151; text-align: justify;">
  Đây là <strong>CKEditor Ultimate</strong> - phiên bản <em>đầy đủ tính năng nhất</em> với tất cả công cụ chỉnh sửa văn bản chuyên nghiệp. 
  Hỗ trợ <span style="background-color: #fef3c7; padding: 0.2rem 0.4rem; border-radius: 0.25rem;">highlight text</span>, 
  <span style="color: #dc2626; font-weight: 600;">màu sắc</span>, và nhiều tính năng khác.
</p>

<h2 style="color: #374151; font-size: 1.8rem; font-weight: 700; margin: 2rem 0 1rem 0; border-left: 4px solid #10b981; padding-left: 1rem;">
  🎨 Tính năng định dạng văn bản
</h2>

<p>CKEditor Ultimate cung cấp đầy đủ các tính năng định dạng:</p>

<ul style="margin: 1rem 0; padding-left: 2rem;">
  <li><strong>Font chữ:</strong> 13 loại font khác nhau từ Arial đến Verdana</li>
  <li><strong>Kích thước:</strong> Từ 8px đến 96px với 48 tùy chọn</li>
  <li><strong>Màu sắc:</strong> Màu chữ và màu nền tùy chỉnh</li>
  <li><strong>Định dạng:</strong> Bold, Italic, Underline, Strikethrough</li>
  <li><strong>Đặc biệt:</strong> Subscript, Superscript, Highlight</li>
</ul>

<h2 style="color: #374151; font-size: 1.8rem; font-weight: 700; margin: 2rem 0 1rem 0; border-left: 4px solid #f59e0b; padding-left: 1rem;">
  📊 Bảng dữ liệu chuyên nghiệp
</h2>

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; border: 2px solid #d1d5db; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <thead>
    <tr style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
      <th style="border: 1px solid #d1d5db; padding: 1rem; text-align: left; color: white; font-weight: 600;">Tính năng</th>
      <th style="border: 1px solid #d1d5db; padding: 1rem; text-align: left; color: white; font-weight: 600;">Mô tả</th>
      <th style="border: 1px solid #d1d5db; padding: 1rem; text-align: left; color: white; font-weight: 600;">Trạng thái</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #f9fafb;">
      <td style="border: 1px solid #d1d5db; padding: 1rem;">Image Upload</td>
      <td style="border: 1px solid #d1d5db; padding: 1rem;">Upload và resize ảnh</td>
      <td style="border: 1px solid #d1d5db; padding: 1rem;"><span style="color: #10b981; font-weight: 600;">✅ Hoạt động</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d1d5db; padding: 1rem;">Video Embed</td>
      <td style="border: 1px solid #d1d5db; padding: 1rem;">YouTube, Vimeo integration</td>
      <td style="border: 1px solid #d1d5db; padding: 1rem;"><span style="color: #10b981; font-weight: 600;">✅ Hoạt động</span></td>
    </tr>
    <tr style="background-color: #f9fafb;">
      <td style="border: 1px solid #d1d5db; padding: 1rem;">Find & Replace</td>
      <td style="border: 1px solid #d1d5db; padding: 1rem;">Tìm kiếm và thay thế</td>
      <td style="border: 1px solid #d1d5db; padding: 1rem;"><span style="color: #10b981; font-weight: 600;">✅ Hoạt động</span></td>
    </tr>
  </tbody>
</table>

<h2 style="color: #374151; font-size: 1.8rem; font-weight: 700; margin: 2rem 0 1rem 0; border-left: 4px solid #8b5cf6; padding-left: 1rem;">
  💻 Code Blocks & Special Characters
</h2>

<p>Hỗ trợ code blocks với syntax highlighting:</p>

<pre style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #f9fafb; padding: 1.5rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.5rem 0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #374151;">
<code style="background-color: transparent; padding: 0; color: inherit;">
// JavaScript example
function helloWorld() {
  return "Amazing editor!";
}

// Vue.js component
export default {
  name: 'CKEditorUltimate',
  props: {
    modelValue: String
  },
  emits: ['update:modelValue']
}
</code></pre>

<p>Và các ký tự đặc biệt: © ® ™ € £ ¥ § ¶ † ‡ • – — … ‰ ‱ ′ ″ ‹ › ‼ ‽ ⁂ ⁃ ⁄ ⁅ ⁆ ⁇ ⁈ ⁉ ⁊ ⁋ ⁌ ⁍ ⁎ ⁏ ⁐ ⁑ ⁒ ⁓ ⁔ ⁕ ⁖ ⁗ ⁘ ⁙ ⁚ ⁛ ⁜ ⁝ ⁞</p>

<h2 style="color: #374151; font-size: 1.8rem; font-weight: 700; margin: 2rem 0 1rem 0; border-left: 4px solid #ef4444; padding-left: 1rem;">
  📝 Todo Lists & Advanced Features
</h2>

<p>Hỗ trợ todo lists và các tính năng nâng cao:</p>

<ul class="todo-list" style="list-style: none; padding-left: 0;">
  <li style="display: flex; align-items: center; margin: 0.5rem 0; padding: 0.5rem; background-color: #f9fafb; border-radius: 0.375rem;">
    <input type="checkbox" style="margin-right: 0.75rem;"> Tích hợp CKEditor Ultimate
  </li>
  <li style="display: flex; align-items: center; margin: 0.5rem 0; padding: 0.5rem; background-color: #f9fafb; border-radius: 0.375rem;">
    <input type="checkbox" style="margin-right: 0.75rem;"> Kiểm tra tất cả tính năng
  </li>
  <li style="display: flex; align-items: center; margin: 0.5rem 0; padding: 0.5rem; background-color: #f9fafb; border-radius: 0.375rem;">
    <input type="checkbox" style="margin-right: 0.75rem;"> Deploy lên production
  </li>
</ul>

<blockquote style="border-left: 5px solid #3b82f6; margin: 1.5rem 0; padding: 1rem 1.5rem; font-style: italic; color: #6b7280; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 0.5rem; box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);">
  <p style="margin: 0; font-size: 1.1rem; line-height: 1.6;">
    <strong>CKEditor Ultimate</strong> là phiên bản đầy đủ nhất với tất cả tính năng chuyên nghiệp, 
    phù hợp cho các ứng dụng enterprise và content management system hiện đại.
  </p>
</blockquote>

<hr style="border: none; border-top: 3px solid #e5e7eb; margin: 3rem 0;">

<h2 style="color: #374151; font-size: 1.8rem; font-weight: 700; margin: 2rem 0 1rem 0; border-left: 4px solid #06b6d4; padding-left: 1rem;">
  🔗 Liên kết và Media
</h2>

<p>Bạn có thể tạo <a href="https://ckeditor.com" target="_blank" style="color: #3b82f6; text-decoration: underline; transition: color 0.2s ease;">liên kết</a> và embed media từ các nguồn khác nhau.</p>

<p style="text-align: center; font-size: 1.2rem; color: #6b7280; margin: 2rem 0;">
  <em>🎉 Chúc mừng! Bạn đang sử dụng CKEditor Ultimate - phiên bản đầy đủ nhất! 🎉</em>
</p>
`

function handleUltimateChange(content) {
  lastChange.value = new Date().toLocaleTimeString()
}

function handleCharacterCount(count) {
  characterCount.value = count
}

function handleWordCount(count) {
  wordCount.value = count
}

function handleStats(newStats) {
  stats.value = newStats
}

function loadSampleContent() {
  ultimateContent.value = sampleContent
}

function clearContent() {
  ultimateContent.value = ''
  characterCount.value = 0
  wordCount.value = 0
  stats.value = {
    paragraphs: 0,
    headings: 0,
    images: 0,
    links: 0
  }
  lastChange.value = ''
}
</script> 

