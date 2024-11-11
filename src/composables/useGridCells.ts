import { ref, computed } from "vue";
import { generateNumArray } from "@/utils";

import type { Cell, Tile } from "@/types";

// Shared state
const gridCells = ref<Cell[]>([]);

export function useGridCells() {
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

  function resetGridCells(size: number) {
    gridCells.value = generateNumArray(Math.pow(size, 2)).map((index) => ({
      col: (index % size) + 1,
      row: Math.floor(index / size) + 1,
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
    getTilesFromGridCells,
    resetGridCells,
  };
}
