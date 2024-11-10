<template>
  <div class="game-wrapper">
    <!-- Header -->
    <game-board-header :current-score="score" :best-score="bestScore"></game-board-header>

    <!-- Controls -->
    <game-board-controls @click:new-game="startGame"></game-board-controls>

    <!-- Board -->
    <div class="game-container">
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
import { onMounted, toValue, nextTick, onBeforeUnmount, watch } from "vue";

import AppButton from "@/components/AppButton/AppButton.vue";
import AppDialog from "@/components/AppDialog/AppDialog.vue";
import GridContainer from "@/components/GridContainer/GridContainer.vue";
import TileContainer from "@/components/Tile/Container/TileContainer.vue";
import TileItem from "@/components/Tile/Item/TileItem.vue";
import GameBoardHeader from "@/components/GameBoard/Header/GameBoardHeader.vue";
import GameBoardControls from "@/components/GameBoard/Controls/GameBoardControls.vue";

import { useGridCells } from "@/composables/useGridCells";
import { useTiles } from "@/composables/useTiles";
import { useGameState } from "@/composables/useGameState";

import type { Cell, Tile } from "@/types";

const { gridCells, gridCellsByDirection, getRandomEmptyGridCell, resetGridCells } = useGridCells();
const {
  renderedTiles,
  hasReachedHighestValue,
  setTileInCell,
  canTileSlide,
  moveTiles,
  setRenderedTiles,
} = useTiles();
const {
  canAcceptUserInput,
  score,
  bestScore,
  gameOverDialog,
  gridSize,
  numObstacles,
  endGame,
  mergeTilesInGridCells,
  setCanAcceptUserInput,
} = useGameState();

function addTileToCell({ isObstacle }: { isObstacle?: boolean } = {}) {
  const cell = getRandomEmptyGridCell();

  setTileInCell({ cell, tile: { value: isObstacle ? 0 : 2, isObstacle } });
  setRenderedTiles([...renderedTiles.value, cell.tile!]);

  return cell;
}

async function handleKeyupEvent(event: KeyboardEvent) {
  if (!canAcceptUserInput.value) return;

  const moveTilesIfPossible = async (gridCellsMatrix: Cell[][]) => {
    if (!canTileSlide(gridCellsMatrix)) {
      return false;
    }

    await moveTiles(gridCellsMatrix);
    return true;
  };

  const currentActionData = gridCellsByDirection.value[event.key];

  setCanAcceptUserInput(false);

  if (currentActionData && (await moveTilesIfPossible(currentActionData))) {
    mergeTilesInGridCells(toValue(gridCells));

    const idsToRender = gridCells.value.reduce<Record<string, Tile>>((acc, cell) => {
      if (cell.tile) {
        acc[cell.tile.id] = cell.tile;
      }

      return acc;
    }, {});

    const updatedrenderedTiles = renderedTiles.value
      .filter((tile) => Object.keys(idsToRender).includes(tile.id))
      .map((tile) => idsToRender[tile.id]);

    setRenderedTiles(updatedrenderedTiles);

    const cell = addTileToCell();

    if (Object.values(gridCellsByDirection.value).every((data) => !canTileSlide(data))) {
      await nextTick();
      document.querySelector(`[data-id="${cell.tile!.id}"]`)?.addEventListener(
        "animationend",
        () => {
          document.removeEventListener("keyup", handleKeyupEvent);
          endGame("lose");
        },
        { once: true },
      );
    }
  }

  setCanAcceptUserInput(true);
}

function startGame() {
  score.value = 0;
  gameOverDialog.show = false;

  setRenderedTiles([]);
  resetGridCells(gridSize.value);
  addTileToCell();

  // Add obstacles
  Array.from({ length: numObstacles.value }).forEach(() => addTileToCell({ isObstacle: true }));

  document.removeEventListener("keyup", handleKeyupEvent);
  document.addEventListener("keyup", handleKeyupEvent);
}

watch(hasReachedHighestValue, (current) => {
  if (current) {
    document.removeEventListener("keyup", handleKeyupEvent);
    endGame("win");
  }
});

onMounted(() => {
  startGame();
});

onBeforeUnmount(() => {
  document.removeEventListener("keyup", handleKeyupEvent);
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

.game-container {
  position: relative;
  padding: var(--board-gap);
  background-color: rgb(187 173 160);
  border-radius: var(--board-border-radius);
}
</style>
