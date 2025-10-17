<template>
	<div>
		<div v-if="loading" class="flex justify-center items-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<span class="ml-2 text-gray-600">Đang tải dữ liệu...</span>
		</div>
		<AttributeForm 
			v-else-if="showModal"
			:show="showModal"
			:attribute="attributeData"
			:status-enums="statusEnums"
			:type-enums="typeEnums"
			:api-errors="apiErrors"
			@submit="handleSubmit" 
			@cancel="onClose" 
		/>
	</div>
</template>

<script setup>
import AttributeForm from './form.vue'
import { ref, watch } from 'vue'
import { useApiClient } from '@/composables/api/useApiClient'
import { adminEndpoints } from '@/api/endpoints'

const { apiClient } = useApiClient()

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
	apiErrors: Object,
	onClose: Function
})

const emit = defineEmits(['updated'])

const showModal = ref(false)
const attributeData = ref(null)
const loading = ref(false)

watch(() => props.show, (newValue) => {
	showModal.value = newValue
	if (newValue) {
		if (props.attribute?.id) {
			fetchDetails()
		}
	} else {
		attributeData.value = null
		loading.value = false
	}
}, { immediate: true })

async function fetchDetails() {
	if (!props.attribute?.id) return
	loading.value = true
	try {
		const response = await apiClient.get(adminEndpoints.productAttributes.show(props.attribute.id))
		attributeData.value = response.data?.data || response.data
	} catch (e) {
		attributeData.value = props.attribute
	} finally {
		loading.value = false
	}
}

async function handleSubmit(formData) {
	emit('updated', formData)
}

function onClose() {
	if (props.onClose) {
		props.onClose()
	}
}
</script>


