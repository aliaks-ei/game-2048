<template>
  <div class="game-wrapper">
    <h1 style="margin: 0">2048</h1>
    <p style="margin: 0">
      Use arrow keys to move tiles. Tiles with the same number merge into one when they touch. Add
      them up to reach 2048!
    </p>
    <h2>Score: {{ score }}</h2>
    <div class="game-container">
      <GridContainer :size="gridSize"></GridContainer>
      <TileContainer>
        <TileItem v-for="{ id, value, col, row } in tilesToRender" :key="id" :value="value" :col="col" :row="row"
          :id="id">
        </TileItem>
      </TileContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toValue, nextTick } from "vue";

import GridContainer from "@/components/GridContainer/GridContainer.vue";
import TileContainer from "@/components/Tile/Container/TileContainer.vue";
import TileItem from "@/components/Tile/Item/TileItem.vue";

import { useGrid } from "@/composables/useGrid";
import { useTileMovement } from "@/composables/useTileMovement";
import { useGameState } from "@/composables/useGameState";

import type { Cell, Tile } from "@/types";

const gridSize = ref(6);
const tilesToRender = ref<Tile[]>([]);

const { gridCells, gridCellsByColumn, gridCellsByRow, getRandomEmptyGridCell } = useGrid(toValue(gridSize));
const { setTileInCell, canSlide, canCellAcceptTile } = useTileMovement();
const { score, endGame, mergeTilesInGridCells } = useGameState();

function addKeyupEventHandler() {
  document.addEventListener("keyup", handleKeyupEvent, { once: true });
}

function addNewTile() {
  const cell = getRandomEmptyGridCell();

  setTileInCell({ cell, tile: { value: 2 } });
}

async function handleKeyupEvent(event: KeyboardEvent) {
  const moveTilesIfPossible = async (gridCellsMatrix: Cell[][]) => {
    if (!canSlide(gridCellsMatrix)) {
      addKeyupEventHandler();
      return false;
    }

    await moveTiles(gridCellsMatrix);
    return true;
  };

  const actionData: Record<string, Cell[][]> = {
    ArrowLeft: gridCellsByRow.value,
    ArrowRight: gridCellsByRow.value.map(row => [...row].reverse()),
    ArrowUp: gridCellsByColumn.value,
    ArrowDown: gridCellsByColumn.value.map(col => [...col].reverse()),
  };

  const currentActionData = actionData[event.key];

  if (currentActionData && await moveTilesIfPossible(currentActionData)) {
    mergeTilesInGridCells(toValue(gridCells));

    const idsToRender = gridCells.value.reduce<Record<string, Tile>>((acc, cell) => {
      if (cell.tile) {
        acc[cell.tile.id] = cell.tile;
      }

      return acc;
    }, {});

    tilesToRender.value = tilesToRender.value
      .filter((tile) => Object.keys(idsToRender).includes(tile.id))
      .map((tile) => idsToRender[tile.id]);

    // Add new tile
    const cell = getRandomEmptyGridCell();

    setTileInCell({ cell, tile: { value: 2 } });
    tilesToRender.value.push(cell.tile!);

    if (Object.values(actionData).every((data) => !canSlide(data))) {
      await nextTick();
      document.querySelector(`[data-id="${cell.tile!.id}"]`)?.addEventListener("animationend", () => {
        return endGame();
      }, { once: true });
    }
  }

  addKeyupEventHandler();
}

async function moveTiles(gridCellsMatrix: Cell[][]) {
  return Promise.all(
    gridCellsMatrix.flatMap((column) => {
      const promises: Promise<void>[] = [];

      // Starting from the second row since the first row cannot move up
      for (let i = 1; i < column.length; i++) {
        const currentCell = column[i];

        if (!currentCell.tile) continue;

        let lastAvailableCell: Cell | null = null;

        for (let j = i - 1; j >= 0; j--) {
          const targetCell = column[j];

          if (!canCellAcceptTile(targetCell, currentCell.tile)) {
            break;
          }

          lastAvailableCell = targetCell;
        }

        if (lastAvailableCell) {
          const elem = document.querySelector(`[data-id="${currentCell.tile.id}"]`);

          promises.push(new Promise<void>((resolve) => {
            elem?.addEventListener("transitionend", () => resolve(), { once: true });
          }));

          setTileInCell({
            cell: lastAvailableCell,
            tile: currentCell.tile,
            isTileToMerge: !!lastAvailableCell.tile,
          });

          delete currentCell.tile;

          tilesToRender.value.forEach(tile => {
            if ([lastAvailableCell.tile?.id, lastAvailableCell.tileToMerge?.id].includes(tile.id)) {
              tile.col = lastAvailableCell.col;
              tile.row = lastAvailableCell.row;
            }
          })
        }
      }

      return promises;
    }),
  );
}

onMounted(() => {
  addNewTile();
  addKeyupEventHandler();

  tilesToRender.value = gridCells.value.reduce<Tile[]>((acc, cell) => {
    if (cell.tile) {
      acc.push(cell.tile);
    }

    return acc;
  }, []);
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
  // Analyzing the above equation, it's clear that the formula should be: --tile-size = 24 - 2 x gridSize
  --tile-size: calc((24 - 2 * v-bind(gridSize)) * 1vmin);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.game-container {
  position: relative;
  padding: var(--board-gap);
  background-color: rgb(187 173 160);
  border-radius: var(--board-border-radius);
}
</style>
