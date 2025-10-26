<template>
	<div class="container mx-auto p-4">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Thuộc tính sản phẩm</h1>
			<button 
				@click="openCreateModal" 
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
			>
				Thêm thuộc tính
			</button>
		</div>

		<!-- Bộ lọc -->
		<AttributeFilter 
			:initial-filters="filters"
			:status-enums="statusEnums"
			:type-enums="typeEnums"
			@update:filters="handleFilterUpdate" 
		/>

		<!-- Bảng dữ liệu -->
		<div class="bg-white shadow-md rounded-lg overflow-hidden">
			<SkeletonLoader v-if="loading" type="table" :rows="5" :columns="6" />
			<table v-else class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="attr in items" :key="attr.id">
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ attr.id }}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ attr.name }}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ attr.slug }}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">{{ getTypeLabel(attr.type) }}</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span 
								class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
								:class="(
									statusEnums.find(s => s.value === attr.status)?.class ||
									statusEnums.find(s => s.value === attr.status)?.badge_class ||
									statusEnums.find(s => s.value === attr.status)?.color_class ||
									'bg-gray-100 text-gray-800'
								)"
							>
								{{ getStatusLabel(attr.status) }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
							<ClientOnly>
								<Actions
									:item="attr"
									@edit="openEditModal"
									@delete="confirmDelete"
									:additional-actions="[
										{
											label: attr.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt',
											action: () => toggleStatus(attr),
											icon: attr.status === 'active' ? 'pause' : 'play'
										}
									]"
								/>
								<template #fallback>
									<div class="flex space-x-1">
										<div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
										<div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
										<div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
									</div>
								</template>
							</ClientOnly>
						</td>
					</tr>
					<tr v-if="items.length === 0">
						<td colspan="6" class="px-6 py-4 text-center text-gray-500">
							Không có dữ liệu
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Phân trang -->
		<Pagination 
			v-if="items.length > 0"
			:current-page="pagination.current_page"
			:total-pages="pagination.last_page"
			:total-items="pagination.total"
			:loading="loading"
			@page-change="handlePageChange"
		/>

		<!-- Modal thêm mới -->
		<CreateAttribute
			v-if="modals.create"
			:show="modals.create"
			:status-enums="statusEnums"
			:type-enums="typeEnums"
			:api-errors="apiErrors"
			:on-close="closeCreateModal"
			@created="handleCreated"
		/>

		<!-- Modal chỉnh sửa -->
		<EditAttribute
			v-if="modals.edit"
			:show="modals.edit"
			:attribute="selectedAttribute"
			:status-enums="statusEnums"
			:type-enums="typeEnums"
			:api-errors="apiErrors"
			:on-close="closeEditModal"
			@updated="handleUpdated"
		/>

		<!-- Modal xác nhận xóa -->
		<ConfirmModal
			v-if="modals.delete"
			:show="modals.delete"
			title="Xác nhận xóa"
			:message="`Bạn có chắc chắn muốn xóa thuộc tính ${selectedAttribute?.name || ''}?`"
			:on-close="closeDeleteModal"
			@confirm="deleteAttribute"
		/>
	</div>
</template>

<script setup>
definePageMeta({
	layout: 'admin-layout',
	requiresAuth: true,
	requiresAdmin: true
})

import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useCrudDataTable } from '@/composables/data'
import { useToast } from '@/composables/ui/useToast'
import SkeletonLoader from '@/components/Core/Loading/SkeletonLoader.vue'
import ConfirmModal from '@/components/Core/Modal/ConfirmModal.vue'
import Actions from '@/components/Core/Actions/Actions.vue'
import Pagination from '@/components/Core/Navigation/Pagination.vue'
import { adminEndpoints, publicEndpoints } from '@/api/endpoints'
import { useGlobalApiClient } from '@/composables/api'

// Lazy load components
const CreateAttribute = defineAsyncComponent(() => import('./create.vue'))
const EditAttribute = defineAsyncComponent(() => import('./edit.vue'))
const AttributeFilter = defineAsyncComponent(() => import('./filter.vue'))

// Use composables
const {
	items,
	loading,
	pagination,
	filters,
	fetchData,
	updateFilters,
	// CRUD operations
	createItem,
	updateItem,
	deleteItem,
	// Modal handlers
	openCreateModal: openCreateModalComposable,
	closeCreateModal: closeCreateModalComposable,
	openEditModal: openEditModalComposable,
	closeEditModal: closeEditModalComposable,
	openDeleteModal: openDeleteModalComposable,
	closeDeleteModal: closeDeleteModalComposable,
	// Selection
	selectedItem,
	// Modal state
	modals,
	// Error handling
	apiErrors,
	clearApiErrors
} = useCrudDataTable({
	endpoints: {
		list: adminEndpoints.productAttributes.list,
		create: adminEndpoints.productAttributes.create,
		update: (id) => adminEndpoints.productAttributes.update(id),
		delete: (id) => adminEndpoints.productAttributes.delete(id)
	}
})

const { showSuccess, showError } = useToast()
const { apiClient } = useGlobalApiClient()

// State
const statusEnums = ref([])
const typeEnums = ref([])

// Alias selectedItem from composable
const selectedAttribute = selectedItem

// Fetch enums once
const enumsLoaded = ref(false)

onMounted(async () => {
	if (!enumsLoaded.value) {
		await Promise.all([fetchStatusEnums(), fetchTypeEnums()])
		enumsLoaded.value = true
	}
})

async function fetchStatusEnums() {
	try {
		const response = await apiClient.get(adminEndpoints.enums('basic_status'))
		statusEnums.value = response.data?.data || []
	} catch (e) {
		statusEnums.value = []
	}
}

async function fetchTypeEnums() {
	try {
		const response = await apiClient.get(adminEndpoints.adminEnums('attribute_type'))
		typeEnums.value = response.data?.data || []
	} catch (e) {
		typeEnums.value = []
	}
}

function handleFilterUpdate(newFilters) {
	updateFilters(newFilters)
}

// Modal handlers
function openCreateModal() {
	openCreateModalComposable()
}

function closeCreateModal() {
	closeCreateModalComposable()
}

function openEditModal(attribute) {
	openEditModalComposable(attribute)
}

function closeEditModal() {
	closeEditModalComposable()
}

function confirmDelete(attribute) {
	openDeleteModalComposable(attribute)
}

function closeDeleteModal() {
	closeDeleteModalComposable()
}

// Action handlers
async function handleCreated(data) {
	await createItem(data)
	showSuccess('Thuộc tính đã được tạo thành công')
}

async function handleUpdated(data) {
	await updateItem(data)
	showSuccess('Thuộc tính đã được cập nhật thành công')
}

async function deleteAttribute() {
	await deleteItem()
	showSuccess('Thuộc tính đã được xóa thành công')
}

async function toggleStatus(attr) {
	try {
		const newStatus = attr.status === 'active' ? 'inactive' : 'active'
		const response = await apiClient.patch(adminEndpoints.productAttributes.updateStatus(attr.id), {
			status: newStatus
		})
		if (response.data?.success) {
			showSuccess(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'ngừng hoạt động'} thuộc tính`)
			fetchData() // Refresh data
		} else {
			showError('Không thể cập nhật trạng thái thuộc tính')
		}
	} catch (error) {
		showError('Không thể cập nhật trạng thái thuộc tính')
	}
}

function handlePageChange(page) {
	fetchData({ page })
}

// Helpers
function getStatusLabel(status) {
	const found = (statusEnums.value || []).find(it => it.value === status || it.id === status)
	return found?.label || found?.name || status || 'Không xác định'
}

function getTypeLabel(type) {
	const found = (typeEnums.value || []).find(it => it.value === type || it.key === type)
	return found?.label || found?.name || type || '—'
}
</script>

<style>
.table-responsive {
	overflow-x: auto;
}
</style>



