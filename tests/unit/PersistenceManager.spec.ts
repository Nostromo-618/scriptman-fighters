import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearSettings,
  loadSettings,
  saveSettings,
} from "@/services/PersistenceManager";
import type { GameSettings } from "@/types";

const sampleSettings: GameSettings = {
  fps: 60,
  simulationSpeed: 1,
  player1Type: "HUMAN",
  player2Type: "CUSTOM_A",
  isRunning: false,
};

describe("PersistenceManager", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => store.clear(),
      key: () => null,
      length: 0,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("round-trips settings through localStorage", () => {
    saveSettings(sampleSettings);

    expect(loadSettings()).toEqual(sampleSettings);
  });

  it("returns null when nothing is stored", () => {
    expect(loadSettings()).toBeNull();
  });

  it("clears stored settings", () => {
    saveSettings(sampleSettings);
    clearSettings();

    expect(loadSettings()).toBeNull();
  });
});
