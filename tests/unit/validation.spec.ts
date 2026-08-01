import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GameSettingsSchema,
  safeLoadFromStorage,
} from "@/utils/validation";

describe("GameSettingsSchema", () => {
  it("accepts valid settings", () => {
    const result = GameSettingsSchema.safeParse({
      fps: 60,
      simulationSpeed: 1,
      player1Type: "HUMAN",
      player2Type: "CUSTOM_A",
      isRunning: false,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid fps", () => {
    const result = GameSettingsSchema.safeParse({
      fps: 10,
      simulationSpeed: 1,
      player1Type: "HUMAN",
      player2Type: "CUSTOM_A",
      isRunning: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid player types", () => {
    const result = GameSettingsSchema.safeParse({
      fps: 60,
      simulationSpeed: 1,
      player1Type: "BOT",
      player2Type: "CUSTOM_A",
      isRunning: false,
    });

    expect(result.success).toBe(false);
  });
});

describe("safeLoadFromStorage", () => {
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

  it("returns validated data when storage is valid", () => {
    store.set(
      "scriptman_settings_v1",
      JSON.stringify({
        fps: 60,
        simulationSpeed: 1,
        player1Type: "HUMAN",
        player2Type: "CUSTOM_B",
        isRunning: true,
      }),
    );

    const loaded = safeLoadFromStorage("scriptman_settings_v1", GameSettingsSchema);

    expect(loaded).toEqual({
      fps: 60,
      simulationSpeed: 1,
      player1Type: "HUMAN",
      player2Type: "CUSTOM_B",
      isRunning: true,
    });
  });

  it("returns null for corrupt JSON", () => {
    store.set("scriptman_settings_v1", "{not-json");

    const loaded = safeLoadFromStorage("scriptman_settings_v1", GameSettingsSchema);

    expect(loaded).toBeNull();
  });

  it("returns null when schema validation fails", () => {
    store.set(
      "scriptman_settings_v1",
      JSON.stringify({ fps: 999, player1Type: "HUMAN" }),
    );

    const loaded = safeLoadFromStorage("scriptman_settings_v1", GameSettingsSchema);

    expect(loaded).toBeNull();
  });
});
