<template>
  <ClientOnly>
    <template #default>
      <div>
        <!-- Hide header when disclaimer is declined (Farewell screen) -->
        <AppHeader v-if="disclaimerStatus !== 'DECLINED'" />

        <GoodbyeScreen v-if="disclaimerStatus === 'DECLINED'" :on-return="handleReturnToDisclaimer" />

        <DisclaimerModal
          v-if="disclaimerStatus === 'PENDING'"
          :on-accept="handleAcceptDisclaimer"
          :on-decline="handleDeclineDisclaimer"
        />

        <div
          v-if="disclaimerStatus === 'ACCEPTED'"
          :class="[
            'min-h-screen font-sans flex flex-col items-center py-8',
            'bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white'
          ]"
        >
        <div class="w-full max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Game View -->
        <div class="lg:col-span-2 space-y-4">
          <GameArena
            :active-match="(activeMatchRef ?? null) as any"
            :game-state="gameState"
            :settings="settings"
          />

          <!-- Controls Helper -->
          <ControlsHelper />

          <!-- Mobile Touch Controls -->
          <TouchControls :input-manager="{ value: inputManager } as any" />
        </div>

        <!-- Right Column: Dashboard -->
        <div class="space-y-6">
          <Dashboard
            :settings="settings"
            :set-settings="setSettings"
            :game-state="gameState"
            :on-reset-match="resetMatch"
            :on-script-recompile="handleScriptRecompile"
          />
        </div>
      </div>
      </div>
    </div>
    </template>
    <template #fallback>
      <div class="min-h-screen font-sans flex items-center justify-center bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white">
        <div class="text-center">
          <div class="text-2xl font-bold mb-2">Loading...</div>
          <div class="text-gray-500 dark:text-slate-400 text-sm">Initializing game engine</div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, markRaw } from 'vue';
import { useGameSettings } from '~/composables/useGameSettings';
import { useGameState } from '~/composables/useGameState';
import { useCustomScriptWorkers } from '~/composables/useCustomScriptWorkers';
import { useGameLoop } from '~/composables/useGameLoop';
import { useDisclaimer } from '~/composables/useDisclaimer';
import { InputManager } from '~/services/InputManager';
import type { Fighter } from '~/services/GameEngine';

// Disable SSR for this page since it requires browser APIs
definePageMeta({
  ssr: false
});

const toast = useToast();

const addToast = (type: 'success' | 'error' | 'info', message: string, clearFirst = false) => {
  if (process.client) {
    if (clearFirst) {
      toast.clear();
    }
    toast.add({
      title: message,
      color: type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'
    });
  }
};

const { settings, setSettings, settingsRef } = useGameSettings();

const {
  gameState,
  setGameState,
  gameStateRef,
  matchTimerRef,
  resetMatchTimer
} = useGameState();

const {
  disclaimerStatus,
  handleAcceptDisclaimer,
  handleDeclineDisclaimer,
  handleReturnToDisclaimer
} = useDisclaimer();

const activeMatchRef = ref<{ p1: Fighter; p2: Fighter } | null>(null);
const inputManager = ref<InputManager | null>(null);

const { customScriptWorkerARef, customScriptWorkerBRef, recompileCustomScript } = useCustomScriptWorkers(settings, addToast);

// Recompile scripts when user saves
const handleScriptRecompile = async () => {
  await recompileCustomScript();
};

const { update, startMatch, requestRef, clearWaitingTimeout, clearMatchRestartTimeout, startCountdown, clearCountdownInterval } = useGameLoop({
  settingsRef,
  gameStateRef,
  setGameState,
  activeMatchRef,
  matchTimerRef,
  inputManager: inputManager as any,
  customScriptWorkerARef,
  customScriptWorkerBRef
});

const resetMatch = () => {
  // Clear any pending timeouts first
  clearMatchRestartTimeout();
  clearCountdownInterval();

  setSettings(prev => ({ ...prev, isRunning: false }));
  resetMatchTimer();

  // Reset state
  setGameState(prev => ({
    ...prev,
    matchActive: false,
    roundStatus: 'WAITING',
    arcadeStats: { matchesPlayed: 0, p1Wins: 0, p2Wins: 0 }
  }));

  // Spawn new fighters immediately
  activeMatchRef.value = null;
  startMatch();

  // Override back to WAITING so player selection remains enabled
  setGameState(prev => ({
    ...prev,
    matchActive: false,
    roundStatus: 'WAITING'
  }));
};

const prevPlayerTypesRef = ref<{ p1: string; p2: string } | null>(null);

// Setup watches only on client side
if (process.client) {
  watch(() => [settings.value.player1Type, settings.value.player2Type], ([currentP1, currentP2]) => {
    if (!gameStateRef) return;

    const prev = prevPlayerTypesRef.value;

    if (prev === null) {
      prevPlayerTypesRef.value = { p1: currentP1 as string, p2: currentP2 as string };
      return;
    }

    const playerTypesChanged = prev.p1 !== currentP1 || prev.p2 !== currentP2;
    if (playerTypesChanged && !settingsRef.value.isRunning && activeMatchRef.value !== null) {
      if (gameStateRef.value) {
        gameStateRef.value.roundStatus = 'WAITING';
      }

      startMatch();

      if (gameStateRef.value) {
        gameStateRef.value.matchActive = false;
        gameStateRef.value.roundStatus = 'WAITING';
      }
      setGameState(prev => ({
        ...prev,
        matchActive: false,
        player1Health: 100,
        player2Health: 100,
        player1Energy: 100,
        player2Energy: 100,
        timeRemaining: 90,
        winner: null,
        roundStatus: 'WAITING'
      }));
    }

    prevPlayerTypesRef.value = { p1: currentP1 as string, p2: currentP2 as string };
  });

  watch(() => settings.value.isRunning, (isRunning) => {
    if (!gameStateRef) return;

    if (!isRunning) {
      // Clear match restart timeout when pausing to prevent auto-restart
      clearMatchRestartTimeout();
    }

    if (isRunning && activeMatchRef.value && !gameState.value.matchActive) {
      if (gameStateRef.value) {
        gameStateRef.value.matchActive = true;
      }
      setGameState(prev => ({
        ...prev,
        matchActive: true
      }));
    }

    // Start countdown when isRunning becomes true and in WAITING status
    const isFirstMatch = gameState.value.arcadeStats.matchesPlayed === 0;
    if (isRunning && gameState.value.roundStatus === 'WAITING' && isFirstMatch) {
      startCountdown(false);  // First match uses normal speed
    }
  });
}

onMounted(() => {
  inputManager.value = markRaw(new InputManager());

  // Spawn the initial match fighters
  activeMatchRef.value = null;
  startMatch();

  if (requestRef.value === null) {
    requestRef.value = requestAnimationFrame(update);
  }
});

onUnmounted(() => {
  inputManager.value?.destroy();
});
</script>
