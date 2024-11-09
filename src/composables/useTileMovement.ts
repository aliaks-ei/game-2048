import type { Cell, Tile } from "@/types";

interface SetTileInCellPayload {
  cell: Cell;
  tile: Partial<Tile>;
  isTileToMerge?: boolean;
}

export function useTileMovement() {
  function canCellAcceptTile(cell: Cell, tile?: Tile) {
    return !cell.tile || (!cell.tileToMerge && cell.tile.value === tile?.value);
  }

  function setTileInCell({ cell, tile, isTileToMerge = false }: SetTileInCellPayload) {
    cell[isTileToMerge ? "tileToMerge" : "tile"] = {
      value: tile.value ?? 2, // set default value to 2
      id: tile.id ?? crypto.randomUUID(),
      col: cell.col,
      row: cell.row,
    };
  }

  function canSlide(gridCellsMatrix: Cell[][]) {
    return gridCellsMatrix.some((column) =>
      column.some((cell, cellIndex) => {
        const targetCell = column[cellIndex - 1];

        return !cellIndex || !cell.tile ? false : canCellAcceptTile(targetCell, cell.tile);
      }),
    );
  }

  return { canCellAcceptTile, setTileInCell, canSlide };
}
