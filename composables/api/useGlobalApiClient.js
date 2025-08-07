import { useApiClient } from './useApiClient'

// Global API client instance
let globalApiClient = null

export function useGlobalApiClient() {
  if (!globalApiClient) {
    globalApiClient = useApiClient()
  }
  return globalApiClient
} 