<template>
  <li
    :style="{ '--col': tile.col, '--row': tile.row }"
    :data-tile-id="tile.id"
    :class="{ 'tile--obstacle': tile.isObstacle }"
    class="tile"
  >
    <div
      v-if="!tile.isObstacle"
      class="tile__inner"
      :class="[`tile__inner--${tile.value}`, `tile__inner--digits-${digitCount}`]"
    >
      {{ tile.value }}
    </div>
    <img v-else src="@/assets/icons/rock.svg" alt="obstacle" />
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Tile } from "@/types";

const props = defineProps<{ tile: Tile }>();

const digitCount = computed(() => {
  if (props.tile.isObstacle) return 0;
  return props.tile.value.toString().length;
});
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
  "4096": rgb(237, 190, 30),
  "8192": rgb(242, 177, 50),
  "16384": rgb(245, 149, 60),
  "32768": rgb(246, 124, 70),
  "65536": rgb(246, 94, 45),
  "131072": rgb(237, 207, 90),
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
    /* Base font size - responsive to tile size */
    font-size: calc(var(--tile-size) / 4);
    font-weight: 700;
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

    /* Light text for darker tiles */
    &--8,
    &--16,
    &--32,
    &--64,
    &--128,
    &--256,
    &--512,
    &--1024,
    &--2048,
    &--4096,
    &--8192,
    &--16384,
    &--32768,
    &--65536,
    &--131072 {
      color: var(--text-color-light);
      text-shadow: 0 1px 1px rgba(0 0 0 / 30%);
    }

    /* Fallback for any undefined tile values (super high numbers) */
    &:not([class*="tile__inner--"]) {
      background-color: rgb(60, 58, 50);
      color: var(--text-color-light);
      text-shadow: 0 1px 1px rgba(0 0 0 / 30%);
    }

    /* Dynamic font sizing based on digit count */
    &--digits-1 {
      /* 2, 4, 8 - largest */
      font-size: calc(var(--tile-size) / 3.2);
    }

    &--digits-2 {
      /* 16, 32, 64 - large */
      font-size: calc(var(--tile-size) / 3.5);
    }

    &--digits-3 {
      /* 128, 256, 512 - medium */
      font-size: calc(var(--tile-size) / 4.5);
    }

    &--digits-4 {
      /* 1024, 2048, 4096, 8192 - smaller */
      font-size: calc(var(--tile-size) / 5.5);
    }

    &--digits-5 {
      /* 16384, 32768, 65536 - very small */
      font-size: calc(var(--tile-size) / 7);
      letter-spacing: -0.05em;
    }

    &--digits-6,
    &--digits-7,
    &--digits-8 {
      /* 131072+ - smallest possible */
      font-size: calc(var(--tile-size) / 8.5);
      letter-spacing: -0.1em;
    }
  }
}

/* Mobile optimizations - bigger, bolder numbers */
@media (max-width: 768px) {
  .tile {
    &__inner {
      font-weight: 800;

      /* Larger base sizes on mobile */
      &--digits-1 {
        font-size: calc(var(--tile-size) / 2.5);
      }

      &--digits-2 {
        font-size: calc(var(--tile-size) / 2.8);
      }

      &--digits-3 {
        font-size: calc(var(--tile-size) / 3.5);
      }

      &--digits-4 {
        font-size: calc(var(--tile-size) / 4.5);
      }

      &--digits-5 {
        font-size: calc(var(--tile-size) / 6);
        letter-spacing: -0.08em;
      }

      &--digits-6,
      &--digits-7,
      &--digits-8 {
        font-size: calc(var(--tile-size) / 7.5);
        letter-spacing: -0.12em;
      }
    }
  }
}

@media (max-width: 480px) {
  .tile {
    &__inner {
      /* Even bigger on smaller mobile screens (tiles are larger) */
      &--digits-1 {
        font-size: calc(var(--tile-size) / 2.3);
      }

      &--digits-2 {
        font-size: calc(var(--tile-size) / 2.6);
      }

      &--digits-3 {
        font-size: calc(var(--tile-size) / 3.2);
      }

      &--digits-4 {
        font-size: calc(var(--tile-size) / 4.2);
      }

      &--digits-5 {
        font-size: calc(var(--tile-size) / 5.5);
        letter-spacing: -0.1em;
      }

      &--digits-6,
      &--digits-7,
      &--digits-8 {
        font-size: calc(var(--tile-size) / 7);
        letter-spacing: -0.15em;
      }
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
