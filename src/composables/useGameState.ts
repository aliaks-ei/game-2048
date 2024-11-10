import { reactive, ref } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

import type { Cell } from "@/types";

type GameOverScenario = "win" | "lose";
type GameOverDialogContent = {
  title: string;
  message: string;
};

const GAME_OVER_DIALOG_CONTENT: Record<GameOverScenario, GameOverDialogContent> = {
  win: {
    title: "Congratulations!",
    message: `
      You've reached the 2048 tile and won the game!
      Do you want to keep going and aim for an even higher score?
    `,
  },
  lose: {
    title: "Game Over",
    message: `
      You've reached a full board with no possible moves left!
      Would you like to try again and beat your highest score?
    `,
  },
};

// Shared state
const gridSize = ref(useLocalStorage<number>("gridSize", 6).data);
const numObstacles = ref(useLocalStorage<number>("numObstacles", 0).data);

export function useGameState() {
  const score = ref(0);
  const bestScore = ref(useLocalStorage<number>("bestScore", 0).data);
  const canAcceptUserInput = ref(true); // no user input while tiles are moving
  const gameOverDialog = reactive({
    show: false,
    title: "",
    message: "",
  });

  function endGame(scenario: GameOverScenario) {
    gameOverDialog.show = true;
    gameOverDialog.title = GAME_OVER_DIALOG_CONTENT[scenario].title;
    gameOverDialog.message = GAME_OVER_DIALOG_CONTENT[scenario].message;

    // Updating best score
    if (score.value > bestScore.value) {
      bestScore.value = score.value;
    }
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
    gridSize,
    numObstacles,
    canAcceptUserInput,
    score,
    bestScore,
    gameOverDialog,
    endGame,
    mergeTilesInGridCells,
    setCanAcceptUserInput,
  };
}
