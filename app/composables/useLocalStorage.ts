export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const get = (): T | null => {
    if (typeof window === 'undefined') return null
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : (defaultValue ?? null)
    }
    catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue ?? null
    }
  }

  const set = (value: T): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
    catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  const remove = (): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    }
    catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  return { get, set, remove }
}
