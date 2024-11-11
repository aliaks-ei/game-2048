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
}
</style>
