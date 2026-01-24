<template>
  <select v-model="model" class="app-select">
    <option v-for="option in options" :key="option.label" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
const model = defineModel();

interface SelectOption {
  label: string;
  value: string | number;
}

defineProps<{
  options?: SelectOption[];
}>();
</script>

<style lang="scss" scoped>
.app-select {
  min-width: 3.5rem;
  height: 1.5rem;
  border: 1px solid var(--text-color-dark);
  border-radius: 0.25rem;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  background-color: #ffffff;
  /* Touch-friendly interaction */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Mobile-specific select styles */
@media (max-width: 768px) {
  .app-select {
    min-width: 4rem;
    height: 2.5rem;
    font-size: 1rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .app-select {
    min-width: 4.5rem;
    height: 2.75rem;
  }
}
</style>
