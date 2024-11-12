import { useGridCells } from "./useGridCells";

describe("useGridCells", () => {
  describe("gridCells", () => {
    test("should generate empty grid cells", () => {
      const { gridCells } = useGridCells();

      expect(gridCells.value).toHaveLength(0);
    });
  });

  describe("gridCellsByDirection", () => {
    beforeEach(() => {
      const { resetGridCells } = useGridCells();

      resetGridCells(2);
    });
    test("should generate grid cells by direction", () => {
      const { gridCellsByDirection } = useGridCells();

      expect(Object.keys(gridCellsByDirection.value)).toHaveLength(4);
    });

    test("should have correct values order for ArrowLeft", () => {
      const { gridCellsByDirection } = useGridCells();

      expect(gridCellsByDirection.value.ArrowLeft).toEqual([
        [
          { col: 1, row: 1 },
          { col: 2, row: 1 },
        ],
        [
          { col: 1, row: 2 },
          { col: 2, row: 2 },
        ],
      ]);
    });

    test("should have correct values order for ArrowRight", () => {
      const { gridCellsByDirection } = useGridCells();

      expect(gridCellsByDirection.value.ArrowRight).toEqual([
        [
          { col: 2, row: 1 },
          { col: 1, row: 1 },
        ],
        [
          { col: 2, row: 2 },
          { col: 1, row: 2 },
        ],
      ]);
    });

    test("should have correct values order for ArrowUp", () => {
      const { gridCellsByDirection } = useGridCells();

      expect(gridCellsByDirection.value.ArrowUp).toEqual([
        [
          { col: 1, row: 1 },
          { col: 1, row: 2 },
        ],
        [
          { col: 2, row: 1 },
          { col: 2, row: 2 },
        ],
      ]);
    });

    test("should have correct values order for ArrowDown", () => {
      const { gridCellsByDirection } = useGridCells();

      expect(gridCellsByDirection.value.ArrowDown).toEqual([
        [
          { col: 1, row: 2 },
          { col: 1, row: 1 },
        ],
        [
          { col: 2, row: 2 },
          { col: 2, row: 1 },
        ],
      ]);
    });
  });

  describe("getRandomEmptyGridCell", () => {
    test("should return random empty grid cell", () => {
      const { getRandomEmptyGridCell, gridCells, resetGridCells } = useGridCells();
      resetGridCells(2);

      const cell = getRandomEmptyGridCell();

      expect(cell.col).toBeGreaterThanOrEqual(1);
      expect(cell.row).toBeGreaterThanOrEqual(1);
      expect(gridCells.value).toContainEqual(cell);
    });
  });

  describe("getTilesFromGridCells", () => {
    test("should return tiles from grid cells", () => {
      const { getTilesFromGridCells, resetGridCells } = useGridCells();
      resetGridCells(2);

      const tiles = getTilesFromGridCells();

      expect(tiles).toHaveLength(0);
    });
  });

  describe("resetGridCells", () => {
    test("should reset grid cells", () => {
      const { resetGridCells, gridCells } = useGridCells();

      resetGridCells(2);

      expect(gridCells.value).toHaveLength(4);
    });

    test("should overwrite grid cells", () => {
      const { resetGridCells, gridCells } = useGridCells();

      resetGridCells(2);
      resetGridCells(3);

      expect(gridCells.value).toHaveLength(9);
    });
  });
});
