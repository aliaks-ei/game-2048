import { computed, ref } from "vue";
import { useGameStateStore } from "@/stores/gameState";

import type { Cell, Tile } from "@/types";

interface SetTileInCellPayload {
  cell: Cell;
  tile: Partial<Tile>;
  isTileToMerge?: boolean;
}

const TILE_HIGHEST_VALUE = 2048;

export function useTiles() {
  const gameStateStore = useGameStateStore();
  const renderedTiles = ref<Tile[]>([]);

  const hasReachedHighestValue = computed(() => {
    return Math.max(...renderedTiles.value.map((tile) => tile.value)) >= TILE_HIGHEST_VALUE;
  });

  function canCellAcceptTile(cell: Cell, tile?: Tile) {
    return (
      !cell.tile || (!cell.tile.isObstacle && !cell.tileToMerge && cell.tile.value === tile?.value)
    );
  }

  function setTileInCell({ cell, tile, isTileToMerge }: SetTileInCellPayload) {
    cell[isTileToMerge ? "tileToMerge" : "tile"] = {
      value: tile.value ?? 2, // set default value to 2
      id: tile.id ?? crypto.randomUUID(),
      isObstacle: tile.isObstacle,
      col: cell.col,
      row: cell.row,
    };
  }

  function canTileSlide(gridCellsMatrix: Cell[][]) {
    return gridCellsMatrix.some((column) =>
      column.some((cell, cellIndex) => {
        const targetCell = column[cellIndex - 1];
        const restrictedCell = !cellIndex || !cell.tile || cell.tile.isObstacle;

        return restrictedCell ? false : canCellAcceptTile(targetCell, cell.tile);
      }),
    );
  }

  async function moveTiles(gridCellsMatrix: Cell[][]) {
    return Promise.all(
      gridCellsMatrix.flatMap((group) => {
        const promises: Promise<void>[] = [];

        // Starting from the second row since the first row cannot move
        for (let i = 1; i < group.length; i++) {
          const currentCell = group[i];

          if (!currentCell.tile || currentCell.tile.isObstacle) continue;

          let lastAvailableCell: Cell | null = null;

          for (let j = i - 1; j >= 0; j--) {
            const targetCell = group[j];

            if (!canCellAcceptTile(targetCell, currentCell.tile)) {
              break;
            }

            lastAvailableCell = targetCell;
          }

          if (lastAvailableCell) {
            const elem = document.querySelector(`[data-id="${currentCell.tile.id}"]`);

            if (elem) {
              promises.push(
                new Promise<void>((resolve) => {
                  elem.addEventListener("transitionend", () => resolve(), { once: true });
                }),
              );
            }

            setTileInCell({
              cell: lastAvailableCell,
              tile: currentCell.tile,
              isTileToMerge: !!lastAvailableCell.tile,
            });

            delete currentCell.tile;

            const tileIds = [lastAvailableCell.tile?.id, lastAvailableCell.tileToMerge?.id];

            renderedTiles.value.forEach((tile) => {
              if (tileIds.includes(tile.id)) {
                tile.col = lastAvailableCell.col;
                tile.row = lastAvailableCell.row;
              }
            });
          }
        }

        return promises;
      }),
    );
  }

  function setRenderedTiles(tiles: Tile[]) {
    renderedTiles.value = tiles;
  }

  function mergeTilesInGridCells(gridCells: Cell[]) {
    gridCells
      .filter((cell) => cell.tileToMerge)
      .forEach((cell) => {
        if (cell.tile) {
          cell.tile.value *= 2;
          gameStateStore.setScore(gameStateStore.score + cell.tile.value);
        }

        delete cell.tileToMerge;
      });
  }

  return {
    renderedTiles,
    hasReachedHighestValue,
    canCellAcceptTile,
    setTileInCell,
    canTileSlide,
    moveTiles,
    setRenderedTiles,
    mergeTilesInGridCells,
  };
}
