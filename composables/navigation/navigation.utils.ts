import type { 
  MenuItem, 
  MenuType, 
  MenuFilterOptions, 
  MenuValidationResult,
  BreadcrumbItem,
  MenuEvent,
  MenuConfig
} from './navigation.types'

// ===== MENU FILTER UTILITIES =====

/**
 * Filter menu items by status
 */
export function filterByStatus(
  items: MenuItem[], 
  status: 'active' | 'inactive' | 'all' = 'active'
): MenuItem[] {
  if (status === 'all') return items
  return items.filter(item => item.status === status)
}

/**
 * Filter menu items by type
 */
export function filterByType(items: MenuItem[], type: MenuType): MenuItem[] {
  return items.filter(item => item.type === type)
}

/**
 * Filter menu items by permissions
 */
export function filterByPermissions(
  items: MenuItem[], 
  userPermissions: string[]
): MenuItem[] {
  return items.filter(item => {
    if (!item.permissions || item.permissions.length === 0) return true
    return item.permissions.some(permission => userPermissions.includes(permission))
  })
}

/**
 * Filter menu items by roles
 */
export function filterByRoles(items: MenuItem[], userRoles: string[]): MenuItem[] {
  return items.filter(item => {
    if (!item.roles || item.roles.length === 0) return true
    return item.roles.some(role => userRoles.includes(role))
  })
}

/**
 * Filter menu items by authentication requirement
 */
export function filterByAuthRequirement(
  items: MenuItem[], 
  isAuthenticated: boolean
): MenuItem[] {
  return items.filter(item => {
    if (item.requiresAuth === undefined) return true
    return item.requiresAuth === isAuthenticated
  })
}

/**
 * Comprehensive menu filter
 */
export function filterMenu(
  items: MenuItem[], 
  options: MenuFilterOptions
): MenuItem[] {
  let filteredItems = [...items]

  if (options.status) {
    filteredItems = filterByStatus(filteredItems, options.status)
  }

  if (options.type) {
    filteredItems = filterByType(filteredItems, options.type)
  }

  if (options.permissions) {
    filteredItems = filterByPermissions(filteredItems, options.permissions)
  }

  if (options.roles) {
    filteredItems = filterByRoles(filteredItems, options.roles)
  }

  return filteredItems
}

// ===== MENU SORT UTILITIES =====

/**
 * Sort menu items by order
 */
export function sortByOrder(items: MenuItem[]): MenuItem[] {
  return items.sort((a, b) => {
    const orderA = a.order ?? 999
    const orderB = b.order ?? 999
    return orderA - orderB
  })
}

/**
 * Sort menu items by name
 */
export function sortByName(items: MenuItem[]): MenuItem[] {
  return items.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Sort menu items by path
 */
export function sortByPath(items: MenuItem[]): MenuItem[] {
  return items.sort((a, b) => {
    const pathA = a.path ?? ''
    const pathB = b.path ?? ''
    return pathA.localeCompare(pathB)
  })
}

// ===== MENU SEARCH UTILITIES =====

/**
 * Find menu item by path
 */
export function findMenuItem(
  path: string, 
  items: MenuItem[]
): MenuItem | null {
  for (const item of items) {
    if (item.path === path) return item
    
    if (item.children) {
      const found = findMenuItem(path, item.children)
      if (found) return found
    }
  }
  return null
}

/**
 * Find menu items by name pattern
 */
export function findMenuItemsByName(
  pattern: string, 
  items: MenuItem[]
): MenuItem[] {
  const results: MenuItem[] = []
  const regex = new RegExp(pattern, 'i')
  
  for (const item of items) {
    if (regex.test(item.name)) {
      results.push(item)
    }
    
    if (item.children) {
      results.push(...findMenuItemsByName(pattern, item.children))
    }
  }
  
  return results
}

/**
 * Get all menu paths
 */
export function getAllMenuPaths(items: MenuItem[]): string[] {
  const paths: string[] = []
  
  for (const item of items) {
    if (item.path) {
      paths.push(item.path)
    }
    
    if (item.children) {
      paths.push(...getAllMenuPaths(item.children))
    }
  }
  
  return paths
}

// ===== BREADCRUMB UTILITIES =====

/**
 * Generate breadcrumbs from path
 */
export function generateBreadcrumbs(
  path: string, 
  items: MenuItem[]
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []
  const pathSegments = path.split('/').filter(Boolean)
  
  let currentPath = ''
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    const item = findMenuItem(currentPath, items)
    
    if (item) {
      breadcrumbs.push({
        name: item.name,
        path: item.path!,
        icon: item.icon,
        disabled: item.disabled
      })
    }
  }
  
  return breadcrumbs
}

/**
 * Check if path is active
 */
export function isPathActive(
  currentPath: string, 
  itemPath: string
): boolean {
  if (currentPath === itemPath) return true
  
  // Check if current path starts with item path (for nested routes)
  return currentPath.startsWith(itemPath + '/')
}

/**
 * Check if menu item is active
 */
export function isMenuItemActive(
  item: MenuItem, 
  currentPath: string
): boolean {
  if (!item.path) return false
  
  if (isPathActive(currentPath, item.path)) return true
  
  // Check children
  if (item.children) {
    return item.children.some(child => isMenuItemActive(child, currentPath))
  }
  
  return false
}

// ===== MENU VALIDATION UTILITIES =====

/**
 * Validate menu item
 */
export function validateMenuItem(item: MenuItem): MenuValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  if (!item.name) {
    errors.push('Menu item must have a name')
  }
  
  if (!item.icon) {
    warnings.push('Menu item should have an icon')
  }
  
  // Path validation
  if (item.path && !item.path.startsWith('/')) {
    errors.push('Menu item path must start with "/"')
  }
  
  // External link validation
  if (item.external && !item.path?.startsWith('http')) {
    errors.push('External menu items must have a valid URL')
  }
  
  // Badge validation
  if (item.badge && !item.badge.text) {
    errors.push('Badge must have text')
  }
  
  // Children validation
  if (item.children) {
    const childValidation = validateMenuStructure(item.children)
    errors.push(...childValidation.errors)
    warnings.push(...childValidation.warnings)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate menu structure
 */
export function validateMenuStructure(items: MenuItem[]): MenuValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check for duplicate paths
  const paths = getAllMenuPaths(items)
  const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index)
  if (duplicatePaths.length > 0) {
    errors.push(`Duplicate paths found: ${duplicatePaths.join(', ')}`)
  }
  
  // Check for circular references
  if (checkCircularReferences(items)) {
    errors.push('Circular references detected in menu structure')
  }
  
  // Validate each item
  for (const item of items) {
    const validation = validateMenuItem(item)
    errors.push(...validation.errors)
    warnings.push(...validation.warnings)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Check for circular references
 */
export function checkCircularReferences(items: MenuItem[]): boolean {
  const visited = new Set<string>()
  const visiting = new Set<string>()
  
  function hasCycle(item: MenuItem): boolean {
    if (visiting.has(item.id || item.path || '')) return true
    if (visited.has(item.id || item.path || '')) return false
    
    visiting.add(item.id || item.path || '')
    
    if (item.children) {
      for (const child of item.children) {
        if (hasCycle(child)) return true
      }
    }
    
    visiting.delete(item.id || item.path || '')
    visited.add(item.id || item.path || '')
    
    return false
  }
  
  for (const item of items) {
    if (hasCycle(item)) return true
  }
  
  return false
}

// ===== MENU BUILDER UTILITIES =====

/**
 * Build menu with options
 */
export function buildMenu(
  items: MenuItem[], 
  options: {
    filterByStatus?: boolean
    sortByOrder?: boolean
    includeInactive?: boolean
  } = {}
): MenuItem[] {
  let result = [...items]
  
  if (options.filterByStatus !== false) {
    result = filterByStatus(result, options.includeInactive ? 'all' : 'active')
  }
  
  if (options.sortByOrder) {
    result = sortByOrder(result)
  }
  
  return result
}

/**
 * Flatten menu structure
 */
export function flattenMenu(items: MenuItem[]): MenuItem[] {
  const flattened: MenuItem[] = []
  
  for (const item of items) {
    flattened.push(item)
    
    if (item.children) {
      flattened.push(...flattenMenu(item.children))
    }
  }
  
  return flattened
}

/**
 * Get menu depth
 */
export function getMenuDepth(items: MenuItem[]): number {
  let maxDepth = 0
  
  function calculateDepth(item: MenuItem, currentDepth: number): void {
    maxDepth = Math.max(maxDepth, currentDepth)
    
    if (item.children) {
      for (const child of item.children) {
        calculateDepth(child, currentDepth + 1)
      }
    }
  }
  
  for (const item of items) {
    calculateDepth(item, 1)
  }
  
  return maxDepth
}

// ===== MENU EVENT UTILITIES =====

/**
 * Create menu event
 */
export function createMenuEvent(
  type: 'click' | 'hover' | 'focus' | 'blur',
  item: MenuItem
): MenuEvent {
  return {
    type,
    item,
    timestamp: Date.now()
  }
}

/**
 * Track menu analytics
 */
export function trackMenuClick(item: MenuItem): void {
  // This could be extended to send analytics data
  console.log('Menu item clicked:', item.name, item.path)
}

// ===== MENU CONFIG UTILITIES =====

/**
 * Create default menu config
 */
export function createDefaultMenuConfig(): MenuConfig {
  return {
    defaultType: 'default',
    enableBreadcrumbs: true,
    enablePermissions: true,
    enableRoles: true,
    enableOrdering: true,
    enableBadges: true,
    enableTooltips: true,
    maxDepth: 3,
    animationDuration: 300
  }
}

/**
 * Merge menu configs
 */
export function mergeMenuConfigs(
  base: MenuConfig,
  override: Partial<MenuConfig>
): MenuConfig {
  return { ...base, ...override }
}

// ===== MENU CACHE UTILITIES =====

/**
 * Check if cache is expired
 */
export function isNavigationCacheExpired(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp > ttl
}

/**
 * Generate cache key
 */
export function generateNavigationCacheKey(
  type: MenuType,
  options: MenuFilterOptions
): string {
  return `${type}:${JSON.stringify(options)}`
}

// ===== MENU PERMISSION UTILITIES =====

/**
 * Check if user has required role
 */
export function hasRequiredRole(
  userRoles: string[], 
  requiredRoles: string[]
): boolean {
  if (requiredRoles.length === 0) return true
  return requiredRoles.some(role => userRoles.includes(role))
}

/**
 * Check if user has required permission
 */
export function hasRequiredPermission(
  userPermissions: string[], 
  requiredPermissions: string[]
): boolean {
  if (requiredPermissions.length === 0) return true
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

/**
 * Check menu item access
 */
export function checkMenuItemAccess(
  item: MenuItem,
  userRoles: string[] = [],
  userPermissions: string[] = [],
  isAuthenticated: boolean = false
): boolean {
  // Check authentication requirement
  if (item.requiresAuth && !isAuthenticated) return false
  
  // Check roles
  if (item.roles && !hasRequiredRole(userRoles, item.roles)) return false
  
  // Check permissions
  if (item.permissions && !hasRequiredPermission(userPermissions, item.permissions)) return false
  
  return true
}
