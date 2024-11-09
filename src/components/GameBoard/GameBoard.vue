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
import { ref, computed, onMounted, toValue, nextTick } from "vue";

import GridContainer from "@/components/GridContainer/GridContainer.vue";
import TileContainer from "@/components/Tile/Container/TileContainer.vue";
import TileItem from "@/components/Tile/Item/TileItem.vue";

import { useGrid } from "@/composables/useGrid";
import { useTileMovement } from "@/composables/useTileMovement";
import { useGameState } from "@/composables/useGameState";

import type { Cell, Tile } from "@/types";

const gridSize = ref(4);

const { gridCells, getRandomEmptyGridCell } = useGrid(toValue(gridSize));
const { setTileInCell, canSlide, _canCellAcceptTile } = useTileMovement();
const { score, endGame, mergeTilesInGridCells } = useGameState();

const tilesToRender = ref<Tile[]>([]);

const gridCellsByColumn = computed(() => {
  return gridCells.value.reduce<Cell[][]>((acc, cell) => {
    acc[cell.col - 1] = acc[cell.col - 1] || [];
    acc[cell.col - 1][cell.row - 1] = cell;

    return acc;
  }, []);
});
const gridCellsByRow = computed(() => {
  return gridCells.value.reduce<Cell[][]>((acc, cell) => {
    acc[cell.row - 1] = acc[cell.row - 1] || [];
    acc[cell.row - 1][cell.col - 1] = cell;

    return acc;
  }, []);
});

function canSlideUp() {
  return canSlide(gridCellsByColumn.value);
}

function canSlideDown() {
  return canSlide(gridCellsByColumn.value.map((col) => [...col].reverse()));
}

function canSlideLeft() {
  return canSlide(gridCellsByRow.value);
}

function canSlideRight() {
  return canSlide(gridCellsByRow.value.map((row) => [...row].reverse()));
}

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

  const keyActions: Record<string, () => Promise<boolean>> = {
    ArrowLeft: () => moveTilesIfPossible(gridCellsByRow.value),
    ArrowRight: () => moveTilesIfPossible(gridCellsByRow.value.map(row => [...row].reverse())),
    ArrowUp: () => moveTilesIfPossible(gridCellsByColumn.value),
    ArrowDown: () => moveTilesIfPossible(gridCellsByColumn.value.map(col => [...col].reverse())),
  };

  const action = keyActions[event.key];

  if (action && await action()) {
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

    nextTick(() =>tilesToRender.value.push(cell.tile!));

    // TODO: Refactor this
    if (!canSlideUp() && !canSlideDown() && !canSlideLeft() && !canSlideRight()) {
      endGame();
      return;
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

          if (!_canCellAcceptTile(targetCell, currentCell.tile)) {
            break;
          }

          lastAvailableCell = targetCell;
        }

        if (lastAvailableCell) {
          const elem = document.querySelector(`[data-id="${currentCell.tile.id}"]`);

          promises.push(new Promise<void>((resolve) => {
            elem?.addEventListener("transitionend", () => {
              console.log("transitionend")
              resolve();
            }, { once: true });
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
