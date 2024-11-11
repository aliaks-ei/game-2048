import { nextTick } from "vue";
import { storeToRefs } from "pinia";

import { useGridCells } from "@/composables/useGridCells";
import { useTiles } from "@/composables/useTiles";
import { useGameStateStore } from "@/stores/gameState";

import type { Tile } from "@/types";

export function useUserInput() {
  const gameStateStore = useGameStateStore();
  const { gridCells, gridCellsByDirection } = useGridCells();
  const {
    renderedTiles,
    addTileToCell,
    canTileSlide,
    moveTilesIfPossible,
    setRenderedTiles,
    mergeTilesInGridCells,
    getTileElemById,
  } = useTiles();
  const { canAcceptUserInput } = storeToRefs(gameStateStore);
  const { endGame, setCanAcceptUserInput } = gameStateStore;

  async function handleUserInput(event: KeyboardEvent) {
    if (!canAcceptUserInput.value) return;

    setCanAcceptUserInput(false);

    const currentActionData = gridCellsByDirection.value[event.key];
    const hasTileMoved = currentActionData && await moveTilesIfPossible(currentActionData);

    if (hasTileMoved) {
      mergeTilesInGridCells(gridCells.value);

      const idsToRender = gridCells.value.reduce<Record<string, Tile>>((acc, cell) => {
        if (cell.tile) {
          acc[cell.tile.id] = cell.tile;
        }

        return acc;
      }, {});

      const updatedRenderedTiles = renderedTiles.value
        .filter((tile) => Object.keys(idsToRender).includes(tile.id))
        .map((tile) => idsToRender[tile.id]);

      setRenderedTiles(updatedRenderedTiles);

      const cell = addTileToCell();
      const hasNoEmptyCells = Object.values(gridCellsByDirection.value).every(
        (data) => !canTileSlide(data),
      );

      if (hasNoEmptyCells) {
        await nextTick();

        getTileElemById(cell.tile!.id)?.addEventListener(
          "animationend",
          () => {
            setCanAcceptUserInput(false);
            endGame("lose");
          },
          { once: true },
        );
      }
    }

    setCanAcceptUserInput(true);
  }

  return {
    handleUserInput,
  };
}
