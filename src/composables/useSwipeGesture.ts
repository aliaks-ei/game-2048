import { ref } from "vue";
import type { Ref } from "vue";

interface SwipeCoordinates {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type SwipeDirection = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

export interface SwipeGestureOptions {
  /**
   * Minimum distance in pixels to register as a swipe (default: 30px)
   */
  minSwipeDistance?: number;
  /**
   * Maximum time in ms for a swipe gesture (default: 300ms)
   */
  maxSwipeTime?: number;
}

export function useSwipeGesture(
  targetElement: Ref<HTMLElement | null>,
  onSwipe: (direction: SwipeDirection) => void,
  options: SwipeGestureOptions = {},
) {
  const { minSwipeDistance = 30, maxSwipeTime = 300 } = options;

  const swipeCoords = ref<SwipeCoordinates>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const startTime = ref<number>(0);
  const isSwiping = ref<boolean>(false);

  function handleTouchStart(event: TouchEvent) {
    // Prevent default to avoid scrolling while playing
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      swipeCoords.value.startX = touch.clientX;
      swipeCoords.value.startY = touch.clientY;
      startTime.value = Date.now();
      isSwiping.value = true;
    }
  }

  function handleTouchMove(event: TouchEvent) {
    // Prevent scrolling while swiping on the game board
    if (isSwiping.value && event.touches.length === 1) {
      event.preventDefault();
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!isSwiping.value || event.changedTouches.length !== 1) {
      isSwiping.value = false;
      return;
    }

    const touch = event.changedTouches[0];
    swipeCoords.value.endX = touch.clientX;
    swipeCoords.value.endY = touch.clientY;

    const swipeTime = Date.now() - startTime.value;
    isSwiping.value = false;

    // Only process if swipe was quick enough
    if (swipeTime > maxSwipeTime) {
      return;
    }

    const deltaX = swipeCoords.value.endX - swipeCoords.value.startX;
    const deltaY = swipeCoords.value.endY - swipeCoords.value.startY;

    // Determine if this is a horizontal or vertical swipe
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if swipe distance meets minimum threshold
    if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
      return;
    }

    // Determine swipe direction based on dominant axis
    let direction: SwipeDirection;

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      direction = deltaX > 0 ? "ArrowRight" : "ArrowLeft";
    } else {
      // Vertical swipe
      direction = deltaY > 0 ? "ArrowDown" : "ArrowUp";
    }

    onSwipe(direction);
  }

  function enableSwipeGesture() {
    if (!targetElement.value) return;

    targetElement.value.addEventListener("touchstart", handleTouchStart, { passive: true });
    targetElement.value.addEventListener("touchmove", handleTouchMove, { passive: false });
    targetElement.value.addEventListener("touchend", handleTouchEnd, { passive: true });
  }

  function disableSwipeGesture() {
    if (!targetElement.value) return;

    targetElement.value.removeEventListener("touchstart", handleTouchStart);
    targetElement.value.removeEventListener("touchmove", handleTouchMove);
    targetElement.value.removeEventListener("touchend", handleTouchEnd);
  }

  return {
    enableSwipeGesture,
    disableSwipeGesture,
  };
}
