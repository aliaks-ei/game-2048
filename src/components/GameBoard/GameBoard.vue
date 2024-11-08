<template>
  <div class="game-wrapper">
    <h1>Score: {{ score }}</h1>
    <div class="game-container">
      <GridContainer :size="gridSize"></GridContainer>
      <TileContainer>
        <TileItem
          v-for="{ id, value, col, row } in tilesToRender"
          :key="id"
          :value="value"
          :col="col"
          :row="row"
        ></TileItem>
      </TileContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Wait for "transitionend" event on tiles (also in "end game")
// TODO: Game restart
// TODO: Local storage
// TODO: Refactor (split into components, combine functions, etc)
import { ref, computed, onMounted } from "vue";

import GridContainer from "@/components/GridContainer/GridContainer.vue";
import TileContainer from "@/components/Tile/Container/TileContainer.vue";
import TileItem from "@/components/Tile/Item/TileItem.vue";

interface Tile {
  id: string;
  value: number;
  col: number;
  row: number;
}

interface Cell {
  tile?: Tile;
  tileToMerge?: Tile;
  col: number;
  row: number;
}

const gridSize = ref(4);
const score = ref(0);
const gridCells = ref<Cell[]>(
  Array.from({ length: Math.pow(gridSize.value, 2) }, (_, index) => ({
    col: (index % gridSize.value) + 1,
    row: Math.floor(index / gridSize.value) + 1,
  })),
);

const tilesToRender = computed(() =>
  gridCells.value.reduce<Tile[]>((acc, cell) => {
    if (cell.tile) {
      acc.push(cell.tile);
    }

    return acc;
  }, []),
);
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

function getRandomEmptyGridCell() {
  const emptyCells = gridCells.value.filter((cell) => !cell.tile);
  const randomIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[randomIndex];
}

function canCellAcceptTile(cell: Cell, tile?: Tile) {
  return !cell.tile || (!cell.tileToMerge && cell.tile.value === tile?.value);
}

async function moveTiles(gridCells: Cell[][]) {
  return Promise.all(
    gridCells.flatMap((column) => {
      const promises: Promise<void>[] = [];

      // Starting from the second row since the first row cannot move up
      for (let i = 1; i < column.length; i++) {
        const currentCell = column[i];

        if (!currentCell.tile) {
          continue;
        }

        let lastAvailableCell: Cell | null = null;

        for (let j = i - 1; j >= 0; j--) {
          const targetCell = column[j];

          if (canCellAcceptTile(targetCell, currentCell.tile)) {
            lastAvailableCell = targetCell;
          }
        }

        if (lastAvailableCell) {
          // const elem = document.querySelector(
          //   `[data-col="${currentCell.col}"][data-row="${currentCell.row}"]`,
          // );
          // console.log(elem);
          // promises.push(
          //   new Promise((resolve) => {
          //     elem?.addEventListener("transitionend", () => {
          //       console.log("transitionend");
          //       resolve();
          //     }, { once: true });
          //   }),
          // )
          setTileInCell({
            cell: lastAvailableCell,
            tile: currentCell.tile,
            isTileToMerge: !!lastAvailableCell.tile,
          });

          delete currentCell.tile;
        }
      }

      return promises;
    }),
  );
}

function slideUp() {
  return moveTiles(gridCellsByColumn.value);
}

function slideDown() {
  return moveTiles(gridCellsByColumn.value.map((col) => [...col].reverse()));
}

function slideLeft() {
  return moveTiles(gridCellsByRow.value);
}

function slideRight() {
  return moveTiles(gridCellsByRow.value.map((row) => [...row].reverse()));
}

function setupInput() {
  document.addEventListener("keyup", handleKeyupEvent, { once: true });
}

function setTileInCell({
  cell,
  tile,
  isTileToMerge = false,
}: {
  cell: Cell;
  tile: Partial<Tile>;
  isTileToMerge?: boolean;
}) {
  cell[isTileToMerge ? "tileToMerge" : "tile"] = {
    value: tile.value ?? 2, // set default value to 2
    id: tile.id ?? crypto.randomUUID(),
    col: cell.col,
    row: cell.row,
  };
}

function mergeTilesInGridCells() {
  gridCells.value
    .filter((cell) => cell.tileToMerge)
    .forEach((cell) => {
      if (cell.tile) {
        cell.tile.value *= 2;
      }

      delete cell.tileToMerge;
    });
}

function canSlide(gridCells: Cell[][]) {
  return gridCells.some((column) =>
    column.some((cell, cellIndex) => {
      const targetCell = column[cellIndex - 1];

      return !cellIndex || !cell.tile ? false : canCellAcceptTile(targetCell, cell.tile);
    }),
  );
}

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

function endGame() {
  alert("Game Over");
}

async function handleKeyupEvent(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowLeft":
      if (!canSlideLeft()) {
        setupInput();
        return;
      }
      await slideLeft();
      break;
    case "ArrowRight":
      if (!canSlideRight()) {
        setupInput();
        return;
      }
      await slideRight();
      break;
    case "ArrowUp":
      if (!canSlideUp()) {
        setupInput();
        return;
      }
      await slideUp();
      break;
    case "ArrowDown":
      if (!canSlideDown()) {
        setupInput();
        return;
      }
      await slideDown();
      break;
    default:
      setupInput();
      return;
  }

  mergeTilesInGridCells();
  const cell = getRandomEmptyGridCell();

  setTileInCell({ cell, tile: { value: 2 } });

  if (!canSlideUp() && !canSlideDown() && !canSlideLeft() && !canSlideRight()) {
    endGame();
    return;
  }

  setupInput();
}

onMounted(() => {
  const cell = getRandomEmptyGridCell();

  setTileInCell({ cell, tile: { value: 2 } });
  setupInput();
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
