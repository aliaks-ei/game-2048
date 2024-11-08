<template>
  <ul class="tile-container">
    <slot></slot>
  </ul>
</template>

<style lang="scss" scoped>
.tile-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: var(--board-gap);
  z-index: 1;
}
</style>
