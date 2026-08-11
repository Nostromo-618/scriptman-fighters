<template>
  <div>
    <ScriptEditor v-model="scriptEditorOpen" @save="handleScriptSave" />

    <VdCard elevated class="dashboard-card">
      <MatchConfiguration
        :settings="settings"
        :set-settings="setSettings"
        :game-state="gameState"
        :on-open-script-editor="() => (scriptEditorOpen = true)"
        :on-toggle-running="toggleRunning"
        :on-reset-match="props.onResetMatch"
        :is-running="settings.isRunning"
      />
    </VdCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VdCard } from "@vanduo-oss/vd3";
import ScriptEditor from "./ScriptEditor.vue";
import MatchConfiguration from "./MatchConfiguration.vue";
import type { GameSettings, GameState } from "@/types";
import { saveScript } from "@/services/CustomScriptRunner";

interface Props {
  settings: GameSettings;
  setSettings: (
    updater: GameSettings | ((prev: GameSettings) => GameSettings),
  ) => void;
  gameState: GameState;
  onResetMatch: () => void;
  onScriptRecompile?: () => void;
}

const props = defineProps<Props>();

const scriptEditorOpen = ref(false);

const handleScriptSave = (code: string) => {
  saveScript(code);
  props.onScriptRecompile?.();
};

const toggleRunning = () => {
  props.setSettings((s) => ({ ...s, isRunning: !s.isRunning }));
};
</script>

<style scoped>
.dashboard-card :deep(.vd-card-body) {
  padding: 1.25rem;
  min-width: 0;
}

.dashboard-card :deep(.vd-card) {
  min-width: 0;
  width: 100%;
}
</style>
