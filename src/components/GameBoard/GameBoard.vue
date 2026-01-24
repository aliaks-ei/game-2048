<template>
  <div class="game-wrapper">
    <!-- Header -->
    <game-board-header :current-score="score" :best-score="bestScore"></game-board-header>

    <!-- Controls -->
    <game-board-controls @click:new-game="handleNewGameClick"></game-board-controls>

    <!-- Board -->
    <div ref="gameBoardRef" class="game-board-container">
      <grid-container :size="gridSize"></grid-container>
      <tile-container>
        <tile-item v-for="tile in renderedTiles" :key="tile.id" :tile="tile"></tile-item>
      </tile-container>
    </div>

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

import { useGridCellsStore } from "@/stores/gridCells";
import { useTilesStore } from "@/stores/tiles";
import { useGameStateStore } from "@/stores/gameState";
import { useUserInput } from "@/composables/useUserInput";
import { useSwipeGesture } from "@/composables/useSwipeGesture";
import { generateNumArray } from "@/utils";

const gameBoardRef = ref<HTMLElement | null>(null);

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

/* Mobile-specific board styles */
@media (max-width: 768px) {
  .game-wrapper {
    --board-gap: 1vmin;
  }
}

@media (max-width: 480px) {
  .game-wrapper {
    --board-gap: 0.85vmin;
    --board-border-radius: 0.75vmin;
  }
}

@media (max-width: 360px) {
  .game-wrapper {
    --board-gap: 0.75vmin;
    --board-border-radius: 0.5vmin;
  }
}

/* Landscape orientation optimizations */
@media (max-height: 600px) and (orientation: landscape) {
  .game-wrapper {
    --board-gap: 0.75vmin;
    justify-content: center;
  }
}
</style>
