<template>
  <div class="game-wrapper">
    <!-- Header -->
    <game-board-header :current-score="score" :best-score="bestScore"></game-board-header>

    <!-- Controls -->
    <game-board-controls @click:new-game="startGame"></game-board-controls>

    <!-- Board -->
    <div class="game-board-container">
      <grid-container :size="gridSize"></grid-container>
      <tile-container>
        <tile-item v-for="tile in renderedTiles" :key="tile.id" :tile="tile"></tile-item>
      </tile-container>
    </div>

    <!-- Dialogs -->
    <app-dialog v-model="gameOverDialog.show" :title="gameOverDialog.title">
      {{ gameOverDialog.message }}
      <template #actions>
        <app-button @click="gameOverDialog.show = false" outline>Cancel</app-button>
        <app-button @click="startGame">New Game</app-button>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";

import AppButton from "@/components/App/Button/AppButton.vue";
import AppDialog from "@/components/App/Dialog/AppDialog.vue";
import GridContainer from "@/components/GridContainer/GridContainer.vue";
import TileContainer from "@/components/Tile/Container/TileContainer.vue";
import TileItem from "@/components/Tile/Item/TileItem.vue";
import GameBoardHeader from "@/components/GameBoard/Header/GameBoardHeader.vue";
import GameBoardControls from "@/components/GameBoard/Controls/GameBoardControls.vue";

import { useGridCells } from "@/composables/useGridCells";
import { useTiles } from "@/composables/useTiles";
import { useGameStateStore } from "@/stores/gameState";
import { useUserInput } from "@/composables/useUserInput";
import { generateNumArray } from "@/utils";

const gameStateStore = useGameStateStore();
const { resetGridCells } = useGridCells();
const { renderedTiles, hasReachedHighestValue, addTileToCell, setRenderedTiles } = useTiles();
const { score, bestScore, gameOverDialog, gridSize, numObstacles } = storeToRefs(gameStateStore);
const { endGame, setCanAcceptUserInput, setScore, hideGameOverDialog } = gameStateStore;
const { handleUserInput } = useUserInput();

function startGame() {
  // Reset game
  hideGameOverDialog();
  setScore(0);
  setRenderedTiles([]);
  resetGridCells(gridSize.value);
  addTileToCell();
  setCanAcceptUserInput(true);

  // Add obstacles
  generateNumArray(numObstacles.value).forEach(() => addTileToCell({ isObstacle: true }));
}

watch(hasReachedHighestValue, (current) => {
  if (current) {
    setCanAcceptUserInput(false);
    endGame("win");
  }
});

onMounted(() => {
  startGame();
  document.addEventListener("keyup", handleUserInput);
});

onBeforeUnmount(() => {
  document.removeEventListener("keyup", handleUserInput);
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
}
</style>
