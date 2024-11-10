<template>
  <div class="board-controls">
    <p>Join the numbers and get to the <strong>2048 tile!</strong></p>

    <!-- Actions -->
    <div class="board-controls__actions">
      <app-button class="board-controls__action" @click="$emit('click:new-game')">
        New Game
      </app-button>
      <app-button
        class="board-controls__action board-controls__action--settings"
        aria-label="Settings"
        @click="openSettingsDialog"
      >
        &#9881;
      </app-button>
    </div>

    <!-- Settings dialog -->
    <app-dialog v-model="showSettingsDialog" title="Settings">
      <form>
        <label class="board-controls__settings-item">
          <span>Grid size</span>
          <select v-model="selectedGridSize" class="board-controls__select">
            <option value="2">2 x 2</option>
            <option value="3">3 x 3</option>
            <option value="4">4 x 4</option>
            <option value="5">5 x 5</option>
            <option value="6">6 x 6</option>
            <option value="7">7 x 7</option>
            <option value="8">8 x 8</option>
          </select>
        </label>
        <label class="board-controls__settings-item">
          <span>Obstacles</span>
          <select v-model="selectedObstacles" class="board-controls__select">
            <option value="0">None</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
      </form>
      <template #actions>
        <app-button @click="showSettingsDialog = false" outline>Cancel</app-button>
        <app-button @click="handleSaveClick">Save & Restart</app-button>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import AppButton from "@/components/AppButton/AppButton.vue";
import AppDialog from "@/components/AppDialog/AppDialog.vue";

import { useGameState } from "@/composables/useGameState";

const emit = defineEmits(["click:new-game"]);

const { gridSize } = useGameState();

const showSettingsDialog = ref(false);
const selectedGridSize = ref(gridSize.value);
const selectedObstacles = ref(0);

function openSettingsDialog() {
  selectedGridSize.value = gridSize.value;
  showSettingsDialog.value = true;
}

function handleSaveClick() {
  gridSize.value = Number(selectedGridSize.value);
  showSettingsDialog.value = false;

  emit("click:new-game");
}
</script>

<style lang="scss" scoped>
.board-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1.5rem;
  gap: 0.5rem;
  width: 100%;

  &__actions {
    display: flex;
    gap: 0.5rem;
  }

  &__action {
    line-height: 1;

    &--settings {
      font-size: 1.5rem;
    }
  }

  &__settings-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;

    & + & {
      margin-block-start: 0.5rem;
    }
  }

  &__select {
    min-width: 3.5rem;
    height: 1.5rem;
    border: 1px solid var(--text-color-dark);
    border-radius: 4px;
  }
}
</style>
