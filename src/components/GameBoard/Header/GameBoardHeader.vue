<template>
  <div class="game-board-header">
    <h1 class="game-board-header__title">2048</h1>
    <div v-for="{ label, value } in scores" :key="label" class="game-board-header__score">
      <span class="game-board-header__score-label">{{ label }}</span>
      <h3 class="game-board-header__score-value">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  currentScore: number;
  bestScore: number;
}

interface Score {
  label: string;
  value: number;
}

const props = defineProps<Props>();

const scores = computed<Score[]>(() => [
  { label: "Score", value: props.currentScore },
  { label: "Best", value: props.bestScore },
]);
</script>

<style lang="scss" scoped>
.game-board-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 0.5rem;

  &__title {
    font-size: 3.5rem;
    margin-block: 0;
    margin-inline-end: auto;
  }

  &__score {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-width: 5rem;
    padding: 0.25rem 1rem;
    background-color: var(--board-color);
    color: var(--text-color-light);
    text-transform: uppercase;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;

    &-label {
      font-size: 0.75rem;
    }

    &-value {
      margin: 0;
    }
  }
}
</style>
