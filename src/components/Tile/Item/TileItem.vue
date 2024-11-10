<template>
  <li
    :style="{ '--col': tile.col, '--row': tile.row }"
    :data-id="tile.id"
    :class="{ 'tile--obstacle': tile.isObstacle }"
    class="tile"
  >
    <div v-if="!tile.isObstacle" class="tile__inner" :class="`tile__inner--${tile.value}`">
      {{ tile.value }}
    </div>
    <img v-else src="@/assets/icons/rock.svg" alt="obstacle" />
  </li>
</template>

<script setup lang="ts">
import type { Tile } from "@/types";

defineProps<{ tile: Tile }>();
</script>

<style lang="scss" scoped>
$tile-colors: (
  "2": rgb(238, 228, 218),
  "4": rgb(237, 224, 200),
  "8": rgb(242, 177, 121),
  "16": rgb(245, 149, 99),
  "32": rgb(246, 124, 95),
  "64": rgb(246, 94, 59),
  "128": rgb(237, 207, 114),
  "256": rgb(237, 204, 97),
  "512": rgb(237, 200, 80),
  "1024": rgb(237, 197, 63),
  "2048": rgb(237, 194, 46),
);

.tile {
  position: absolute;
  width: var(--tile-size);
  height: var(--tile-size);
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
  transition-property: transform, background-color;
  will-change: transform;
  transform: translate(
    calc((var(--col) - 1) * (var(--tile-size) + var(--board-gap))),
    calc((var(--row) - 1) * (var(--tile-size) + var(--board-gap)))
  );

  &__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: min(var(--tile-size) / 4, 4vw);
    font-weight: 600;
    width: 100%;
    height: 100%;
    border-radius: var(--board-border-radius);
    animation: appear 200ms cubic-bezier(0.39, 0.575, 0.565, 1);
    box-shadow: 0.8px 1.6px 1.6px hsl(0deg 0% 0% / 0.3);

    @each $value, $color in $tile-colors {
      &--#{$value} {
        background-color: $color;
      }
    }

    &--8,
    &--16,
    &--32,
    &--64,
    &--128,
    &--256,
    &--512,
    &--1024,
    &--2048 {
      color: var(--text-color-light);
    }
  }
}

@keyframes appear {
  from {
    opacity: 0.5;
    transform: scale(0);
  }
}
</style>
