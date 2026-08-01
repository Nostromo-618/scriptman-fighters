<template>
  <div v-if="activeMatch" class="game-hud">
    <div class="hud-side hud-side--left">
      <span :class="['hud-label', leftInfo.color]">{{ leftInfo.label }}</span>
      <div class="hud-bar">
        <div
          :class="['hud-bar-fill', leftInfo.bar]"
          :style="{ width: `${gameState.player1Health}%` }"
        />
      </div>
      <div class="hud-bar hud-bar--energy">
        <div
          class="hud-energy-fill"
          :style="{ width: `${gameState.player1Energy}%` }"
        />
      </div>
      <div class="hud-stats">
        <span class="hud-stat-win">{{ gameState.arcadeStats.p1Wins }}W</span>
        <span class="hud-stat-loss">{{ gameState.arcadeStats.p2Wins }}L</span>
      </div>
    </div>

    <div class="hud-center">
      <span class="hud-arcade">ARCADE</span>
      <span class="hud-timer">{{ gameState.timeRemaining.toFixed(0) }}</span>
    </div>

    <div class="hud-side hud-side--right">
      <span :class="['hud-label', rightInfo.color]">{{ rightInfo.label }}</span>
      <div class="hud-bar">
        <div
          :class="['hud-bar-fill', rightInfo.bar]"
          :style="{ width: `${gameState.player2Health}%` }"
        />
      </div>
      <div class="hud-bar hud-bar--energy">
        <div
          class="hud-energy-fill"
          :style="{ width: `${gameState.player2Energy}%` }"
        />
      </div>
      <div class="hud-stats">
        <span class="hud-stat-win">{{ gameState.arcadeStats.p2Wins }}W</span>
        <span class="hud-stat-loss">{{ gameState.arcadeStats.p1Wins }}L</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Fighter } from "@/services/GameEngine";
import type { GameState, GameSettings } from "@/types";

interface Props {
  activeMatch: { p1: Fighter; p2: Fighter } | null;
  gameState: GameState;
  settings: GameSettings;
}

const props = defineProps<Props>();

function getFighterInfo(f: Fighter): {
  label: string;
  color: string;
  bar: string;
} {
  if (f.isCustom) {
    if (f.color === "#a855f7")
      return {
        label: "SCRIPT A",
        color: "text-purple-400",
        bar: "bg-purple-400",
      };
    if (f.color === "#14b8a6")
      return { label: "SCRIPT B", color: "text-teal-400", bar: "bg-teal-400" };
    return {
      label: "CUSTOM",
      color: "text-purple-400",
      bar: "bg-purple-400",
    };
  }
  return { label: "HUMAN", color: "text-green-500", bar: "bg-green-500" };
}

const leftInfo = computed(() => {
  if (!props.activeMatch) return { label: "", color: "", bar: "" };
  return getFighterInfo(props.activeMatch.p1);
});

const rightInfo = computed(() => {
  if (!props.activeMatch) return { label: "", color: "", bar: "" };
  return getFighterInfo(props.activeMatch.p2);
});
</script>

<style scoped>
.text-purple-400 { color: #c084fc; }
.text-teal-400 { color: #2dd4bf; }
.text-green-500 { color: #22c55e; }
.bg-purple-400 { background: #c084fc; }
.bg-teal-400 { background: #2dd4bf; }
.bg-green-500 { background: #22c55e; }
</style>
