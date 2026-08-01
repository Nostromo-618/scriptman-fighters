<template>
  <div class="arena-shell">
    <GameHUD
      :active-match="activeMatch"
      :game-state="gameState"
      :settings="settings"
    />

    <GameCanvas
      v-if="activeMatch"
      :player1="activeMatch.p1"
      :player2="activeMatch.p2"
    />
    <div v-else class="arena-placeholder">
      <span>Initializing Arena...</span>
    </div>

    <Transition name="countdown">
      <div
        v-if="gameState.countdownValue !== null"
        class="countdown-overlay"
      >
        <div
          class="countdown-text"
          :class="gameState.countdownValue === 0 ? 'countdown-text--fight' : ''"
        >
          {{ gameState.countdownValue === 0 ? "FIGHT!" : gameState.countdownValue }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import GameHUD from "./GameHUD.vue";
import GameCanvas from "./GameCanvas.vue";
import type { Fighter } from "@/services/GameEngine";
import type { GameState, GameSettings } from "@/types";

interface Props {
  activeMatch: { p1: Fighter; p2: Fighter } | null;
  gameState: GameState;
  settings: GameSettings;
}

defineProps<Props>();
</script>
