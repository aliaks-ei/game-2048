import { ref } from "vue";

import type { Cell } from "@/types";

export function useGameState() {
  const score = ref(0);
  const canAcceptUserInput = ref(true); // no user input while tiles are moving

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

  function setCanAcceptUserInput(value: boolean) {
    canAcceptUserInput.value = value;
  }

  return {
    canAcceptUserInput,
    score,
    endGame,
    mergeTilesInGridCells,
    setCanAcceptUserInput,
  };
}
