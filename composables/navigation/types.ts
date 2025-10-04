// ===== NAVIGATION TYPES =====

export interface BaseMenuItem {
  id?: string
  name: string
  path?: string
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

export interface AdminNavigationResult {
  menuItems: any
  currentPath: any
  isActiveMenuItem: (item: MenuItem) => boolean
}

export interface UserNavigationResult {
  menuItems: any
  userMenuItems: any
  currentPath: any
  getMenuItemsByType: (type: MenuType) => MenuItem[]
  isActiveMenuItem: (item: MenuItem) => boolean
}
