import { ref, type Ref } from 'vue'

// ===== TYPES =====

interface MenuStateResult {
  isOpen: Ref<boolean>
  toggleMenu: () => void
}

// ===== COMPOSABLE =====

export function useMenuState(): MenuStateResult {
  const isOpen: Ref<boolean> = ref(false)

  const toggleMenu = (): void => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    toggleMenu
  }
}
