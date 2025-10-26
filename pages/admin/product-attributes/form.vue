<template>
	<Modal v-model="modalVisible" :title="formTitle" :loading="loading">
		<FormWrapper
			:default-values="defaultValues"
			:rules="validationRules"
			:api-errors="apiErrors"
			:submit-text="attribute ? 'Cập nhật' : 'Thêm mới'"
			@submit="handleSubmit"
			@cancel="onClose"
		>
			<template #default="{ form, errors, clearError }">
				<!-- Tên -->
				<FormField
					v-model="form.name"
					label="Tên thuộc tính"
					name="name"
					:error="errors.name"
					required
					@update:model-value="clearError('name')"
				/>

				<!-- Slug -->
				<FormField
					v-model="form.slug"
					label="Slug"
					name="slug"
					placeholder="Bỏ trống để tự tạo từ tên"
					:error="errors.slug"
					@update:model-value="clearError('slug')"
				/>

				<!-- Loại -->
				<FormField
					v-model="form.type"
					label="Loại"
					name="type"
					type="select"
					:options="typeOptions"
					:error="errors.type"
					@update:model-value="clearError('type')"
				/>

				<!-- Mô tả -->
				<FormField
					v-model="form.description"
					label="Mô tả"
					name="description"
					type="textarea"
					:error="errors.description"
					@update:model-value="clearError('description')"
				/>

				<!-- Cờ -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField
						v-model="form.is_required"
						label="Bắt buộc"
						name="is_required"
						type="checkbox"
					/>
					<FormField
						v-model="form.is_variant"
						label="Dùng cho biến thể"
						name="is_variant"
						type="checkbox"
					/>
					<FormField
						v-model="form.is_filterable"
						label="Dùng để lọc"
						name="is_filterable"
						type="checkbox"
					/>
				</div>

				<!-- Sắp xếp & Trạng thái -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						v-model="form.sort_order"
						label="Thứ tự sắp xếp"
						name="sort_order"
						type="number"
						:error="errors.sort_order"
						@update:model-value="clearError('sort_order')"
					/>
					<FormField
						v-model="form.status"
						label="Trạng thái"
						name="status"
						type="select"
						:options="statusOptions"
						:error="errors.status"
						@update:model-value="clearError('status')"
					/>
				</div>
			</template>
		</FormWrapper>
	</Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'

const props = defineProps({
	show: Boolean,
	attribute: Object,
	statusEnums: {
		type: Array,
		default: () => []
	},
	typeEnums: {
		type: Array,
		default: () => []
	},
	apiErrors: {
		type: Object,
		default: () => ({})
	},
	loading: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['submit', 'cancel'])

const formTitle = computed(() => props.attribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính')
const modalVisible = computed({
	get: () => props.show,
	set: () => onClose()
})

const defaultValues = computed(() => {
	const obj = props.attribute || {}
	return {
		name: obj.name || '',
		slug: obj.slug || '',
		type: obj.type || '',
		description: obj.description || '',
		is_required: Boolean(obj.is_required) || false,
		is_variant: Boolean(obj.is_variant) || false,
		is_filterable: Boolean(obj.is_filterable) || false,
		sort_order: obj.sort_order ?? 0,
		status: obj.status || 'active',
		...obj
	}
})

const validationRules = computed(() => ({
	name: [
		{ required: 'Tên thuộc tính là bắt buộc.' },
		{ max: [255, 'Tên không được vượt quá 255 ký tự.'] }
	],
	slug: [
		{ max: [255, 'Slug không được vượt quá 255 ký tự.'] }
	],
	type: [
		{ required: 'Loại thuộc tính là bắt buộc.' }
	],
	sort_order: [
		{ min: [0, 'Thứ tự sắp xếp phải >= 0.'] }
	]
}))

const statusOptions = computed(() =>
	(props.statusEnums || []).map(opt => ({ value: opt.value, label: opt.label }))
)

const typeOptions = computed(() =>
	(props.typeEnums || []).map(opt => ({ value: opt.value, label: opt.label }))
)

function handleSubmit(form) {
	// Nếu slug rỗng sẽ để BE tự generate
	emit('submit', { ...form, slug: form.slug || undefined })
}

function onClose() {
	emit('cancel')
}
</script>



