import type { Ref, ComputedRef } from 'vue'

// ===== MODAL TYPES =====

export interface ModalOptions {
  initialState?: boolean
  closeOnEscape?: boolean
  closeOnOverlay?: boolean
  onOpen?: (data: any) => void
  onClose?: (data: any) => void
  beforeClose?: (data: any) => Promise<boolean> | boolean
}

export interface ModalResult {
  // State
  isOpen: Ref<boolean>
  isLoading: Ref<boolean>
  data: Ref<any>
  
  // Computed
  isClosed: ComputedRef<boolean>
  
  // Methods
  open: (modalData?: any) => void
  close: () => Promise<boolean>
  toggle: () => void
  setLoading: (loading: boolean) => void
  setData: (newData: any) => void
  reset: () => void
  handleOverlayClick: (event: Event) => void
}

// ===== TOAST TYPES =====

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
  visible: boolean
}

export interface ToastOptions {
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  closable?: boolean
  persistent?: boolean
}

export interface ToastResult {
  toasts: Ref<Toast[]>
  showToast: (message: string, type?: ToastType, options?: ToastOptions) => number
  showSuccess: (message: string, options?: ToastOptions) => number
  showError: (message: string, options?: ToastOptions) => number
  showWarning: (message: string, options?: ToastOptions) => number
  showInfo: (message: string, options?: ToastOptions) => number
  removeToast: (id: number) => void
  clearAll: () => void
}

// ===== PAGINATION TYPES =====

export interface PaginationInit {
  current: number
  perPage: number
  total: number
}

export interface PaginationOptions {
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
  pageSizeOptions?: number[]
  hideOnSinglePage?: boolean
}

export interface PaginationResult {
  currentPage: Ref<number>
  perPage: Ref<number>
  total: Ref<number>
  setPage: (page: number) => void
  setTotal: (val: number) => void
  setPerPage: (size: number) => void
  nextPage: () => void
  prevPage: () => void
  firstPage: () => void
  lastPage: () => void
  canGoNext: ComputedRef<boolean>
  canGoPrev: ComputedRef<boolean>
  totalPages: ComputedRef<number>
}

// ===== TABLE SELECTION TYPES =====

export interface TableSelectionOptions<T = any> {
  keyField?: string
  multiSelect?: boolean
  onSelectionChange?: (selectedItems: T[]) => void
}

export interface TableSelectionResult<T = any> {
  // State
  selectedItems: Ref<T[]>
  selectedKeys: Ref<Set<string | number>>
  
  // Computed
  hasSelection: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
  isAllSelected: ComputedRef<boolean>
  isIndeterminate: ComputedRef<boolean>
  
  // Methods
  selectItem: (item: T) => void
  selectAll: () => void
  clearSelection: () => void
  isSelected: (item: T) => boolean
  getSelectedKeys: () => (string | number)[]
  selectByKeys: (keys: (string | number)[]) => void
  removeFromSelection: (item: T) => void
}

// ===== LOADING TYPES =====

export interface LoadingOptions {
  text?: string
  spinner?: boolean
  overlay?: boolean
  fullscreen?: boolean
}

export interface LoadingResult {
  isLoading: Ref<boolean>
  loadingText: Ref<string>
  show: (text?: string) => void
  hide: () => void
  setText: (text: string) => void
}

// ===== DROPDOWN TYPES =====

export interface DropdownOptions {
  trigger?: 'click' | 'hover' | 'focus'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  closeOnClick?: boolean
  closeOnEscape?: boolean
}

export interface DropdownResult {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
  handleTriggerClick: () => void
  handleOutsideClick: (event: Event) => void
}

// ===== TOOLTIP TYPES =====

export interface TooltipOptions {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  delay?: number
  disabled?: boolean
}

export interface TooltipResult {
  isVisible: Ref<boolean>
  show: () => void
  hide: () => void
  toggle: () => void
}

// ===== POPOVER TYPES =====

export interface PopoverOptions {
  trigger?: 'click' | 'hover' | 'focus'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  closeOnClick?: boolean
  closeOnEscape?: boolean
  arrow?: boolean
}

export interface PopoverResult {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
  handleTriggerClick: () => void
  handleOutsideClick: (event: Event) => void
}

// ===== DRAWER TYPES =====

export interface DrawerOptions {
  direction?: 'left' | 'right' | 'top' | 'bottom'
  size?: string | number
  closeOnEscape?: boolean
  closeOnOverlay?: boolean
  lockScroll?: boolean
}

export interface DrawerResult {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
  handleOverlayClick: (event: Event) => void
}

// ===== TABS TYPES =====

export interface TabItem {
  key: string
  label: string
  disabled?: boolean
  closable?: boolean
}

export interface TabsOptions {
  defaultActiveKey?: string
  type?: 'line' | 'card' | 'editable-card'
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

export interface TabsResult {
  activeKey: Ref<string>
  tabs: Ref<TabItem[]>
  addTab: (tab: TabItem) => void
  removeTab: (key: string) => void
  setActiveKey: (key: string) => void
  nextTab: () => void
  prevTab: () => void
}

// ===== ACCORDION TYPES =====

export interface AccordionItem {
  key: string
  title: string
  content: string
  disabled?: boolean
}

export interface AccordionOptions {
  multiple?: boolean
  defaultActiveKeys?: string[]
  animated?: boolean
}

export interface AccordionResult {
  activeKeys: Ref<string[]>
  items: Ref<AccordionItem[]>
  toggle: (key: string) => void
  open: (key: string) => void
  close: (key: string) => void
  isOpen: (key: string) => boolean
}

// ===== CAROUSEL TYPES =====

export interface CarouselOptions {
  autoplay?: boolean
  interval?: number
  loop?: boolean
  dots?: boolean
  arrows?: boolean
  fade?: boolean
}

export interface CarouselResult {
  currentIndex: Ref<number>
  totalSlides: Ref<number>
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  canGoNext: ComputedRef<boolean>
  canGoPrev: ComputedRef<boolean>
}

// ===== FORM TYPES =====

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
}

export interface FormOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showValidationMessage?: boolean
}

export interface FormResult {
  values: Ref<Record<string, any>>
  errors: Ref<Record<string, string>>
  isValid: ComputedRef<boolean>
  setValue: (name: string, value: any) => void
  getValue: (name: string) => any
  setError: (name: string, message: string) => void
  clearError: (name: string) => void
  validate: () => boolean
  reset: () => void
  submit: () => void
}

// ===== SEARCH TYPES =====

export interface SearchOptions {
  placeholder?: string
  debounceMs?: number
  minLength?: number
  maxLength?: number
  clearable?: boolean
}

export interface SearchResult {
  query: Ref<string>
  isSearching: Ref<boolean>
  results: Ref<any[]>
  setQuery: (query: string) => void
  clear: () => void
  search: (query: string) => Promise<void>
}

// ===== FILTER TYPES =====

export interface FilterOption {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'text'
  options?: Array<{ label: string; value: any }>
  multiple?: boolean
}

export interface FilterOptions {
  debounceMs?: number
  clearable?: boolean
  collapsible?: boolean
}

export interface FilterResult {
  filters: Ref<Record<string, any>>
  setFilter: (key: string, value: any) => void
  getFilter: (key: string) => any
  clearFilter: (key: string) => void
  clearAll: () => void
  hasActiveFilters: ComputedRef<boolean>
}

// ===== SORT TYPES =====

export interface SortOption {
  key: string
  label: string
  direction?: 'asc' | 'desc'
}

export interface SortOptions {
  defaultSort?: string
  multiple?: boolean
}

export interface SortResult {
  sortBy: Ref<string>
  sortDirection: Ref<'asc' | 'desc'>
  setSort: (key: string, direction?: 'asc' | 'desc') => void
  toggleSort: (key: string) => void
  clearSort: () => void
  getSortString: () => string
}

// ===== NOTIFICATION TYPES =====

export interface NotificationOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  closable?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export interface NotificationResult {
  notifications: Ref<NotificationOptions[]>
  show: (options: NotificationOptions) => number
  success: (message: string, title?: string) => number
  error: (message: string, title?: string) => number
  warning: (message: string, title?: string) => number
  info: (message: string, title?: string) => number
  remove: (id: number) => void
  clearAll: () => void
}

// ===== CONFIRMATION TYPES =====

export interface ConfirmationOptions {
  title?: string
  message: string
  type?: 'warning' | 'danger' | 'info'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

export interface ConfirmationResult {
  show: (options: ConfirmationOptions) => Promise<boolean>
  confirm: (message: string, title?: string) => Promise<boolean>
  alert: (message: string, title?: string) => Promise<void>
}

// ===== DRAG AND DROP TYPES =====

export interface DragDropOptions {
  group?: string
  sort?: boolean
  disabled?: boolean
  ghostClass?: string
  chosenClass?: string
  dragClass?: string
}

export interface DragDropResult {
  isDragging: Ref<boolean>
  draggedItem: Ref<any>
  startDrag: (item: any) => void
  endDrag: () => void
  canDrop: (item: any, target: any) => boolean
  onDrop: (item: any, target: any) => void
}

// ===== RESIZE TYPES =====

export interface ResizeOptions {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  disabled?: boolean
}

export interface ResizeResult {
  isResizing: Ref<boolean>
  width: Ref<number>
  height: Ref<number>
  startResize: () => void
  endResize: () => void
  resize: (width: number, height: number) => void
}

// ===== SCROLL TYPES =====

export interface ScrollOptions {
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export interface ScrollResult {
  isVisible: Ref<boolean>
  scrollTop: Ref<number>
  scrollLeft: Ref<number>
  scrollTo: (x: number, y: number) => void
  scrollToTop: () => void
  scrollToBottom: () => void
  scrollToElement: (element: Element) => void
}

// ===== ANIMATION TYPES =====

export interface AnimationOptions {
  duration?: number
  easing?: string
  delay?: number
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
}

export interface AnimationResult {
  isAnimating: Ref<boolean>
  play: (element: Element, animation: string) => Promise<void>
  stop: (element: Element) => void
  pause: (element: Element) => void
  resume: (element: Element) => void
}
