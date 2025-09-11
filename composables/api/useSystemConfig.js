import { ref, computed } from 'vue'
import { useApiClient } from './useApiClient'

export function useSystemConfig() {
  const { apiClient } = useApiClient()
  const configs = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Lấy danh sách tất cả cấu hình
  const fetchConfigs = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/api/admin/system-configs', { params })
      configs.value = response.data.data || []
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy chi tiết một cấu hình
  const fetchConfig = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(`/api/admin/system-configs/${id}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy cấu hình theo nhóm
  const fetchConfigsByGroup = async (group) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(`/api/admin/system-configs/group/${group}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy form cấu hình theo nhóm
  const fetchConfigForm = async (group) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(`/api/admin/system-configs/group/${group}/form`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy danh sách nhóm
  const fetchGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/api/admin/system-configs/groups/list')
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Tạo cấu hình mới
  const createConfig = async (configData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/api/admin/system-configs', configData)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cập nhật cấu hình
  const updateConfig = async (id, configData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.put(`/api/admin/system-configs/${id}`, configData)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cập nhật cấu hình theo nhóm
  const updateConfigsByGroup = async (group, configsData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.put(`/api/admin/system-configs/group/${group}`, {
        configs: configsData
      })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Xóa cấu hình
  const deleteConfig = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.delete(`/api/admin/system-configs/${id}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cập nhật hàng loạt
  const bulkUpdate = async (configsData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/api/admin/system-configs/bulk-update', {
        configs: configsData
      })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Xóa hàng loạt
  const bulkDelete = async (ids) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/api/admin/system-configs/bulk-delete', {
        ids
      })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Xóa cache
  const clearCache = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/api/admin/system-configs/clear-cache')
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Tìm kiếm cấu hình
  const searchConfigs = async (query) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/api/admin/system-configs/search', {
        params: { q: query }
      })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const configsByGroup = computed(() => {
    const grouped = {}
    configs.value.forEach(config => {
      if (!grouped[config.config_group]) {
        grouped[config.config_group] = []
      }
      grouped[config.config_group].push(config)
    })
    return grouped
  })

  const publicConfigs = computed(() => {
    return configs.value.filter(config => config.is_public)
  })

  const requiredConfigs = computed(() => {
    return configs.value.filter(config => config.is_required)
  })

  return {
    // State
    configs,
    loading,
    error,
    
    // Computed
    configsByGroup,
    publicConfigs,
    requiredConfigs,
    
    // Methods
    fetchConfigs,
    fetchConfig,
    fetchConfigsByGroup,
    fetchConfigForm,
    fetchGroups,
    createConfig,
    updateConfig,
    updateConfigsByGroup,
    deleteConfig,
    bulkUpdate,
    bulkDelete,
    clearCache,
    searchConfigs
  }
}
