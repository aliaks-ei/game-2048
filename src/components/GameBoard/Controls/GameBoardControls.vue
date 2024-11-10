<template>
  <div class="game-board-controls">
    <p>Join the numbers and get to the <strong>2048 tile!</strong></p>
    <app-button @click="$emit('click:new-game')">New Game</app-button>
  </div>
</template>

<script setup lang="ts">
import AppButton from "@/components/AppButton/AppButton.vue";

defineEmits(["click:new-game"]);
</script>

<style lang="scss" scoped>
.game-board-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1.5rem;
  gap: 0.5rem;
  width: 100%;
}
</style>
