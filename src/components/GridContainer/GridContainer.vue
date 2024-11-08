<template>
  <ul class="grid-container">
    <li v-for="i in Math.pow(size, 2)" :key="i" class="grid-item"></li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  size: number;
}>();
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(v-bind(size), var(--tile-size));
  grid-template-rows: repeat(v-bind(size), var(--tile-size));
  gap: var(--board-gap);
}

.grid-item {
  background-color: rgba(238 228 218 / 0.35);
  border-radius: var(--board-border-radius);
  box-shadow: hsl(0deg 0% 0% / 0.2) 0px 2px 1px 0px inset;
}
</style>
