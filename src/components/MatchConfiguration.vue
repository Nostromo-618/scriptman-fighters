<template>
  <div class="match-config">
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

      <div class="match-fab-column" aria-label="Match controls">
        <VdFab
          :variant="isRunning ? 'secondary' : 'success'"
          size="sm"
          :aria-label="startAriaLabel"
          class="match-fab match-fab--start"
          @click="onToggleRunning"
        >
          <VdIcon :name="isRunning ? 'pause' : 'play'" size="sm" />
        </VdFab>

        <VdFab
          variant="danger"
          size="sm"
          aria-label="Reset match"
          class="match-fab match-fab--reset"
          @click="onResetMatch"
        >
          <VdIcon name="arrow-counter-clockwise" size="sm" />
        </VdFab>
      </div>
    </div>

    <VdButton variant="info" class="script-editor-open-btn" @click="onOpenScriptEditor">
      <VdIcon name="pencil-simple-line" />
      Open Script Editor
    </VdButton>

    <p class="match-attrib">
      <a
        href="https://vd3.vanduo.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >UI by vd3</a>
      <span class="match-attrib-sep" aria-hidden="true">·</span>
      <a
        href="https://vd3.vanduo.dev/cbun"
        target="_blank"
        rel="noopener noreferrer"
      >Code Editor by vd3-cbun</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VdButton, VdFab, VdIcon } from "@vanduo-oss/vd3";
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

const startAriaLabel = computed(() => {
  if (props.isRunning) return "Pause match";
  if (props.gameState.roundStatus === "WAITING") return "Start match";
  return "Resume match";
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
.script-editor-open-btn,
.player-buttons :deep(.vd-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
}

.script-editor-open-btn {
  width: 100%;
}

.player-buttons :deep(.vd-btn) {
  font-size: 0.625rem;
  font-weight: 700;
  width: 100%;
}
</style>
