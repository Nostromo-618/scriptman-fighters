<template>
  <div id="app-root">
    <VdToastContainer />

    <AppHeader v-if="disclaimerStatus !== 'DECLINED'" />

    <GoodbyeScreen
      v-if="disclaimerStatus === 'DECLINED'"
      :on-return="handleReturnToDisclaimer"
    />

    <DisclaimerModal
      v-if="disclaimerStatus === 'PENDING'"
      :on-accept="handleAcceptDisclaimer"
      :on-decline="handleDeclineDisclaimer"
    />

    <main v-if="disclaimerStatus === 'ACCEPTED'" class="app-main">
      <div class="app-layout">
        <section class="app-arena-column">
          <GameArena
            :active-match="(activeMatchRef ?? null) as any"
            :game-state="gameState"
            :settings="settings"
          />
          <ControlsHelper />
          <TouchControls :input-manager="{ value: inputManager } as any" />
        </section>

        <aside class="app-dashboard-column" aria-label="Match dashboard">
          <Dashboard
            :settings="settings"
            :set-settings="setSettings"
            :game-state="gameState"
            :on-reset-match="resetMatch"
            :on-script-recompile="handleScriptRecompile"
          />
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, markRaw } from "vue";
import { VdToastContainer, useToast, useThemePreference } from "@vanduo-oss/vd3";
import AppHeader from "@/components/AppHeader.vue";
import GoodbyeScreen from "@/components/GoodbyeScreen.vue";
import DisclaimerModal from "@/components/DisclaimerModal.vue";
import GameArena from "@/components/GameArena.vue";
import ControlsHelper from "@/components/ControlsHelper.vue";
import TouchControls from "@/components/TouchControls.vue";
import Dashboard from "@/components/Dashboard.vue";
import { useGameSettings } from "@/composables/useGameSettings";
import { useGameState } from "@/composables/useGameState";
import { useCustomScriptWorkers } from "@/composables/useCustomScriptWorkers";
import { useGameLoop } from "@/composables/useGameLoop";
import { useDisclaimer } from "@/composables/useDisclaimer";
import { InputManager } from "@/services/InputManager";
import type { Fighter } from "@/services/GameEngine";

useThemePreference();

const toast = useToast();

const addToast = (
  type: "success" | "error" | "info",
  message: string,
  clearFirst = false,
) => {
  if (typeof window === "undefined") return;
  if (clearFirst) {
    toast.queue.splice(0, toast.queue.length);
  }
  if (type === "error") toast.error(message);
  else if (type === "success") toast.success(message);
  else toast.info(message);
};

const { settings, setSettings, settingsRef } = useGameSettings();

const {
  gameState,
  setGameState,
  gameStateRef,
  matchTimerRef,
  resetMatchTimer,
} = useGameState();

const {
  disclaimerStatus,
  handleAcceptDisclaimer,
  handleDeclineDisclaimer,
  handleReturnToDisclaimer,
} = useDisclaimer();

const activeMatchRef = ref<{ p1: Fighter; p2: Fighter } | null>(null);
const inputManager = ref<InputManager | null>(null);

const { customScriptWorkerARef, customScriptWorkerBRef, recompileCustomScript } =
  useCustomScriptWorkers(settings, addToast);

const handleScriptRecompile = async () => {
  await recompileCustomScript();
};

const {
  update,
  startMatch,
  requestRef,
  clearWaitingTimeout,
  clearMatchRestartTimeout,
  startCountdown,
  clearCountdownInterval,
} = useGameLoop({
  settingsRef,
  gameStateRef,
  setGameState,
  activeMatchRef,
  matchTimerRef,
  inputManager: inputManager as any,
  customScriptWorkerARef,
  customScriptWorkerBRef,
});

const resetMatch = () => {
  clearMatchRestartTimeout();
  clearCountdownInterval();

  setSettings((prev) => ({ ...prev, isRunning: false }));
  resetMatchTimer();

  setGameState((prev) => ({
    ...prev,
    matchActive: false,
    roundStatus: "WAITING",
    arcadeStats: { matchesPlayed: 0, p1Wins: 0, p2Wins: 0 },
  }));

  activeMatchRef.value = null;
  startMatch();

  setGameState((prev) => ({
    ...prev,
    matchActive: false,
    roundStatus: "WAITING",
  }));
};

const prevPlayerTypesRef = ref<{ p1: string; p2: string } | null>(null);

watch(
  () => [settings.value.player1Type, settings.value.player2Type],
  ([currentP1, currentP2]) => {
    if (!gameStateRef) return;

    const prev = prevPlayerTypesRef.value;

    if (prev === null) {
      prevPlayerTypesRef.value = {
        p1: currentP1 as string,
        p2: currentP2 as string,
      };
      return;
    }

    const playerTypesChanged = prev.p1 !== currentP1 || prev.p2 !== currentP2;
    if (
      playerTypesChanged &&
      !settingsRef.value.isRunning &&
      activeMatchRef.value !== null
    ) {
      if (gameStateRef.value) {
        gameStateRef.value.roundStatus = "WAITING";
      }

      startMatch();

      if (gameStateRef.value) {
        gameStateRef.value.matchActive = false;
        gameStateRef.value.roundStatus = "WAITING";
      }
      setGameState((prev) => ({
        ...prev,
        matchActive: false,
        player1Health: 100,
        player2Health: 100,
        player1Energy: 100,
        player2Energy: 100,
        timeRemaining: 90,
        winner: null,
        roundStatus: "WAITING",
      }));
    }

    prevPlayerTypesRef.value = {
      p1: currentP1 as string,
      p2: currentP2 as string,
    };
  },
);

watch(
  () => settings.value.isRunning,
  (isRunning) => {
    if (!gameStateRef) return;

    if (!isRunning) {
      clearMatchRestartTimeout();
    }

    if (isRunning && activeMatchRef.value && !gameState.value.matchActive) {
      if (gameStateRef.value) {
        gameStateRef.value.matchActive = true;
      }
      setGameState((prev) => ({
        ...prev,
        matchActive: true,
      }));
    }

    const isFirstMatch = gameState.value.arcadeStats.matchesPlayed === 0;
    if (isRunning && gameState.value.roundStatus === "WAITING" && isFirstMatch) {
      startCountdown(false);
    }
  },
);

onMounted(() => {
  inputManager.value = markRaw(new InputManager());

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
