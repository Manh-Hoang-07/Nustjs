import type { Ref, ComputedRef } from 'vue'

// ===== MENU TYPES =====

export interface BaseMenuItem {
  id?: string
  name: string
  path?: string
  api?: string
  icon: string
  status: 'active' | 'inactive'
  children?: BaseMenuItem[]
  permissions?: string[]
  roles?: string[]
  requiresAuth?: boolean
  order?: number
  parentId?: string
  type?: 'admin' | 'user' | 'public'
  external?: boolean
  target?: '_blank' | '_self'
  badge?: {
    text: string
    color?: string
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  }
  tooltip?: string
  disabled?: boolean
}

export interface MenuItem extends BaseMenuItem {
  children?: MenuItem[]
}

export type MenuType = 'user' | 'cart' | 'search' | 'support' | 'default' | 'admin'

// ===== NAVIGATION TYPES =====

export interface NavigationResult {
  navigateTo: (path: string) => void
  navigateToWithQuery: (path: string, query?: Record<string, any>) => void
  updateQuery: (newQuery?: Record<string, any>) => void
}

export interface AdminNavigationResult {
  menuItems: ComputedRef<MenuItem[]>
  currentPath: ComputedRef<string>
  isActiveMenuItem: (item: MenuItem) => boolean
}

export interface UserNavigationResult {
  menuItems: ComputedRef<MenuItem[]>
  userMenuItems: ComputedRef<MenuItem[]>
  currentPath: ComputedRef<string>
  getMenuItemsByType: (type: MenuType) => MenuItem[]
  isActiveMenuItem: (item: MenuItem) => boolean
}

// ===== MENU STATE TYPES =====

export interface MenuStateResult {
  isOpen: Ref<boolean>
  toggleMenu: () => void
  openMenu: () => void
  closeMenu: () => void
}

// ===== PERMISSION GUARD TYPES =====

export interface PermissionGuardOptions {
  requiresAuth?: boolean
  roles?: string[]
  permissions?: string[]
  redirectTo?: string
  fallbackPath?: string
}

export interface RouteGuardResult {
  hasAccess: boolean
  redirectPath?: string
  reason?: string
}

export interface PermissionGuardResult {
  guardRoute: (options: PermissionGuardOptions) => boolean
  checkAccess: (options: PermissionGuardOptions) => RouteGuardResult
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
}

// ===== MENU BUILDER TYPES =====

export interface MenuBuilderOptions {
  type?: MenuType
  filterByStatus?: boolean
  sortByOrder?: boolean
  includeInactive?: boolean
}

export interface MenuBuilderResult {
  buildMenu: (items: MenuItem[], options?: MenuBuilderOptions) => MenuItem[]
  filterByPermissions: (items: MenuItem[], userPermissions: string[]) => MenuItem[]
  filterByRoles: (items: MenuItem[], userRoles: string[]) => MenuItem[]
  sortByOrder: (items: MenuItem[]) => MenuItem[]
  findMenuItem: (path: string, items: MenuItem[]) => MenuItem | null
  getBreadcrumbs: (path: string, items: MenuItem[]) => MenuItem[]
}

// ===== ROUTE TYPES =====

export interface RouteInfo {
  path: string
  name?: string
  query?: Record<string, any>
  params?: Record<string, any>
  meta?: Record<string, any>
}

export interface NavigationOptions {
  replace?: boolean
  query?: Record<string, any>
  params?: Record<string, any>
  meta?: Record<string, any>
}

// ===== BREADCRUMB TYPES =====

export interface BreadcrumbItem {
  name: string
  path: string
  icon?: string
  disabled?: boolean
}

export interface BreadcrumbResult {
  items: ComputedRef<BreadcrumbItem[]>
  addBreadcrumb: (item: BreadcrumbItem) => void
  removeBreadcrumb: (path: string) => void
  clearBreadcrumbs: () => void
}

// ===== MENU FILTER TYPES =====

export interface MenuFilterOptions {
  status?: 'active' | 'inactive' | 'all'
  type?: MenuType
  permissions?: string[]
  roles?: string[]
  requiresAuth?: boolean
}

export interface MenuFilterResult {
  filterMenu: (items: MenuItem[], options: MenuFilterOptions) => MenuItem[]
  filterByStatus: (items: MenuItem[], status: 'active' | 'inactive' | 'all') => MenuItem[]
  filterByType: (items: MenuItem[], type: MenuType) => MenuItem[]
  filterByPermissions: (items: MenuItem[], permissions: string[]) => MenuItem[]
  filterByRoles: (items: MenuItem[], roles: string[]) => MenuItem[]
}

// ===== MENU VALIDATION TYPES =====

export interface MenuValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface MenuValidator {
  validateMenuItem: (item: MenuItem) => MenuValidationResult
  validateMenuStructure: (items: MenuItem[]) => MenuValidationResult
  checkCircularReferences: (items: MenuItem[]) => boolean
  checkDuplicatePaths: (items: MenuItem[]) => string[]
}

// ===== MENU EVENTS TYPES =====

export interface MenuEvent {
  type: 'click' | 'hover' | 'focus' | 'blur'
  item: MenuItem
  timestamp: number
}

export interface MenuEventHandler {
  (event: MenuEvent): void
}

export interface MenuEventResult {
  onMenuItemClick: (handler: MenuEventHandler) => void
  onMenuItemHover: (handler: MenuEventHandler) => void
  emitEvent: (event: MenuEvent) => void
}

// ===== MENU CONFIGURATION TYPES =====

export interface MenuConfig {
  defaultType?: MenuType
  enableBreadcrumbs?: boolean
  enablePermissions?: boolean
  enableRoles?: boolean
  enableOrdering?: boolean
  enableBadges?: boolean
  enableTooltips?: boolean
  maxDepth?: number
  animationDuration?: number
}

export interface MenuConfigResult {
  config: Ref<MenuConfig>
  updateConfig: (newConfig: Partial<MenuConfig>) => void
  resetConfig: () => void
}

// ===== MENU CACHE TYPES =====

export interface MenuCacheItem {
  items: MenuItem[]
  timestamp: number
  ttl: number
}

export interface MenuCacheResult {
  getCachedMenu: (key: string) => MenuItem[] | null
  setCachedMenu: (key: string, items: MenuItem[], ttl?: number) => void
  clearCache: () => void
  isExpired: (key: string) => boolean
}

// ===== MENU ANALYTICS TYPES =====

export interface MenuAnalytics {
  clickCount: number
  lastClicked: Date | null
  popularItems: MenuItem[]
  userPreferences: Record<string, any>
}

export interface MenuAnalyticsResult {
  analytics: Ref<MenuAnalytics>
  trackClick: (item: MenuItem) => void
  getPopularItems: (limit?: number) => MenuItem[]
  getUserPreferences: () => Record<string, any>
  updateUserPreferences: (preferences: Record<string, any>) => void
}
