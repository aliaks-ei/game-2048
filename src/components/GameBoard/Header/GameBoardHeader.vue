<template>
  <div class="game-board-header">
    <h1 class="game-board-header__title">2048</h1>
    <div
      v-for="{ label, value } in scores"
      :key="label"
      class="game-board-header__score"
      data-testid="score"
    >
      <span class="game-board-header__score-label">{{ label }}</span>
      <strong>{{ value }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  currentScore?: number;
  bestScore?: number;
}

interface Score {
  label: string;
  value: number;
}

const props = defineProps<Props>();

const scores = computed<Score[]>(() => [
  { label: "Score", value: props.currentScore ?? 0 },
  { label: "Best", value: props.bestScore ?? 0 },
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
    padding: 0.25rem 1rem;
    background-color: rgb(117 110 102);
    color: var(--text-color-light);
    text-transform: uppercase;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;

    &-label {
      font-size: 0.75rem;
    }
  }
}

/* Mobile-specific header styles */
@media (max-width: 768px) {
  .game-board-header {
    gap: 0.375rem;

    &__title {
      font-size: 3rem;
    }

    &__score {
      padding: 0.25rem 0.75rem;

      &-label {
        font-size: 0.7rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .game-board-header {
    &__title {
      font-size: 2.5rem;
    }

    &__score {
      padding: 0.25rem 0.625rem;
      min-width: 4rem;

      &-label {
        font-size: 0.65rem;
      }

      strong {
        font-size: 0.9rem;
      }
    }
  }
}

@media (max-width: 360px) {
  .game-board-header {
    &__title {
      font-size: 2rem;
    }
  }
}
</style>
