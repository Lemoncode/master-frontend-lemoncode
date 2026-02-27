export const useStorage = <T>(storageKey: string) => {
  const get = () => {
    const value = localStorage.getItem(storageKey)
    return value ? (JSON.parse(value) as T) : []
  }

  const set = (value: T) => {
    localStorage.setItem(storageKey, JSON.stringify(value))
  }

  return {
    get,
    set,
  }
}
