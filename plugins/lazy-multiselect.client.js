import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Lazy load vue-multiselect only when needed
  const loadMultiselect = async () => {
    try {
      const { default: Multiselect } = await import('vue-multiselect')
      return Multiselect
    } catch (error) {
      console.error('Failed to load vue-multiselect:', error)
      return null
    }
  }

  // Provide lazy loading function
  nuxtApp.provide('loadMultiselect', loadMultiselect)
}) 