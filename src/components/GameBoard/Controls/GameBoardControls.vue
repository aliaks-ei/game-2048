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
          <app-select v-model="selectedGridSize" :options="availableGridSizes"></app-select>
        </label>
        <label class="board-controls__settings-item">
          <span>Obstacles (max: grid size - 1)</span>
          <app-select v-model="selectedNumObstacles" :options="availableNumObstacles"></app-select>
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
import { ref, watch, computed } from "vue";

import AppButton from "@/components/AppButton/AppButton.vue";
import AppDialog from "@/components/AppDialog/AppDialog.vue";
import AppSelect from "@/components/AppSelect/AppSelect.vue";

import { useGameStateStore } from "@/stores/gameState";
import { storeToRefs } from "pinia";

const emit = defineEmits(["click:new-game"]);

const { gridSize, numObstacles } = storeToRefs(useGameStateStore());
const { setGridSize, setNumObstacles } = useGameStateStore();

const showSettingsDialog = ref(false);
const selectedGridSize = ref(gridSize.value);
const selectedNumObstacles = ref(numObstacles.value);
const availableGridSizes = ref(
  Array.from({ length: 7 }, (_, i) => i + 2).map((size) => ({
    label: `${size} x ${size}`,
    value: size,
  })),
);
const availableNumObstacles = computed(() =>
  Array.from({ length: selectedGridSize.value }, (_, i) => i).map((item) => ({
    label: String(item),
    value: item,
  })),
);

function openSettingsDialog() {
  selectedGridSize.value = gridSize.value;
  selectedNumObstacles.value = numObstacles.value;
  showSettingsDialog.value = true;
}

function handleSaveClick() {
  setGridSize(Number(selectedGridSize.value));
  setNumObstacles(Number(selectedNumObstacles.value));
  showSettingsDialog.value = false;

  emit("click:new-game");
}

watch(selectedGridSize, (current) => {
  if (current <= selectedNumObstacles.value) {
    selectedNumObstacles.value = 0;
  }
});
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
    gap: 2rem;

    & + & {
      margin-block-start: 0.5rem;
    }
  }
}
</style>
