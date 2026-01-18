<template>
  <div class="space-y-4">
    <!-- ACTION BUTTONS (Start/Reset) -->
    <div class="grid grid-cols-2 gap-2">
      <UButton
        :color="isRunning ? 'warning' : 'success'"
        @click="onToggleRunning"
        class="flex items-center justify-center gap-2"
      >
        <UIcon :name="isRunning ? 'i-heroicons-pause' : 'i-heroicons-play'" class="w-4 h-4" />
        {{ startButtonText }}
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        @click="onResetMatch"
      >
        RESET MATCH
      </UButton>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Player 1 Selector -->
      <div class="space-y-1">
        <h2 class="text-[10px] font-bold text-red-400 uppercase tracking-widest flex justify-between">
          <span>Player 1 (Left)</span>
          <span v-if="settings.player1Type !== 'HUMAN'" class="text-[8px] bg-red-900/50 px-1 rounded text-red-200">AUTO</span>
        </h2>
        <div :class="['flex flex-col gap-1 p-1 rounded-lg', !canChangeSettings ? 'bg-gray-100 dark:bg-slate-900/50 opacity-50' : 'bg-gray-100 dark:bg-slate-900']">
          <UButton
            v-for="type in playerTypes"
            :key="type"
            :color="settings.player1Type === type ? 'success' : 'neutral'"
            :variant="settings.player1Type === type ? 'solid' : 'outline'"
            size="xs"
            :disabled="!canChangeSettings"
            @click="canChangeSettings && setPlayer1Type(type)"
            class="text-[10px] font-bold"
          >
            {{ getPlayerTypeLabel(type) }}
          </UButton>
        </div>
      </div>

      <!-- Player 2 Selector -->
      <div class="space-y-1">
        <h2 class="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex justify-between">
          <span>Player 2 (Right)</span>
          <span class="text-[8px] bg-blue-900/50 px-1 rounded text-blue-200">AUTO</span>
        </h2>
        <div :class="['flex flex-col gap-1 p-1 rounded-lg', !canChangeSettings ? 'bg-gray-100 dark:bg-slate-900/50 opacity-50' : 'bg-gray-100 dark:bg-slate-900']">
          <UButton
            v-for="type in player2Types"
            :key="type"
            :color="settings.player2Type === type ? 'success' : 'neutral'"
            :variant="settings.player2Type === type ? 'solid' : 'outline'"
            size="xs"
            :disabled="!canChangeSettings"
            @click="canChangeSettings && setPlayer2Type(type)"
            class="text-[10px] font-bold"
          >
            {{ getPlayerTypeLabel(type) }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Edit Script Button -->
    <UButton
      @click="onOpenScriptEditor"
      color="secondary"
      variant="solid"
      class="w-full"
      size="sm"
    >
      <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
      Open Script Editor
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameSettings, GameState, PlayerType } from '~/types';

interface Props {
  settings: GameSettings;
  setSettings: (updater: GameSettings | ((prev: GameSettings) => GameSettings)) => void;
  gameState: GameState;
  onOpenScriptEditor: () => void;
  onToggleRunning: () => void;
  onResetMatch: () => void;
  isRunning: boolean;
}

const props = defineProps<Props>();

/**
 * Stability Rule 5: Explicit state guards
 * Allow opponent changes ONLY in pristine state (fresh load or after reset).
 *
 * Pristine state checked by THREE conditions (ALL must be true):
 * 1. matchesPlayed === 0 (no completed matches yet)
 * 2. !isRunning (not currently playing)
 * 3. roundStatus === 'WAITING' (in initial/reset state, not mid-match)
 */
const canChangeSettings = computed(() => {
  return (
    props.gameState.arcadeStats.matchesPlayed === 0 &&
    !props.isRunning &&
    props.gameState.roundStatus === 'WAITING'
  );
});

// Button text: START (never started) -> PAUSE (running) -> RESUME (paused after start)
const startButtonText = computed(() => {
  if (props.isRunning) return 'PAUSE';
  if (props.gameState.roundStatus === 'WAITING') return 'START MATCH';
  return 'RESUME';
});

// Player 1 can be Human or Script
const playerTypes: PlayerType[] = ['HUMAN', 'CUSTOM_A', 'CUSTOM_B'];
// Player 2 is always Script (no human - single player game)
const player2Types: PlayerType[] = ['CUSTOM_A', 'CUSTOM_B'];

const setPlayer1Type = (type: PlayerType) => {
  props.setSettings(s => ({
    ...s,
    player1Type: type,
    // Reset simulation speed to 1 when Human is selected
    ...(type === 'HUMAN' && { simulationSpeed: 1 })
  }));
};

const setPlayer2Type = (type: PlayerType) => {
  props.setSettings(s => ({
    ...s,
    player2Type: type
  }));
};

/** Get human-readable label for player type */
const getPlayerTypeLabel = (type: PlayerType): string => {
  switch (type) {
    case 'HUMAN': return 'HUMAN';
    case 'CUSTOM_A': return 'SCRIPT A';
    case 'CUSTOM_B': return 'SCRIPT B';
    default: return type;
  }
};
</script>
