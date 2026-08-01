/**
 * =============================================================================
 * PERSISTENCE MANAGER
 * =============================================================================
 *
 * Handles saving and loading of application state to localStorage.
 * Ensures user preferences are preserved across sessions.
 */

import type { GameSettings } from '../types';

const KEYS = {
  SETTINGS: 'scriptman_settings_v1',
};

// --- SETTINGS PERSISTENCE ---

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
};

export const loadSettings = (): Partial<GameSettings> | null => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Failed to load settings:', e);
    return null;
  }
};

// --- CLEAR STORAGE ---

/**
 * Clears all game settings from localStorage.
 * Does NOT clear custom scripts or disclaimer acceptance.
 */
export const clearSettings = (): void => {
  try {
    localStorage.removeItem(KEYS.SETTINGS);
  } catch (e) {
    console.warn('Failed to clear settings:', e);
  }
};
