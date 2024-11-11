<template>
  <button class="app-button" :class="{ 'app-button--outline': outline }" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{ outline?: boolean }>();
defineEmits(["click"]);
</script>

<style lang="scss" scoped>
$button-color: rgb(125 107 89);
$button-color-active: rgb(116 99 82);

.app-button {
  border: 0;
  border-radius: 0.25rem;
  color: var(--text-color-light);
  background-color: $button-color;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition-property: transform, background-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;

  &:hover {
    background-color: $button-color-active;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &--outline {
    background-color: transparent;
    border: 1px solid $button-color;
    color: $button-color;

    &:hover {
      background-color: transparent;
    }
  }
}
</style>
