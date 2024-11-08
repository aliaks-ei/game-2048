import { ref } from "vue";

import type { Cell } from "@/types";

export function useGameState() {
  const score = ref(0);

  function endGame() {
    alert("Game Over");
  }

  function mergeTilesInGridCells(gridCells: Cell[]) {
    gridCells
      .filter((cell) => cell.tileToMerge)
      .forEach((cell) => {
        if (cell.tile) {
          cell.tile.value *= 2;
          score.value += cell.tile.value;
        }

        delete cell.tileToMerge;
      });
  }

  return {
    score,
    endGame,
    mergeTilesInGridCells,
  };
}
