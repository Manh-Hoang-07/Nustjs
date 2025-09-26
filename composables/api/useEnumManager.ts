import { ref } from 'vue'
import { useApiClient } from './useApiClient'
import { adminEndpoints } from '@/api/endpoints'

// Simple enum manager to avoid duplicate API calls
const enumCache = new Map<string, any[]>()
const loadingStates = new Map<string, boolean>()

export function useEnumManager() {
  const { apiClient } = useApiClient()

  /**
   * Get enum data with simple caching
   */
  const getEnum = async (type: string): Promise<any[]> => {
    // Return cached data if available
    if (enumCache.has(type)) {
      return enumCache.get(type) || []
    }

    // Check if already loading
    if (loadingStates.get(type)) {
      // Wait for existing request to complete
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!loadingStates.get(type)) {
            resolve(enumCache.get(type) || [])
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }

    // Set loading state
    loadingStates.set(type, true)

    try {
      const response = await apiClient.get(adminEndpoints.enums(type))
      
      if (response.data?.success) {
        const data = response.data.data || []
        enumCache.set(type, data)
        return data
      } else {
        enumCache.set(type, [])
        return []
      }
    } catch (error) {
      console.error(`Error fetching enum ${type}:`, error)
      enumCache.set(type, [])
      return []
    } finally {
      loadingStates.set(type, false)
    }
  }

  /**
   * Clear cache for specific enum type
   */
  const clearEnumCache = (type: string): void => {
    enumCache.delete(type)
    loadingStates.delete(type)
  }

  /**
   * Clear all enum cache
   */
  const clearAllCache = (): void => {
    enumCache.clear()
    loadingStates.clear()
  }

  return {
    getEnum,
    clearEnumCache,
    clearAllCache
  }
}
