<template>
  <Transition :duration="transitionDuration">
    <Teleport to="#dialogs">
      <div v-if="showDialog" class="app-dialog" :aria-hidden="!showDialog">
        <div class="app-dialog__overlay" tabindex="-1" @click.self="closeDialog">
          <div class="app-dialog__container" role="dialog">
            <header class="app-dialog__header">
              <h2 class="app-dialog__title">{{ title }}</h2>
              <button
                class="app-dialog__close"
                aria-label="Close dialog"
                @click="closeDialog"
              ></button>
            </header>
            <main class="app-dialog__content">
              <p>
                <slot></slot>
              </p>
            </main>
            <footer class="app-dialog__actions">
              <slot name="actions"></slot>
            </footer>
          </div>
        </div>
      </div>
    </Teleport>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const transitionDuration = ref(300);
const showDialog = defineModel<boolean>({ required: true });

defineProps<{ title?: string }>();

function closeDialog() {
  showDialog.value = false;
}
</script>

<style lang="scss" scoped>
.app-dialog {
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0 0 0 / 60%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
  }

  &__container {
    background-color: #ffffff;
    padding: 1.5rem;
    max-width: 500px;
    max-height: 100vh;
    border-radius: 0.25rem;
    overflow-y: auto;
    box-sizing: border-box;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    margin-block: 0;
  }

  &__close {
    font-size: 1.25rem;
    padding: 0.25rem 0.75rem;
    margin-right: -0.5rem;
    background: transparent;
    border: 0;
    cursor: pointer;

    &:before {
      color: var(--text-color-dark);
      content: "\2715";
    }
  }

  &__content {
    margin-block: 2rem;
    padding: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
}

.v-enter-active .app-dialog__overlay,
.v-leave-active .app-dialog__overlay {
  transition: opacity calc(v-bind(transitionDuration) * 1ms) ease;
}

.v-enter-from .app-dialog__overlay,
.v-leave-to .app-dialog__overlay {
  opacity: 0;
}

.v-enter-active .app-dialog__container,
.v-leave-active .app-dialog__container {
  transition: transform calc(v-bind(transitionDuration) * 1ms) ease;
}

.v-enter-from .app-dialog__container,
.v-leave-to .app-dialog__container {
  transform: translateY(15%);
}
</style>
