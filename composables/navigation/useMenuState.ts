import { ref, type Ref } from 'vue'
import type { MenuStateResult } from './navigation.types'

// ===== COMPOSABLE =====

export function useMenuState(): MenuStateResult {
  const isOpen: Ref<boolean> = ref(false)

  const toggleMenu = (): void => {
    isOpen.value = !isOpen.value
  }

  const openMenu = (): void => {
    isOpen.value = true
  }

  const closeMenu = (): void => {
    isOpen.value = false
  }

  return {
    isOpen,
    toggleMenu,
    openMenu,
    closeMenu
  }
}
