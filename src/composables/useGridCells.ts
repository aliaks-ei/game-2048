import { ref, computed } from "vue";

import type { Cell, Tile } from "@/types";

export function useGridCells() {
  const gridCells = ref<Cell[]>([]);

  const _gridCellsByColumn = computed(() => {
    return gridCells.value.reduce<Cell[][]>((acc, cell) => {
      acc[cell.col - 1] = acc[cell.col - 1] || [];
      acc[cell.col - 1][cell.row - 1] = cell;

      return acc;
    }, []);
  });

  const _gridCellsByRow = computed(() => {
    return gridCells.value.reduce<Cell[][]>((acc, cell) => {
      acc[cell.row - 1] = acc[cell.row - 1] || [];
      acc[cell.row - 1][cell.col - 1] = cell;

      return acc;
    }, []);
  });

  const gridCellsByDirection = computed<Record<string, Cell[][]>>(() => ({
    ArrowLeft: _gridCellsByRow.value,
    ArrowRight: _gridCellsByRow.value.map((row) => [...row].reverse()),
    ArrowUp: _gridCellsByColumn.value,
    ArrowDown: _gridCellsByColumn.value.map((col) => [...col].reverse()),
  }));

  function getRandomEmptyGridCell(): Cell {
    const emptyCells = gridCells.value.filter((cell) => !cell.tile);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  function resetGridCells(gridSize: number) {
    gridCells.value = Array.from({ length: Math.pow(gridSize, 2) }, (_, index) => ({
      col: (index % gridSize) + 1,
      row: Math.floor(index / gridSize) + 1,
    }));
  }

  function getTilesFromGridCells() {
    return gridCells.value.reduce<Tile[]>((acc, cell) => {
      if (cell.tile) {
        acc.push(cell.tile);
      }

      return acc;
    }, []);
  }

  return {
    gridCells,
    gridCellsByDirection,
    getRandomEmptyGridCell,
    resetGridCells,
    getTilesFromGridCells,
  };
}
