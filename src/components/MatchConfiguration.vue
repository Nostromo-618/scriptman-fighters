<template>
  <div class="match-config">
    <div class="match-actions">
      <VdButton
        :variant="isRunning ? 'warning' : 'success'"
        @click="onToggleRunning"
      >
        <i
          :class="isRunning ? 'ph-duotone ph-pause' : 'ph-duotone ph-play'"
          aria-hidden="true"
        ></i>
        {{ startButtonText }}
      </VdButton>
      <VdButton variant="secondary" @click="onResetMatch">
        RESET MATCH
      </VdButton>
    </div>

    <div class="player-selectors">
      <div class="player-column">
        <h2 class="player-heading player-heading--p1">
          <span>Player 1 (Left)</span>
          <span
            v-if="settings.player1Type !== 'HUMAN'"
            class="player-badge player-badge--auto-p1"
          >AUTO</span>
        </h2>
        <div
          :class="[
            'player-buttons',
            !canChangeSettings ? 'player-buttons--disabled' : '',
          ]"
        >
          <VdButton
            v-for="type in playerTypes"
            :key="type"
            size="sm"
            :variant="settings.player1Type === type ? 'success' : 'secondary'"
            :disabled="!canChangeSettings"
            @click="canChangeSettings && setPlayer1Type(type)"
          >
            {{ getPlayerTypeLabel(type) }}
          </VdButton>
        </div>
      </div>

      <div class="player-column">
        <h2 class="player-heading player-heading--p2">
          <span>Player 2 (Right)</span>
          <span class="player-badge player-badge--auto-p2">AUTO</span>
        </h2>
        <div
          :class="[
            'player-buttons',
            !canChangeSettings ? 'player-buttons--disabled' : '',
          ]"
        >
          <VdButton
            v-for="type in player2Types"
            :key="type"
            size="sm"
            :variant="settings.player2Type === type ? 'success' : 'secondary'"
            :disabled="!canChangeSettings"
            @click="canChangeSettings && setPlayer2Type(type)"
          >
            {{ getPlayerTypeLabel(type) }}
          </VdButton>
        </div>
      </div>
    </div>

    <VdButton variant="info" class="script-editor-open-btn" @click="onOpenScriptEditor">
      <i class="ph-duotone ph-pencil-simple-line" aria-hidden="true"></i>
      Open Script Editor
    </VdButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VdButton } from "@vanduo-oss/vd3";
import type { GameSettings, GameState, PlayerType } from "@/types";

interface Props {
  settings: GameSettings;
  setSettings: (
    updater: GameSettings | ((prev: GameSettings) => GameSettings),
  ) => void;
  gameState: GameState;
  onOpenScriptEditor: () => void;
  onToggleRunning: () => void;
  onResetMatch: () => void;
  isRunning: boolean;
}

const props = defineProps<Props>();

const canChangeSettings = computed(
  () =>
    props.gameState.arcadeStats.matchesPlayed === 0 &&
    !props.isRunning &&
    props.gameState.roundStatus === "WAITING",
);

const startButtonText = computed(() => {
  if (props.isRunning) return "PAUSE";
  if (props.gameState.roundStatus === "WAITING") return "START MATCH";
  return "RESUME";
});

const playerTypes: PlayerType[] = ["HUMAN", "CUSTOM_A", "CUSTOM_B"];
const player2Types: PlayerType[] = ["CUSTOM_A", "CUSTOM_B"];

const setPlayer1Type = (type: PlayerType) => {
  props.setSettings((s) => ({
    ...s,
    player1Type: type,
    ...(type === "HUMAN" && { simulationSpeed: 1 }),
  }));
};

const setPlayer2Type = (type: PlayerType) => {
  props.setSettings((s) => ({
    ...s,
    player2Type: type,
  }));
};

const getPlayerTypeLabel = (type: PlayerType): string => {
  switch (type) {
    case "HUMAN":
      return "HUMAN";
    case "CUSTOM_A":
      return "SCRIPT A";
    case "CUSTOM_B":
      return "SCRIPT B";
    default:
      return type;
  }
};
</script>

<style scoped>
.match-actions :deep(.vd-btn),
.script-editor-open-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.script-editor-open-btn {
  width: 100%;
}

.player-buttons :deep(.vd-btn) {
  font-size: 0.625rem;
  font-weight: 700;
}
</style>
