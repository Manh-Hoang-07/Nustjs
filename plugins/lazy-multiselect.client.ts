import { defineNuxtPlugin } from '#app'

// ===== TYPES =====

interface MultiselectComponent {
  name: string
  props: any
  emits: string[]
  setup: (props: any, { emit }: any) => any
}

type LoadMultiselectFunction = () => Promise<MultiselectComponent | null>

// ===== PLUGIN =====

export default defineNuxtPlugin(async (nuxtApp) => {
  // Lazy load vue-multiselect only when needed
  const loadMultiselect: LoadMultiselectFunction = async (): Promise<MultiselectComponent | null> => {
    try {
      const { default: Multiselect } = await import('vue-multiselect')
      return Multiselect
    } catch (error) {
      console.error('Failed to load vue-multiselect:', error)
      return null
    }
  }

  // Provide lazy loading function with type safety
  nuxtApp.provide('loadMultiselect', loadMultiselect)
})
