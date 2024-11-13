import { nextTick } from "vue";
import { storeToRefs } from "pinia";

import { useGridCellsStore } from "@/stores/gridCells";
import { useTilesStore } from "@/stores/tiles";
import { useGameStateStore } from "@/stores/gameState";

import type { Tile } from "@/types";

export function useUserInput() {
  const { canAcceptUserInput } = storeToRefs(useGameStateStore());
  const { endGame, setCanAcceptUserInput } = useGameStateStore();
  const { gridCells, gridCellsByDirection } = storeToRefs(useGridCellsStore());
  const { renderedTiles } = storeToRefs(useTilesStore());
  const {
    addTileToCell,
    canTileSlide,
    moveTilesIfPossible,
    setRenderedTiles,
    mergeTilesInGridCells,
    getTileElemById,
  } = useTilesStore();

  async function handleUserInput(event: KeyboardEvent) {
    if (!canAcceptUserInput.value) return;

    setCanAcceptUserInput(false);

    const currentActionData = gridCellsByDirection.value[event.key];
    const hasTileMoved = currentActionData && (await moveTilesIfPossible(currentActionData));

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
