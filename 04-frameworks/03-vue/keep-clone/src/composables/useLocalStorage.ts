import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T): Ref<T> {
  const read = (): T => {
    if (typeof localStorage === 'undefined') return initialValue

    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  }

  const state = ref(read()) as Ref<T>

  watch(
    state,
    (value) => {
      if (typeof localStorage === 'undefined') return

      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Storage may be unavailable in private mode or when the quota is full.
      }
    },
    { deep: true },
  )

  return state
}
