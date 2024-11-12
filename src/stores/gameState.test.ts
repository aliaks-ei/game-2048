import { setActivePinia, createPinia } from "pinia";
import { useGameStateStore } from "./gameState";

describe("gameState", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("endGame", () => {
    test("ends game with Win scenario", () => {
      const { endGame } = useGameStateStore();

      endGame("win");

      expect(useGameStateStore().gameOverDialog.show).toBe(true);
      expect(useGameStateStore().gameOverDialog.title).toBe("Congratulations!");
      expect(useGameStateStore().gameOverDialog.message).toBe(
        "You've reached the 2048 tile and won the game! Do you want to keep going and aim for an even higher score?",
      );
    });

    test("ends game with Lose scenario", () => {
      const { endGame } = useGameStateStore();

      endGame("lose");

      expect(useGameStateStore().gameOverDialog.show).toBe(true);
      expect(useGameStateStore().gameOverDialog.title).toBe("Game Over");
      expect(useGameStateStore().gameOverDialog.message).toBe(
        "You've reached a full board with no possible moves left! Would you like to try again and beat your highest score?",
      );
    });

    test("updates best score", () => {
      const { endGame, setScore } = useGameStateStore();

      setScore(1000);
      endGame("lose");

      expect(useGameStateStore().bestScore).toBe(1000);
    });

    test("does not update best score if score is less than current best score", () => {
      const { endGame, setScore, setBestScore } = useGameStateStore();

      setScore(500);
      setBestScore(1000);
      endGame("lose");

      expect(useGameStateStore().bestScore).toBe(1000);
    });
  });

  describe("setNumObstacles", () => {
    test("sets number of obstacles", () => {
      const { setNumObstacles } = useGameStateStore();

      setNumObstacles(2);

      expect(useGameStateStore().numObstacles).toBe(2);
    });

    test("sets number of obstacles to 0", () => {
      const { setNumObstacles } = useGameStateStore();

      setNumObstacles(0);

      expect(useGameStateStore().numObstacles).toBe(0);
    });
  });

  describe("setGridSize", () => {
    test("sets grid size", () => {
      const { setGridSize } = useGameStateStore();

      setGridSize(4);

      expect(useGameStateStore().gridSize).toBe(4);
    });
  });

  describe("setScore", () => {
    test("sets score", () => {
      const { setScore } = useGameStateStore();

      setScore(1000);

      expect(useGameStateStore().score).toBe(1000);
    });
  });

  describe("setBestScore", () => {
    test("sets best score", () => {
      const { setBestScore } = useGameStateStore();

      setBestScore(1000);

      expect(useGameStateStore().bestScore).toBe(1000);
    });
  });

  describe("setCanAcceptUserInput", () => {
    test("sets canAcceptUserInput", () => {
      const { setCanAcceptUserInput } = useGameStateStore();

      setCanAcceptUserInput(true);

      expect(useGameStateStore().canAcceptUserInput).toBe(true);
    });
  });

  describe("hideGameOverDialog", () => {
    test("hides game over dialog", () => {
      const { hideGameOverDialog } = useGameStateStore();

      hideGameOverDialog();

      expect(useGameStateStore().gameOverDialog.show).toBe(false);
    });
  });
});
