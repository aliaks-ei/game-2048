<template>
  <div class="game-wrapper">
    <!-- Desktop Header (hidden on mobile) -->
    <game-board-header
      class="desktop-only"
      :current-score="score"
      :best-score="bestScore"
    ></game-board-header>

    <!-- Desktop Controls (hidden on mobile) -->
    <game-board-controls
      class="desktop-only"
      @click:new-game="handleNewGameClick"
    ></game-board-controls>

    <!-- Mobile Menu Button (hidden on desktop) -->
    <button class="mobile-menu-button" @click="showMobileMenu = true" aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <!-- Mobile Score Badge (minimal score display on mobile) -->
    <div class="mobile-score-badge">
      {{ score }}
    </div>

    <!-- Board -->
    <div ref="gameBoardRef" class="game-board-container">
      <grid-container :size="gridSize"></grid-container>
      <tile-container>
        <tile-item v-for="tile in renderedTiles" :key="tile.id" :tile="tile"></tile-item>
      </tile-container>
    </div>

    <!-- Mobile Menu -->
    <game-board-mobile-menu
      v-model="showMobileMenu"
      v-model:grid-size="gridSize"
      v-model:num-obstacles="numObstacles"
      :current-score="score"
      :best-score="bestScore"
      @click:new-game="handleNewGameClick"
    />

    <!-- Dialogs -->
    <app-dialog v-model="gameOverDialog.show" :title="gameOverDialog.title">
      {{ gameOverDialog.message }}
      <template #actions>
        <!-- TODO: Update text and order for game over scenario -->
        <app-button @click="handleNewGameClick" outline>New game</app-button>
        <app-button @click="gameOverDialog.show = false">Continue playing</app-button>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from "vue";
import { storeToRefs } from "pinia";

import AppButton from "@/components/App/Button/AppButton.vue";
import AppDialog from "@/components/App/Dialog/AppDialog.vue";
import GridContainer from "@/components/GridContainer/GridContainer.vue";
import TileContainer from "@/components/Tile/Container/TileContainer.vue";
import TileItem from "@/components/Tile/Item/TileItem.vue";
import GameBoardHeader from "@/components/GameBoard/Header/GameBoardHeader.vue";
import GameBoardControls from "@/components/GameBoard/Controls/GameBoardControls.vue";
import GameBoardMobileMenu from "@/components/GameBoard/MobileMenu/GameBoardMobileMenu.vue";

import { useGridCellsStore } from "@/stores/gridCells";
import { useTilesStore } from "@/stores/tiles";
import { useGameStateStore } from "@/stores/gameState";
import { useUserInput } from "@/composables/useUserInput";
import { useSwipeGesture } from "@/composables/useSwipeGesture";
import { generateNumArray } from "@/utils";

const gameBoardRef = ref<HTMLElement | null>(null);
const showMobileMenu = ref(false);

const { gridCells } = storeToRefs(useGridCellsStore());
const { resetGridCells } = useGridCellsStore();
const { renderedTiles, hasReachedHighestValue } = storeToRefs(useTilesStore());
const { addTileToCell, setRenderedTiles } = useTilesStore();
const { score, bestScore, gameOverDialog, gridSize, numObstacles } =
  storeToRefs(useGameStateStore());
const { endGame, setCanAcceptUserInput, setScore, hideGameOverDialog } = useGameStateStore();
const { handleUserInput, handleSwipeInput } = useUserInput();

const { enableSwipeGesture, disableSwipeGesture } = useSwipeGesture(
  gameBoardRef,
  handleSwipeInput,
  {
    minSwipeDistance: 30,
    maxSwipeTime: 300,
  },
);

function startNewGame() {
  setScore(0);
  resetGridCells(gridSize.value);
  addTileToCell();

  // Add obstacles
  generateNumArray(numObstacles.value).forEach(() => addTileToCell({ isObstacle: true }));
}

function handleNewGameClick() {
  // Reset game
  hideGameOverDialog();
  setRenderedTiles([]);

  startNewGame();
}

watch(hasReachedHighestValue, (current) => {
  if (current) {
    endGame("win");
  }
});

watch(
  () => gameOverDialog.value.show,
  (current) => {
    setCanAcceptUserInput(!current);
  },
);

onMounted(() => {
  const canContinueSavedGame =
    renderedTiles.value.length - numObstacles.value > 1 &&
    renderedTiles.value.length < gridCells.value.length;

  if (!canContinueSavedGame) {
    startNewGame();
  }

  setRenderedTiles(gridCells.value.filter((cell) => cell.tile).map((cell) => cell.tile!));
  setCanAcceptUserInput(true);

  // Enable keyboard input
  document.addEventListener("keyup", handleUserInput);

  // Enable swipe gestures for mobile
  enableSwipeGesture();
});

onBeforeUnmount(() => {
  // Disable keyboard input
  document.removeEventListener("keyup", handleUserInput);

  // Disable swipe gestures
  disableSwipeGesture();
});
</script>

<style lang="scss" scoped>
.game-wrapper {
  --board-gap: 1.25vmin;
  --board-border-radius: 1vmin;
  // For the best responsiveness we need to decrease tile size by 2 vmin each time grid size increases by 1, e.g.
  // 3x3 grid size = 18vmin tile size
  // 4x4 grid size = 16vmin tile size
  // 5x5 grid size = 14vmin tile size
  // ...
  // Analyzing the above equation, it's clear that the formula should be: --tile-size = 24 - 2 x gridSize,
  // where 24 is the maximum tile size.
  --tile-size: calc((24 - 2 * v-bind(gridSize)) * 1vmin);

  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: calc(((var(--tile-size) + var(--board-gap)) * v-bind(gridSize)) + var(--board-gap));
  margin: 0 auto;
  position: relative;
}

.desktop-only {
  display: flex;
}

.mobile-menu-button,
.mobile-score-badge {
  display: none;
}

.game-board-container {
  position: relative;
  padding: var(--board-gap);
  background-color: rgb(187 173 160);
  border-radius: var(--board-border-radius);
  /* Prevent text selection during swipe gestures */
  user-select: none;
  -webkit-user-select: none;
  /* Disable touch callout on iOS */
  -webkit-touch-callout: none;
  /* Prevent double-tap zoom */
  touch-action: none;
}

/* Mobile-optimized full-screen experience */
@media (max-width: 768px) {
  .game-wrapper {
    /* Use maximum available screen space on mobile */
    --tile-size: calc((95vw - (v-bind(gridSize) + 1) * var(--board-gap)) / v-bind(gridSize));
    --board-gap: 1vmin;

    width: 100%;
    max-width: 95vw;
    height: 100%;
    justify-content: center;
    padding: 0;
  }

  /* Hide desktop elements */
  .desktop-only {
    display: none !important;
  }

  /* Show mobile menu button */
  .mobile-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: env(safe-area-inset-top, 1rem);
    left: 1rem;
    width: 3rem;
    height: 3rem;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: 100;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--text-color-dark);
    }

    &:active {
      transform: scale(0.95);
      background: rgba(255, 255, 255, 1);
    }
  }

  /* Mobile score badge */
  .mobile-score-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: env(safe-area-inset-top, 1rem);
    right: 1rem;
    min-width: 3rem;
    height: 3rem;
    padding: 0 1rem;
    background: linear-gradient(135deg, rgb(237, 194, 46) 0%, rgb(242, 177, 50) 100%);
    color: white;
    font-weight: bold;
    font-size: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }

  .game-board-container {
    /* Center the board and maximize size */
    margin: auto;
  }
}

@media (max-width: 480px) {
  .game-wrapper {
    --tile-size: calc((98vw - (v-bind(gridSize) + 1) * var(--board-gap)) / v-bind(gridSize));
    --board-gap: 0.75vmin;
    --board-border-radius: 1vmin;
    max-width: 98vw;
  }

  .mobile-menu-button,
  .mobile-score-badge {
    top: calc(env(safe-area-inset-top, 0px) + 0.75rem);
  }

  .mobile-menu-button {
    left: 0.75rem;
    width: 2.75rem;
    height: 2.75rem;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .mobile-score-badge {
    right: 0.75rem;
    min-width: 2.75rem;
    height: 2.75rem;
    padding: 0 0.875rem;
    font-size: 1.125rem;
  }
}

@media (max-width: 360px) {
  .game-wrapper {
    --tile-size: calc((100vw - (v-bind(gridSize) + 1) * var(--board-gap)) / v-bind(gridSize));
    --board-gap: 0.5vmin;
    --board-border-radius: 0.75vmin;
    max-width: 100vw;
  }
}

/* Landscape orientation - optimize for width */
@media (max-height: 600px) and (orientation: landscape) {
  .game-wrapper {
    --tile-size: calc(
      (90vh - (v-bind(gridSize) + 1) * var(--board-gap) - 6rem) / v-bind(gridSize)
    );
    --board-gap: 0.5vmin;
    justify-content: center;
  }

  .mobile-menu-button,
  .mobile-score-badge {
    top: 0.5rem;
  }

  .mobile-menu-button {
    left: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .mobile-score-badge {
    right: 0.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
}
</style>
