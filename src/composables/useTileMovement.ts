import type { Cell, Tile } from "@/types";

interface SetTileInCellPayload {
  cell: Cell;
  tile: Partial<Tile>;
  isTileToMerge?: boolean;
}

export function useTileMovement() {
  function _canCellAcceptTile(cell: Cell, tile?: Tile) {
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

  // TODO: Refactor this function
  // async function moveTiles(gridCellsMatrix: Cell[][]) {
  //   return Promise.all(
  //     gridCellsMatrix.flatMap((column) => {
  //       const promises: Promise<void>[] = [];

  //       // Starting from the second row since the first row cannot move up
  //       for (let i = 1; i < column.length; i++) {
  //         const currentCell = column[i];

  //         if (!currentCell.tile) continue;

  //         let lastAvailableCell: Cell | null = null;

  //         for (let j = i - 1; j >= 0; j--) {
  //           const targetCell = column[j];

  //           if (_canCellAcceptTile(targetCell, currentCell.tile)) {
  //             lastAvailableCell = targetCell;
  //           }
  //         }

  //         if (lastAvailableCell) {
  //           setTileInCell({
  //             cell: lastAvailableCell,
  //             tile: currentCell.tile,
  //             isTileToMerge: !!lastAvailableCell.tile,
  //           });

  //           delete currentCell.tile;
  //         }
  //       }

  //       return promises;
  //     }),
  //   );
  // }

  function canSlide(gridCellsMatrix: Cell[][]) {
    return gridCellsMatrix.some((column) =>
      column.some((cell, cellIndex) => {
        const targetCell = column[cellIndex - 1];

        return !cellIndex || !cell.tile ? false : _canCellAcceptTile(targetCell, cell.tile);
      }),
    );
  }

  return { _canCellAcceptTile, setTileInCell, canSlide };
}
