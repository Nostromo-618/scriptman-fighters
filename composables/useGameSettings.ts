import { ref, watch, type Ref } from 'vue';
import type { GameSettings } from '~/types';
import { saveSettings, loadSettings } from '~/services/PersistenceManager';

interface UseGameSettingsReturn {
  settings: Ref<GameSettings>;
  setSettings: (updater: GameSettings | ((prev: GameSettings) => GameSettings)) => void;
  settingsRef: Ref<GameSettings>;
}

// Default settings factory
const createDefaultSettings = (): GameSettings => ({
  fps: 60,
  simulationSpeed: 1,
  player1Type: 'HUMAN',      // Default to human player
  player2Type: 'CUSTOM_A',   // Default to Script A opponent
  isRunning: false
});

export const useGameSettings = (): UseGameSettingsReturn => {
  // Load persisted settings and merge with defaults (handles new fields gracefully)
  const defaults = createDefaultSettings();
  const persisted = loadSettings();
  const initialSettings: GameSettings = {
    ...defaults,
    ...(persisted || {}),
    // Always start paused on fresh load - user must explicitly start
    isRunning: false
  };

  const settings = ref<GameSettings>(initialSettings);
  const settingsRef = ref(settings.value);

  watch(settings, (newValue) => {
    settingsRef.value = newValue;
    // Auto-save settings to localStorage on any change
    saveSettings(newValue);
  }, { deep: true });

  const setSettings = (updater: GameSettings | ((prev: GameSettings) => GameSettings)) => {
    if (typeof updater === 'function') {
      settings.value = updater(settings.value);
    } else {
      settings.value = updater;
    }
  };

  return { settings, setSettings, settingsRef };
};
