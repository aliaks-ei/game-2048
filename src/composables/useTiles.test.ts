import { setActivePinia, createPinia } from "pinia";
import { useGridCells } from "./useGridCells";
import { useTiles } from "./useTiles";

const mockCell = { col: 1, row: 1 };
const mockTile = { value: 2, col: 2, row: 1, id: "id-1" };

const setScore = vi.fn();

vi.mock("@/stores/gameState", () => ({
  useGameStateStore: vi.fn(() => ({
    setScore,
  })),
}));

describe("useTiles", () => {
  beforeEach(() => {
    const { setRenderedTiles } = useTiles();

    setActivePinia(createPinia());
    setRenderedTiles([]);

    vi.clearAllMocks();
  });

  describe("renderedTiles", () => {
    test("should be initialized with empty array", () => {
      const { renderedTiles } = useTiles();

      expect(renderedTiles.value).toHaveLength(0);
    });
  });

  describe("getTileElemById", () => {
    test("should return tile element by id", () => {
      const { getTileElemById } = useTiles();

      const tileElem = document.createElement("div");
      tileElem.setAttribute("data-tile-id", "test-id");

      document.body.appendChild(tileElem);

      expect(getTileElemById("test-id")).toBe(tileElem);

      document.body.removeChild(tileElem);
    });

    test("should return null if tile element not found", () => {
      const { getTileElemById } = useTiles();

      expect(getTileElemById("test-id")).toBeNull();
    });
  });

  describe("canCellAcceptTile", () => {
    test("should return true if cell has no tile", () => {
      const { canCellAcceptTile } = useTiles();

      expect(canCellAcceptTile(mockCell, mockTile)).toBe(true);
    });

    test("should return false if cell has tile", () => {
      const { canCellAcceptTile } = useTiles();

      expect(canCellAcceptTile({ ...mockCell, tile: mockTile })).toBe(false);
    });

    test("should return false if tile in cell is obstacle", () => {
      const { canCellAcceptTile } = useTiles();

      expect(canCellAcceptTile({ ...mockCell, tile: { ...mockTile, isObstacle: true } })).toBe(
        false,
      );
    });

    test("should return false if cell has tile to merge", () => {
      const { canCellAcceptTile } = useTiles();

      expect(
        canCellAcceptTile({ ...mockCell, tile: { ...mockTile }, tileToMerge: mockTile }, mockTile),
      ).toBe(false);
    });

    test("should return false if tile in cell has different value", () => {
      const { canCellAcceptTile } = useTiles();

      expect(canCellAcceptTile({ ...mockCell, tile: { ...mockTile, value: 3 } }, mockTile)).toBe(
        false,
      );
    });

    test("should return true if tile in cell has same value", () => {
      const { canCellAcceptTile } = useTiles();

      expect(canCellAcceptTile({ ...mockCell, tile: { ...mockTile, value: 2 } }, mockTile)).toBe(
        true,
      );
    });
  });

  describe("canTileSlide", () => {
    test("should return true if tile can slide", () => {
      const { canTileSlide } = useTiles();
      const mockCellWithTile = { ...mockCell, tile: mockTile };

      expect(
        canTileSlide([
          [mockCellWithTile, mockCellWithTile],
          [mockCellWithTile, mockCellWithTile],
        ]),
      ).toBe(true);
    });

    test("should return false if tile cannot slide", () => {
      const { canTileSlide } = useTiles();

      expect(canTileSlide([[mockCell, mockCell], [mockCell]])).toBe(false);
    });
  });

  describe("setRenderedTiles", () => {
    test("should set rendered tiles", () => {
      const { setRenderedTiles, renderedTiles } = useTiles();

      setRenderedTiles([mockTile]);

      expect(renderedTiles.value).toEqual([mockTile]);
    });

    test("should update rendered tiles", () => {
      const { setRenderedTiles, renderedTiles } = useTiles();

      setRenderedTiles([mockTile]);
      setRenderedTiles([mockTile, mockTile]); // Update rendered tiles

      expect(renderedTiles.value).toEqual([mockTile, mockTile]);
    });
  });

  describe("mergeTilesInGridCells", () => {
    test("should merge tiles in grid cells", () => {
      const { mergeTilesInGridCells } = useTiles();

      const gridCells = [
        { ...mockCell, tile: { ...mockTile }, tileToMerge: { ...mockTile } },
        { ...mockCell, tile: { ...mockTile }, tileToMerge: { ...mockTile } },
      ];

      mergeTilesInGridCells(gridCells);

      expect(gridCells).toEqual([
        { ...mockCell, tile: { ...mockTile, value: mockTile.value * 2 } },
        { ...mockCell, tile: { ...mockTile, value: mockTile.value * 2 } },
      ]);
      expect(setScore).toHaveBeenCalledWith(expect.any(Number));
    });

    test("should not merge tiles in grid cells if no tiles to merge", () => {
      const { mergeTilesInGridCells } = useTiles();

      const gridCells = [{ ...mockCell, tile: { ...mockTile } }];

      mergeTilesInGridCells(gridCells);

      expect(gridCells).toEqual([{ ...mockCell, tile: { ...mockTile } }]);
      expect(setScore).not.toHaveBeenCalled();
    });
  });

  describe("moveTilesIfPossible", () => {
    test("should move tiles if possible", async () => {
      const { moveTilesIfPossible } = useTiles();

      const gridCellsMatrix = [
        [
          { ...mockCell, tile: { ...mockTile } },
          { ...mockCell, tile: { ...mockTile } },
        ],
        [
          { ...mockCell, tile: { ...mockTile } },
          { ...mockCell, tile: { ...mockTile } },
        ],
      ];

      expect(await moveTilesIfPossible(gridCellsMatrix)).toBe(true);
    });

    test("should not move tiles if not possible", async () => {
      const { moveTilesIfPossible } = useTiles();

      const gridCellsMatrix = [
        [
          { ...mockCell, tile: { ...mockTile, isObstacle: true } },
          { ...mockCell, tile: { ...mockTile, isObstacle: true } },
        ],
        [
          { ...mockCell, tile: { ...mockTile, isObstacle: true } },
          { ...mockCell, tile: { ...mockTile, isObstacle: true } },
        ],
      ];

      expect(await moveTilesIfPossible(gridCellsMatrix)).toBe(false);
    });
  });

  describe("addTileToCell", () => {
    beforeEach(() => {
      const { resetGridCells } = useGridCells();
      resetGridCells(4);
    });

    test("should add tile to cell", () => {
      const { addTileToCell, renderedTiles } = useTiles();
      const cell = addTileToCell();

      expect(cell.tile).toEqual(renderedTiles.value[0]);
    });

    test("should add obstacle tile to cell", () => {
      const { addTileToCell, renderedTiles } = useTiles();
      const cell = addTileToCell({ isObstacle: true });

      expect(cell.tile).toEqual(renderedTiles.value[0]);
      expect(cell.tile).toEqual(
        expect.objectContaining({
          isObstacle: true,
          value: 0,
        }),
      );
    });
  });
});
