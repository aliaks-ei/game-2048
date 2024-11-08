<template>
  <li :style="{ '--col': col, '--row': row }" class="tile">
    <div class="tile__inner" :class="`tile__inner--${value}`">{{ value }}</div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  value: number;
  col: number;
  row: number;
}

defineProps<Props>();
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
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
  transition-property: transform, background-color;
  will-change: transform;
  transform: translate(
    calc((var(--col) - 1) * (var(--tile-size) + var(--board-gap))),
    calc((var(--row) - 1) * (var(--tile-size) + var(--board-gap)))
  );
}

.tile__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  width: 100%;
  height: 100%;
  border-radius: var(--board-border-radius);
  animation: appear 250ms ease-in-out;
  box-shadow: 0.8px 1.6px 1.6px hsl(0deg 0% 0% / 0.3);

  @each $value, $color in $tile-colors {
    &--#{$value} {
      background-color: $color;
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
