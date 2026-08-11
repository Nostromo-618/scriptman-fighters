<template>
  <div class="touch-controls" aria-label="Touch controls">
    <div class="touch-controls-inner">
      <div class="touch-dpad">
        <button
          class="touch-dpad-btn touch-dpad-btn--up"
          aria-label="Move up"
          @touchstart.prevent="handlePress('up', true)"
          @touchend.prevent="handlePress('up', false)"
          @touchcancel.prevent="handlePress('up', false)"
          @mousedown.prevent="handlePress('up', true)"
          @mouseup.prevent="handlePress('up', false)"
          @mouseleave="handlePress('up', false)"
          @contextmenu.prevent
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

        <button
          class="touch-dpad-btn touch-dpad-btn--down"
          aria-label="Move down"
          @touchstart.prevent="handlePress('down', true)"
          @touchend.prevent="handlePress('down', false)"
          @touchcancel.prevent="handlePress('down', false)"
          @mousedown.prevent="handlePress('down', true)"
          @mouseup.prevent="handlePress('down', false)"
          @mouseleave="handlePress('down', false)"
          @contextmenu.prevent
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        <button
          class="touch-dpad-btn touch-dpad-btn--left"
          aria-label="Move left"
          @touchstart.prevent="handlePress('left', true)"
          @touchend.prevent="handlePress('left', false)"
          @touchcancel.prevent="handlePress('left', false)"
          @mousedown.prevent="handlePress('left', true)"
          @mouseup.prevent="handlePress('left', false)"
          @mouseleave="handlePress('left', false)"
          @contextmenu.prevent
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <button
          class="touch-dpad-btn touch-dpad-btn--right"
          aria-label="Move right"
          @touchstart.prevent="handlePress('right', true)"
          @touchend.prevent="handlePress('right', false)"
          @touchcancel.prevent="handlePress('right', false)"
          @mousedown.prevent="handlePress('right', true)"
          @mouseup.prevent="handlePress('right', false)"
          @mouseleave="handlePress('right', false)"
          @contextmenu.prevent
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <div class="touch-dpad-center" aria-hidden="true" />
      </div>

      <div class="touch-actions">
        <button
          class="touch-action-btn touch-action-btn--punch"
          aria-label="Punch"
          @touchstart.prevent="handlePress('action1', true)"
          @touchend.prevent="handlePress('action1', false)"
          @touchcancel.prevent="handlePress('action1', false)"
          @mousedown.prevent="handlePress('action1', true)"
          @mouseup.prevent="handlePress('action1', false)"
          @mouseleave="handlePress('action1', false)"
          @contextmenu.prevent
        >
          P
        </button>

        <button
          class="touch-action-btn touch-action-btn--kick"
          aria-label="Kick"
          @touchstart.prevent="handlePress('action2', true)"
          @touchend.prevent="handlePress('action2', false)"
          @touchcancel.prevent="handlePress('action2', false)"
          @mousedown.prevent="handlePress('action2', true)"
          @mouseup.prevent="handlePress('action2', false)"
          @mouseleave="handlePress('action2', false)"
          @contextmenu.prevent
        >
          K
        </button>

        <button
          class="touch-action-btn touch-action-btn--block"
          aria-label="Block"
          @touchstart.prevent="handlePress('action3', true)"
          @touchend.prevent="handlePress('action3', false)"
          @touchcancel.prevent="handlePress('action3', false)"
          @mousedown.prevent="handlePress('action3', true)"
          @mouseup.prevent="handlePress('action3', false)"
          @mouseleave="handlePress('action3', false)"
          @contextmenu.prevent
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InputManager } from "@/services/InputManager";

interface Props {
  inputManager: { value: InputManager | null };
}

const props = defineProps<Props>();

const handlePress = (action: string, pressed: boolean) => {
  if (props.inputManager.value) {
    props.inputManager.value.setTouchState({ [action]: pressed });
  }
};
</script>
