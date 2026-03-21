import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Reactive online/offline state from `navigator.onLine` plus `online` / `offline` events.
 */
export function useOnline() {
  const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

  function sync() {
    isOnline.value = navigator.onLine
  }

  onMounted(() => {
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
  })

  onUnmounted(() => {
    window.removeEventListener('online', sync)
    window.removeEventListener('offline', sync)
  })

  return { isOnline }
}
