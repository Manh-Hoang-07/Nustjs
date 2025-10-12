// ===== SYSTEM CONFIG TYPES =====

export interface SystemConfigItem {
  id: string | number
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'json' | 'array'
  group: string
  description?: string
  is_public?: boolean
  created_at?: string
  updated_at?: string
}

export interface SystemConfigGeneral {
  // System info (từ API thực tế)
  name?: string
  version?: string
  timezone?: string
  
  // Dynamic keys cho các config khác có thể có trong tương lai
  [key: string]: any
}

export interface SystemConfigCache {
  data: SystemConfigGeneral
  timestamp: number
  ttl: number
}

// ===== SYSTEM CONFIG COMPOSABLE TYPES =====

export interface SystemConfigOptions {
  forceRefresh?: boolean
  enableCache?: boolean
}

export interface SystemConfigResult {
  // State
  data: Readonly<Ref<SystemConfigGeneral | null>>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<any>>
  
  // Computed
  isCacheValid: ComputedRef<boolean>
  systemInfo: ComputedRef<{
    name: string
    version: string
    timezone: string
  }>
  
  // Methods
  getData: () => Promise<SystemConfigGeneral | null>
  fetchData: () => Promise<void>
  refresh: () => Promise<void>
  clearCache: () => void
  getConfigValue: (key: string, defaultValue?: any) => any
}
