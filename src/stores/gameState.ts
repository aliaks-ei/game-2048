import { defineStore } from "pinia";
import { reactive, ref } from "vue";

type GameOverScenario = "win" | "lose";
type GameOverDialogContent = {
  title: string;
  message: string;
};

const GAME_OVER_DIALOG_CONTENT: Record<GameOverScenario, GameOverDialogContent> = {
  win: {
    title: "Congratulations!",
    message:
      "You've reached the 2048 tile and won the game! Do you want to keep going and aim for an even higher score?",
  },
  lose: {
    title: "Game Over",
    message:
      "You've reached a full board with no possible moves left! Would you like to try again and beat your highest score?",
  },
};

export const useGameStateStore = defineStore(
  "gameState",
  () => {
    const gridSize = ref(4);
    const numObstacles = ref(0);
    const score = ref(0);
    const bestScore = ref(0);
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

    function setNumObstacles(value: number) {
      numObstacles.value = value;
    }

    function setGridSize(value: number) {
      gridSize.value = value;
    }

    function setScore(value: number) {
      score.value = value;
    }

    function setBestScore(value: number) {
      bestScore.value = value;
    }

    function setCanAcceptUserInput(value: boolean) {
      canAcceptUserInput.value = value;
    }

    function hideGameOverDialog() {
      gameOverDialog.show = false;
    }

    return {
      gridSize,
      numObstacles,
      canAcceptUserInput,
      score,
      bestScore,
      gameOverDialog,
      endGame,
      setCanAcceptUserInput,
      setNumObstacles,
      setGridSize,
      setScore,
      setBestScore,
      hideGameOverDialog,
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: ["gridSize", "numObstacles", "bestScore", "score"],
    },
  },
);
