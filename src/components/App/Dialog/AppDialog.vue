<template>
  <Transition :duration="transitionDuration">
    <Teleport to="#dialogs">
      <div v-if="showDialog" class="app-dialog" :aria-hidden="!showDialog">
        <div class="app-dialog__overlay" tabindex="-1" @click.self="closeDialog">
          <div
            class="app-dialog__container"
            role="dialog"
            data-testid="app-dialog"
            :aria-labelledby="dialogTitleId"
          >
            <header class="app-dialog__header">
              <h2 :id="dialogTitleId" class="app-dialog__title">{{ title }}</h2>
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
import { ref, useId, computed } from "vue";

const transitionDuration = ref(300);
const showDialog = defineModel<boolean>({ required: true });
const dialogTitleId = computed(() => `dialog-title-${useId()}`);

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
    background-color: rgba(0 0 0 / 80%);
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
    /* Touch-friendly close button */
    min-width: 2.75rem;
    min-height: 2.75rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;

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

/* Mobile-specific dialog styles */
@media (max-width: 768px) {
  .app-dialog {
    &__overlay {
      padding: 1rem;
    }

    &__container {
      padding: 1.25rem;
      max-width: 100%;
      width: 100%;
    }

    &__content {
      margin-block: 1.5rem;
    }

    &__actions {
      flex-wrap: wrap;
      gap: 0.75rem;

      > * {
        flex: 1 1 auto;
        min-width: calc(50% - 0.375rem);
      }
    }
  }
}

@media (max-width: 480px) {
  .app-dialog {
    &__overlay {
      padding: 0.75rem;
    }

    &__container {
      padding: 1rem;
    }

    &__title {
      font-size: 1.25rem;
    }

    &__content {
      margin-block: 1.25rem;
      font-size: 0.95rem;
    }

    &__actions {
      flex-direction: column;

      > * {
        width: 100%;
        min-width: 100%;
      }
    }
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
