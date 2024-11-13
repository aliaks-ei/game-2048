import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useGameStateStore } from "@/stores/gameState";
import { useGridCellsStore } from "@/stores/gridCells";

import type { Cell, Tile } from "@/types";

interface _SetTileInCellPayload {
  cell: Cell;
  tile: Partial<Tile>;
  isTileToMerge?: boolean;
}

const TILE_HIGHEST_VALUE = 2048;

export const useTilesStore = defineStore("tiles", () => {
  const renderedTiles = ref<Tile[]>([]);

  const hasReachedHighestValue = computed(() => {
    return Math.max(...renderedTiles.value.map((tile) => tile.value)) >= TILE_HIGHEST_VALUE;
  });

  // Private methods
  function _setTileInCell({ cell, tile, isTileToMerge }: _SetTileInCellPayload) {
    cell[isTileToMerge ? "tileToMerge" : "tile"] = {
      value: tile.value ?? 2, // set default value to 2
      id: tile.id ?? crypto.randomUUID(),
      isObstacle: tile.isObstacle,
      col: cell.col,
      row: cell.row,
    };
  }

  async function _moveTiles(gridCellsMatrix: Cell[][]) {
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

            if (!canCellAcceptTile(targetCell, currentCell.tile)) break;

            lastAvailableCell = targetCell;
          }

          if (lastAvailableCell) {
            const tileElem = getTileElemById(currentCell.tile.id);

            if (tileElem) {
              promises.push(
                new Promise<void>((resolve) => {
                  tileElem.addEventListener("transitionend", () => resolve(), { once: true });
                }),
              );
            }

            _setTileInCell({
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

  function getTileElemById(id: string) {
    return document.querySelector(`[data-tile-id="${id}"]`);
  }

  function canCellAcceptTile(cell: Cell, tile?: Tile) {
    return (
      !cell.tile || (!cell.tile.isObstacle && !cell.tileToMerge && cell.tile.value === tile?.value)
    );
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

  function setRenderedTiles(tiles: Tile[]) {
    renderedTiles.value = tiles;
  }

  function mergeTilesInGridCells(gridCells: Cell[]) {
    const gameStateStore = useGameStateStore();

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

  async function moveTilesIfPossible(gridCellsMatrix: Cell[][]) {
    if (!canTileSlide(gridCellsMatrix)) {
      return false;
    }

    await _moveTiles(gridCellsMatrix);
    return true;
  }

  function addTileToCell({ isObstacle }: { isObstacle?: boolean } = {}) {
    const gridCellsStore = useGridCellsStore();
    const cell = gridCellsStore.getRandomEmptyGridCell();

    _setTileInCell({ cell, tile: { value: isObstacle ? 0 : 2, isObstacle } });
    setRenderedTiles([...renderedTiles.value, cell.tile!]);

    return cell;
  }

  return {
    renderedTiles,
    hasReachedHighestValue,
    addTileToCell,
    canCellAcceptTile,
    canTileSlide,
    moveTilesIfPossible,
    setRenderedTiles,
    mergeTilesInGridCells,
    getTileElemById,
  };
});
