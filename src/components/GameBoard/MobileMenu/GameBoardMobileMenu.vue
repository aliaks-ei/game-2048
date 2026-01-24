<template>
  <teleport to="body">
    <transition name="mobile-menu">
      <div v-if="modelValue" class="mobile-menu-overlay" @click="close">
        <div class="mobile-menu" @click.stop>
          <!-- Header -->
          <div class="mobile-menu__header">
            <h2 class="mobile-menu__title">2048</h2>
            <button class="mobile-menu__close" @click="close" aria-label="Close menu">
              ×
            </button>
          </div>

          <!-- Scores -->
          <div class="mobile-menu__scores">
            <div class="mobile-menu__score-item">
              <span class="mobile-menu__score-label">Score</span>
              <strong class="mobile-menu__score-value">{{ currentScore }}</strong>
            </div>
            <div class="mobile-menu__score-item">
              <span class="mobile-menu__score-label">Best</span>
              <strong class="mobile-menu__score-value">{{ bestScore }}</strong>
            </div>
          </div>

          <!-- Actions -->
          <div class="mobile-menu__actions">
            <app-button @click="handleNewGame" class="mobile-menu__button">
              New Game
            </app-button>
          </div>

          <!-- Settings -->
          <div class="mobile-menu__settings">
            <h3 class="mobile-menu__settings-title">Settings</h3>
            <div class="mobile-menu__settings-item">
              <span>Grid Size</span>
              <app-select v-model="localGridSize" :options="gridSizeOptions" />
            </div>
            <div class="mobile-menu__settings-item">
              <span>Obstacles</span>
              <app-select v-model="localNumObstacles" :options="obstacleOptions" />
            </div>
          </div>

          <!-- Instructions -->
          <div class="mobile-menu__instructions">
            <p><strong>How to play:</strong></p>
            <p>Swipe in any direction to move the tiles. Tiles with the same number merge into one when they touch. Get to the <strong>2048 tile</strong> to win!</p>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppButton from "@/components/App/Button/AppButton.vue";
import AppSelect from "@/components/App/Select/AppSelect.vue";

interface Props {
  modelValue: boolean;
  currentScore?: number;
  bestScore?: number;
  gridSize?: number;
  numObstacles?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentScore: 0,
  bestScore: 0,
  gridSize: 4,
  numObstacles: 0,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "update:gridSize": [value: number];
  "update:numObstacles": [value: number];
  "click:new-game": [];
}>();

const localGridSize = computed({
  get: () => props.gridSize,
  set: (value) => emit("update:gridSize", value),
});

const localNumObstacles = computed({
  get: () => props.numObstacles,
  set: (value) => emit("update:numObstacles", value),
});

const gridSizeOptions = [
  { label: "3x3", value: 3 },
  { label: "4x4", value: 4 },
  { label: "5x5", value: 5 },
  { label: "6x6", value: 6 },
];

const obstacleOptions = [
  { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
];

function close() {
  emit("update:modelValue", false);
}

function handleNewGame() {
  emit("click:new-game");
  close();
}
</script>

<style lang="scss" scoped>
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-menu {
  background-color: #faf8ef;
  width: 100%;
  max-width: 500px;
  margin: 1rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgb(237, 194, 46) 0%, rgb(242, 177, 50) 100%);
    color: white;
  }

  &__title {
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
  }

  &__close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    line-height: 1;
    padding: 0;

    &:active {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__scores {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1.5rem;
    background-color: #f9f6f2;
  }

  &__score-item {
    background-color: rgb(187, 173, 160);
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__score-label {
    font-size: 0.875rem;
    text-transform: uppercase;
    color: #eee4da;
    font-weight: 600;
  }

  &__score-value {
    font-size: 1.75rem;
    color: white;
    font-weight: bold;
  }

  &__actions {
    padding: 1.5rem;
    padding-top: 0.5rem;
  }

  &__button {
    width: 100%;
    font-size: 1.125rem;
    padding: 1rem;
  }

  &__settings {
    padding: 1.5rem;
    border-top: 2px solid #e0d6cc;

    &-title {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: var(--text-color-dark);
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0;
      font-size: 1rem;

      & + & {
        border-top: 1px solid #e0d6cc;
      }
    }
  }

  &__instructions {
    padding: 1.5rem;
    background-color: #f9f6f2;
    border-top: 2px solid #e0d6cc;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--text-color-dark);

    p {
      margin: 0;

      & + p {
        margin-top: 0.75rem;
      }
    }
  }
}

/* Animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;

  .mobile-menu {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;

  .mobile-menu {
    transform: translateY(-2rem);
  }
}
</style>
