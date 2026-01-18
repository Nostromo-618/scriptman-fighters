<template>
  <div class="relative group">
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
    <div
      v-else
      class="w-full h-[450px] flex items-center justify-center bg-gray-100 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700"
    >
      <span class="text-gray-500 dark:text-slate-400 font-mono">Initializing Arena...</span>
    </div>

    <!-- Countdown Overlay (3, 2, 1, FIGHT!) -->
    <Transition name="countdown">
      <div
        v-if="gameState.countdownValue !== null"
        class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      >
        <div
          class="text-9xl font-black tracking-tight drop-shadow-2xl"
          :class="gameState.countdownValue === 0 ? 'text-orange-500' : 'text-white'"
        >
          {{ gameState.countdownValue === 0 ? 'FIGHT!' : gameState.countdownValue }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Fighter } from '~/services/GameEngine';
import type { GameState, GameSettings } from '~/types';

interface Props {
  activeMatch: { p1: Fighter; p2: Fighter } | null;
  gameState: GameState;
  settings: GameSettings;
}

defineProps<Props>();
</script>
