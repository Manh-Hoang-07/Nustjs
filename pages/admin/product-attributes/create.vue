<template>
	<div>
		<AttributeForm 
			v-if="showModal"
			:show="showModal"
			:attribute="null"
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

const props = defineProps({
	show: Boolean,
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

const emit = defineEmits(['created'])

const showModal = ref(false)

watch(() => props.show, (newValue) => {
	showModal.value = newValue
}, { immediate: true })

async function handleSubmit(formData) {
	emit('created', formData)
}

function onClose() {
	if (props.onClose) {
		props.onClose()
	}
}
</script>


