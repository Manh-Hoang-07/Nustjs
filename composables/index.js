// Main Composables Index
// Re-export all composables from subdirectories

// API Composables
export * from './api/index.js'

// Form Composables  
export * from './form/index.js'

// UI Composables
export * from './ui/index.js'

// Data Composables
export * from './data/index.js'

// Utils Composables
export * from './utils/index.js'

// Individual imports for backward compatibility
export { useApiClient } from './api/useApiClient.js'
export { default as useCrudAdmin } from './data/useCrudAdmin.js'
export { useDataTable } from './data/useDataTable.js'
export { useFastEnums } from './data/useFastEnums.js'
export { useSearch } from './data/useSearch.js'
export { default as useFormManager } from './form/useFormManager.js'
export { default as useFormErrors } from './form/useFormErrors.js'
export { default as useFormData } from './form/useFormData.js'
export { default as useModal } from './ui/useModal.js'
export { default as usePagination } from './ui/usePagination.js'
export { default as useTableSelection } from './ui/useTableSelection.js'
export { default as useToast } from './ui/useToast.js'
export { default as useAuthInit } from './utils/useAuthInit.js'
export { default as useSyncQueryPagination } from './utils/useSyncQueryPagination.js'
export { default as useApiFetch } from './api/useApiFetch.js'
export { default as useApiOptions } from './api/useApiOptions.js' 