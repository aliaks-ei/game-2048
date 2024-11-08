import { ref } from "vue";

import type { Cell } from "@/types";

export function useGrid(gridSize = 6) {
  const gridCells = ref<Cell[]>(
    Array.from({ length: Math.pow(gridSize, 2) }, (_, index) => ({
      col: (index % gridSize) + 1,
      row: Math.floor(index / gridSize) + 1,
    })),
  );

  function getRandomEmptyGridCell() {
    const emptyCells = gridCells.value.filter((cell) => !cell.tile);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  return {
    gridCells,
    getRandomEmptyGridCell,
  };
}
