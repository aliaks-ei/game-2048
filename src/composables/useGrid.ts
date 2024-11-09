import { ref, computed } from "vue";

import type { Cell } from "@/types";

export function useGrid(gridSize = 6) {
  const gridCells = ref<Cell[]>(
    Array.from({ length: Math.pow(gridSize, 2) }, (_, index) => ({
      col: (index % gridSize) + 1,
      row: Math.floor(index / gridSize) + 1,
    })),
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

  return {
    gridCells,
    gridCellsByColumn,
    gridCellsByRow,
    getRandomEmptyGridCell,
  };
}
