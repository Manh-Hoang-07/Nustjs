<template>
  <Modal v-model="modalVisible" :title="formTitle">
    <FormWrapper
      :default-values="defaultValues"
      :rules="validationRules"
      :api-errors="apiErrors"
      :submit-text="permission ? 'Cập nhật' : 'Thêm mới'"
      @submit="handleSubmit"
      @cancel="onClose"
    >
      <template #default="{ form, errors, clearError, isSubmitting }">
        <!-- Tên quyền -->
        <FormField
          v-model="form.name"
          label="Tên quyền"
          name="name"
          :error="errors.name"
          required
          autocomplete="off"
          @update:model-value="clearError('name')"
        />
        
        <!-- Tên hiển thị -->
        <FormField
          v-model="form.display_name"
          label="Tên hiển thị"
          name="display_name"
          :error="errors.display_name"
          autocomplete="off"
          @update:model-value="clearError('display_name')"
        />
        
        <!-- Guard -->
        <FormField
          v-model="form.guard_name"
          label="Guard"
          name="guard_name"
          :error="errors.guard_name"
          autocomplete="off"
          @update:model-value="clearError('guard_name')"
        />
        
        <!-- Quyền cha -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Quyền cha
          </label>
          <SearchableSelect
            v-model="form.parent_id"
            :search-api="permissionsListApi"
            :exclude-id="permission?.id"
            :error="errors.parent_id"
            placeholder="Tìm kiếm quyền cha..."
            @update:model-value="clearError('parent_id')"
          />
          <div v-if="errors.parent_id" class="mt-1 text-sm text-red-600">
            {{ errors.parent_id }}
          </div>
        </div>
        
        <!-- Trạng thái -->
        <FormField
          v-model="form.status"
          label="Trạng thái"
          name="status"
          type="select"
          :options="statusOptions"
          :error="errors.status"
          @update:model-value="clearError('status')"
        />
      </template>
    </FormWrapper>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import FormWrapper from '@/components/Core/Form/FormWrapper.vue'
import FormField from '@/components/Core/Form/FormField.vue'
import SearchableSelect from '@/components/Core/Select/SearchableSelect.vue'
import { useFormDefaults } from '@/utils/form'

const props = defineProps({
  show: Boolean,
  permission: Object,
  statusEnums: {
    type: Array,
    default: () => []
  },
  apiErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formTitle = computed(() => props.permission ? 'Chỉnh sửa quyền' : 'Thêm quyền mới')
const modalVisible = computed({
  get: () => props.show,
  set: () => onClose()
})

const defaultValues = useFormDefaults(props, 'permission', {
  name: '',
  display_name: '',
  guard_name: 'web',
  parent_id: '',
  status: ''
})

const validationRules = computed(() => ({
  name: [
    { required: 'Tên quyền là bắt buộc.' },
    { max: [255, 'Tên quyền không được vượt quá 255 ký tự.'] }
  ],
  display_name: [
    { max: [255, 'Tên hiển thị không được vượt quá 255 ký tự.'] }
  ],
  guard_name: [
    { max: [255, 'Guard không được vượt quá 255 ký tự.'] }
  ]
}))

// API endpoint cho list permissions
const permissionsListApi = '/api/admin/permissions'


const statusOptions = computed(() =>
  (props.statusEnums || []).map(opt => ({
    value: opt.value,
    label: opt.label
  }))
)

function handleSubmit(form) {
  emit('submit', form)
}

function onClose() {
  emit('cancel')
}
</script> 

