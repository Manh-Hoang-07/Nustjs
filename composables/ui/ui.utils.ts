import type { 
  ToastType, 
  ToastOptions, 
  ModalOptions,
  PaginationOptions,
  TableSelectionOptions,
  LoadingOptions,
  DropdownOptions,
  TooltipOptions,
  PopoverOptions,
  DrawerOptions,
  TabsOptions,
  AccordionOptions,
  CarouselOptions,
  FormOptions,
  SearchOptions,
  FilterOptions,
  SortOptions,
  NotificationOptions,
  ConfirmationOptions,
  DragDropOptions,
  ResizeOptions,
  ScrollOptions,
  AnimationOptions
} from './ui.types'

// ===== MODAL UTILITIES =====

/**
 * Create modal options with defaults
 */
export function createModalOptions(options: Partial<ModalOptions> = {}): ModalOptions {
  return {
    initialState: false,
    closeOnEscape: true,
    closeOnOverlay: true,
    onOpen: undefined,
    onClose: undefined,
    beforeClose: undefined,
    ...options
  }
}

/**
 * Check if modal should close
 */
export function shouldCloseModal(
  event: KeyboardEvent | MouseEvent,
  options: ModalOptions
): boolean {
  if (event instanceof KeyboardEvent) {
    return (options.closeOnEscape ?? true) && event.key === 'Escape'
  }
  
  if (event instanceof MouseEvent) {
    return (options.closeOnOverlay ?? true) && event.target === event.currentTarget
  }
  
  return false
}

// ===== TOAST UTILITIES =====

/**
 * Create toast options with defaults
 */
export function createToastOptions(options: Partial<ToastOptions> = {}): ToastOptions {
  return {
    duration: 3000,
    position: 'top-right',
    closable: true,
    persistent: false,
    ...options
  }
}

/**
 * Generate unique toast ID
 */
export function generateToastId(): number {
  return Date.now() + Math.random()
}

/**
 * Get toast type styles
 */
export function getToastStyles(type: ToastType): Record<string, string> {
  const styles: Record<ToastType, Record<string, string>> = {
    success: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      borderColor: '#059669'
    },
    error: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      borderColor: '#dc2626'
    },
    warning: {
      backgroundColor: '#f59e0b',
      color: '#ffffff',
      borderColor: '#d97706'
    },
    info: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderColor: '#2563eb'
    }
  }
  
  return styles[type]
}

/**
 * Get toast icon
 */
export function getToastIcon(type: ToastType): string {
  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  
  return icons[type]
}

// ===== PAGINATION UTILITIES =====

/**
 * Create pagination options with defaults
 */
export function createPaginationOptions(options: Partial<PaginationOptions> = {}): PaginationOptions {
  return {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: true,
    pageSizeOptions: [10, 20, 50, 100],
    hideOnSinglePage: false,
    ...options
  }
}

/**
 * Calculate pagination info
 */
export function calculatePaginationInfo(
  current: number,
  pageSize: number,
  total: number
): {
  totalPages: number
  startItem: number
  endItem: number
  hasNext: boolean
  hasPrev: boolean
} {
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (current - 1) * pageSize + 1
  const endItem = Math.min(current * pageSize, total)
  const hasNext = current < totalPages
  const hasPrev = current > 1
  
  return {
    totalPages,
    startItem,
    endItem,
    hasNext,
    hasPrev
  }
}

/**
 * Generate page numbers for pagination
 */
export function generatePageNumbers(
  current: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  const pages: (number | string)[] = []
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push('...')
    }
    pages.push(totalPages)
  }
  
  return pages
}

// ===== TABLE SELECTION UTILITIES =====

/**
 * Create table selection options with defaults
 */
export function createTableSelectionOptions<T = any>(
  options: Partial<TableSelectionOptions<T>> = {}
): TableSelectionOptions<T> {
  return {
    keyField: 'id',
    multiSelect: true,
    onSelectionChange: undefined,
    ...options
  }
}

/**
 * Get item key for selection
 */
export function getItemKey<T>(item: T, keyField: string): string | number {
  return (item as any)[keyField]
}

/**
 * Check if item is selected
 */
export function isItemSelected<T>(
  item: T,
  selectedKeys: Set<string | number>,
  keyField: string
): boolean {
  const key = getItemKey(item, keyField)
  return selectedKeys.has(key)
}

/**
 * Toggle item selection
 */
export function toggleUiItemSelection<T>(
  item: T,
  selectedItems: T[],
  selectedKeys: Set<string | number>,
  keyField: string,
  multiSelect: boolean
): { selectedItems: T[]; selectedKeys: Set<string | number> } {
  const key = getItemKey(item, keyField)
  
  if (!multiSelect) {
    // Single select mode
    return {
      selectedItems: [item],
      selectedKeys: new Set([key])
    }
  }
  
  // Multi select mode
  if (selectedKeys.has(key)) {
    // Deselect
    return {
      selectedItems: selectedItems.filter(i => getItemKey(i, keyField) !== key),
      selectedKeys: new Set([...selectedKeys].filter(k => k !== key))
    }
  } else {
    // Select
    return {
      selectedItems: [...selectedItems, item],
      selectedKeys: new Set([...selectedKeys, key])
    }
  }
}

/**
 * Select all items
 */
export function selectAllItems<T>(
  items: T[],
  selectedItems: T[],
  selectedKeys: Set<string | number>,
  keyField: string
): { selectedItems: T[]; selectedKeys: Set<string | number> } {
  const allKeys = new Set(items.map(item => getItemKey(item, keyField)))
  const isAllSelected = selectedItems.length === items.length
  
  if (isAllSelected) {
    // Deselect all
    return {
      selectedItems: [],
      selectedKeys: new Set()
    }
  } else {
    // Select all
    return {
      selectedItems: [...items],
      selectedKeys: allKeys
    }
  }
}

// ===== LOADING UTILITIES =====

/**
 * Create loading options with defaults
 */
export function createLoadingOptions(options: Partial<LoadingOptions> = {}): LoadingOptions {
  return {
    text: 'Loading...',
    spinner: true,
    overlay: true,
    fullscreen: false,
    ...options
  }
}

/**
 * Get loading spinner HTML
 */
export function getLoadingSpinnerHTML(): string {
  return `
    <div class="loading-spinner">
      <div class="spinner"></div>
    </div>
  `
}

// ===== DROPDOWN UTILITIES =====

/**
 * Create dropdown options with defaults
 */
export function createDropdownOptions(options: Partial<DropdownOptions> = {}): DropdownOptions {
  return {
    trigger: 'click',
    placement: 'bottom',
    offset: 0,
    closeOnClick: true,
    closeOnEscape: true,
    ...options
  }
}

/**
 * Calculate dropdown position
 */
export function calculateDropdownPosition(
  triggerRect: DOMRect,
  dropdownRect: DOMRect,
  placement: 'top' | 'bottom' | 'left' | 'right',
  offset: number = 0
): { top: number; left: number } {
  const { top, left, width, height } = triggerRect
  const { width: dropdownWidth, height: dropdownHeight } = dropdownRect
  
  switch (placement) {
    case 'top':
      return {
        top: top - dropdownHeight - offset,
        left: left + (width - dropdownWidth) / 2
      }
    case 'bottom':
      return {
        top: top + height + offset,
        left: left + (width - dropdownWidth) / 2
      }
    case 'left':
      return {
        top: top + (height - dropdownHeight) / 2,
        left: left - dropdownWidth - offset
      }
    case 'right':
      return {
        top: top + (height - dropdownHeight) / 2,
        left: left + width + offset
      }
    default:
      return { top: 0, left: 0 }
  }
}

// ===== TOOLTIP UTILITIES =====

/**
 * Create tooltip options with defaults
 */
export function createTooltipOptions(options: Partial<TooltipOptions> = {}): TooltipOptions {
  return {
    content: '',
    placement: 'top',
    trigger: 'hover',
    delay: 0,
    disabled: false,
    ...options
  }
}

/**
 * Calculate tooltip position
 */
export function calculateTooltipPosition(
  elementRect: DOMRect,
  tooltipRect: DOMRect,
  placement: 'top' | 'bottom' | 'left' | 'right'
): { top: number; left: number } {
  const { top, left, width, height } = elementRect
  const { width: tooltipWidth, height: tooltipHeight } = tooltipRect
  
  switch (placement) {
    case 'top':
      return {
        top: top - tooltipHeight - 8,
        left: left + (width - tooltipWidth) / 2
      }
    case 'bottom':
      return {
        top: top + height + 8,
        left: left + (width - tooltipWidth) / 2
      }
    case 'left':
      return {
        top: top + (height - tooltipHeight) / 2,
        left: left - tooltipWidth - 8
      }
    case 'right':
      return {
        top: top + (height - tooltipHeight) / 2,
        left: left + width + 8
      }
    default:
      return { top: 0, left: 0 }
  }
}

// ===== POPOVER UTILITIES =====

/**
 * Create popover options with defaults
 */
export function createPopoverOptions(options: Partial<PopoverOptions> = {}): PopoverOptions {
  return {
    trigger: 'click',
    placement: 'bottom',
    offset: 0,
    closeOnClick: true,
    closeOnEscape: true,
    arrow: true,
    ...options
  }
}

// ===== DRAWER UTILITIES =====

/**
 * Create drawer options with defaults
 */
export function createDrawerOptions(options: Partial<DrawerOptions> = {}): DrawerOptions {
  return {
    direction: 'right',
    size: '300px',
    closeOnEscape: true,
    closeOnOverlay: true,
    lockScroll: true,
    ...options
  }
}

/**
 * Get drawer transform style
 */
export function getDrawerTransform(
  direction: 'left' | 'right' | 'top' | 'bottom',
  isOpen: boolean,
  size: string | number
): string {
  const sizeValue = typeof size === 'number' ? `${size}px` : size
  
  if (!isOpen) {
    switch (direction) {
      case 'left':
        return `translateX(-100%)`
      case 'right':
        return `translateX(100%)`
      case 'top':
        return `translateY(-100%)`
      case 'bottom':
        return `translateY(100%)`
      default:
        return 'translateX(100%)'
    }
  }
  
  return 'translateX(0)'
}

// ===== TABS UTILITIES =====

/**
 * Create tabs options with defaults
 */
export function createTabsOptions(options: Partial<TabsOptions> = {}): TabsOptions {
  return {
    defaultActiveKey: '',
    type: 'line',
    size: 'medium',
    animated: true,
    ...options
  }
}

/**
 * Generate tab key
 */
export function generateTabKey(label: string, index: number): string {
  return `tab-${label.toLowerCase().replace(/\s+/g, '-')}-${index}`
}

// ===== ACCORDION UTILITIES =====

/**
 * Create accordion options with defaults
 */
export function createAccordionOptions(options: Partial<AccordionOptions> = {}): AccordionOptions {
  return {
    multiple: false,
    defaultActiveKeys: [],
    animated: true,
    ...options
  }
}

// ===== CAROUSEL UTILITIES =====

/**
 * Create carousel options with defaults
 */
export function createCarouselOptions(options: Partial<CarouselOptions> = {}): CarouselOptions {
  return {
    autoplay: false,
    interval: 3000,
    loop: true,
    dots: true,
    arrows: true,
    fade: false,
    ...options
  }
}

/**
 * Calculate carousel transform
 */
export function calculateCarouselTransform(
  currentIndex: number,
  totalSlides: number,
  fade: boolean = false
): string {
  if (fade) {
    return 'none'
  }
  
  return `translateX(-${currentIndex * 100}%)`
}

// ===== FORM UTILITIES =====

/**
 * Create form options with defaults
 */
export function createFormOptions(options: Partial<FormOptions> = {}): FormOptions {
  return {
    validateOnChange: true,
    validateOnBlur: true,
    showValidationMessage: true,
    ...options
  }
}

/**
 * Validate form field
 */
export function validateFormField(
  value: any,
  rules: {
    required?: boolean
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
): { isValid: boolean; message: string } {
  if (rules.required && (value === undefined || value === null || value === '')) {
    return {
      isValid: false,
      message: rules.message || 'This field is required'
    }
  }
  
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return {
        isValid: false,
        message: rules.message || `Value must be at least ${rules.min}`
      }
    }
    if (rules.max !== undefined && value > rules.max) {
      return {
        isValid: false,
        message: rules.message || `Value must be at most ${rules.max}`
      }
    }
  }
  
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return {
      isValid: false,
      message: rules.message || 'Invalid format'
    }
  }
  
  return { isValid: true, message: '' }
}

// ===== SEARCH UTILITIES =====

/**
 * Create search options with defaults
 */
export function createSearchOptions(options: Partial<SearchOptions> = {}): SearchOptions {
  return {
    placeholder: 'Search...',
    debounceMs: 300,
    minLength: 1,
    maxLength: 100,
    clearable: true,
    ...options
  }
}

/**
 * Debounce search function
 */
export function debounceSearch<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// ===== FILTER UTILITIES =====

/**
 * Create filter options with defaults
 */
export function createFilterOptions(options: Partial<FilterOptions> = {}): FilterOptions {
  return {
    debounceMs: 300,
    clearable: true,
    collapsible: false,
    ...options
  }
}

/**
 * Check if filters are active
 */
export function hasActiveFilters(filters: Record<string, any>): boolean {
  return Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  )
}

// ===== SORT UTILITIES =====

/**
 * Create sort options with defaults
 */
export function createSortOptions(options: Partial<SortOptions> = {}): SortOptions {
  return {
    defaultSort: '',
    multiple: false,
    ...options
  }
}

/**
 * Toggle sort direction
 */
export function toggleSortDirection(current: 'asc' | 'desc' | undefined): 'asc' | 'desc' {
  if (current === 'asc') return 'desc'
  if (current === 'desc') return 'asc'
  return 'asc'
}

// ===== NOTIFICATION UTILITIES =====

/**
 * Create notification options with defaults
 */
export function createNotificationOptions(options: Partial<NotificationOptions> = {}): NotificationOptions {
  return {
    title: '',
    message: '',
    type: 'info',
    duration: 5000,
    closable: true,
    position: 'top-right',
    ...options
  }
}

/**
 * Generate notification ID
 */
export function generateNotificationId(): number {
  return Date.now() + Math.random()
}

// ===== CONFIRMATION UTILITIES =====

/**
 * Create confirmation options with defaults
 */
export function createConfirmationOptions(options: Partial<ConfirmationOptions> = {}): ConfirmationOptions {
  return {
    title: 'Confirm',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    showCancel: true,
    ...options
  }
}

// ===== DRAG AND DROP UTILITIES =====

/**
 * Create drag drop options with defaults
 */
export function createDragDropOptions(options: Partial<DragDropOptions> = {}): DragDropOptions {
  return {
    group: '',
    sort: true,
    disabled: false,
    ghostClass: 'ghost',
    chosenClass: 'chosen',
    dragClass: 'drag',
    ...options
  }
}

// ===== RESIZE UTILITIES =====

/**
 * Create resize options with defaults
 */
export function createResizeOptions(options: Partial<ResizeOptions> = {}): ResizeOptions {
  return {
    minWidth: 100,
    maxWidth: 1000,
    minHeight: 100,
    maxHeight: 1000,
    disabled: false,
    ...options
  }
}

// ===== SCROLL UTILITIES =====

/**
 * Create scroll options with defaults
 */
export function createScrollOptions(options: Partial<ScrollOptions> = {}): ScrollOptions {
  return {
    threshold: 0,
    root: null,
    rootMargin: '0px',
    ...options
  }
}

// ===== ANIMATION UTILITIES =====

/**
 * Create animation options with defaults
 */
export function createAnimationOptions(options: Partial<AnimationOptions> = {}): AnimationOptions {
  return {
    duration: 300,
    easing: 'ease-in-out',
    delay: 0,
    fillMode: 'both',
    ...options
  }
}

/**
 * Get animation CSS
 */
export function getAnimationCSS(options: AnimationOptions): string {
  const { duration, easing, delay, fillMode } = options
  
  return `
    animation-duration: ${duration}ms;
    animation-timing-function: ${easing};
    animation-delay: ${delay}ms;
    animation-fill-mode: ${fillMode};
  `
}
