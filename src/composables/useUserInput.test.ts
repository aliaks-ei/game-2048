import { ref } from "vue";
import { setActivePinia, createPinia } from "pinia";
import { useUserInput } from "./useUserInput";

const endGame = vi.fn();
const setCanAcceptUserInput = vi.fn();

vi.mock("@/stores/gameState", () => ({
  useGameStateStore: vi.fn(() => ({
    endGame,
    setCanAcceptUserInput,
    canAcceptUserInput: ref(true),
  })),
}));

describe("useUserInput", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("handleUserInput", () => {
    test("should not do anything if user input is not allowed", async () => {
      const { handleUserInput } = useUserInput();

      await handleUserInput({ key: "Shift" } as KeyboardEvent);

      expect(endGame).not.toHaveBeenCalled();
    });

    test("should block user input while tiles are moving and enable it again", async () => {
      const { handleUserInput } = useUserInput();

      await handleUserInput({ key: "ArrowUp" } as KeyboardEvent);

      expect(setCanAcceptUserInput).toHaveBeenNthCalledWith(1, false);
      expect(setCanAcceptUserInput).toHaveBeenLastCalledWith(true);
    });
  });
});
