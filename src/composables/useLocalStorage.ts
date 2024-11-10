import { ref, watch } from "vue";

type LocalStorageKeys = "bestScore" | "gridSize";

export function useLocalStorage<T>(key: LocalStorageKeys, defaultValue?: T) {
  // Retrieve the initial value from localStorage and parse it as JSON, or use the default value
  const storedValue = localStorage.getItem(key);
  const data = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue);

  // Watch for changes to the data and update localStorage accordingly
  watch(
    data,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    { deep: true },
  );

  return {
    data,
  };
}
