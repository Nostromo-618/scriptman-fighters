/**
 * Remaps vd3's hardcoded `vanduo-*` localStorage keys to `sfighters-*`
 * so theme prefs stay app-branded across vd3 upgrades that keep the same
 * internal key names. Also migrates legacy app keys once.
 */

const VD3_KEY_MAP: Record<string, string> = {
  "vanduo-palette": "sfighters-palette",
  "vanduo-primary-color": "sfighters-primary-color",
  "vanduo-neutral-color": "sfighters-neutral-color",
  "vanduo-radius": "sfighters-radius",
  "vanduo-font-preference": "sfighters-font-preference",
  "vanduo-theme-preference": "sfighters-theme-preference",
};

const APP_MIGRATIONS: [string, string][] = [
  ["scriptman_settings_v1", "sfighters-settings-v1"],
  ["scriptman_fighters_disclaimer_accepted", "sfighters-disclaimer-accepted"],
  ["scriptman_fighter_script_slot1", "sfighters-script-slot1"],
  ["scriptman_fighter_script_slot2", "sfighters-script-slot2"],
  ["kpc-theme", "sfighters-theme-preference"],
];

let installed = false;

function migrateKey(oldKey: string, newKey: string): void {
  try {
    const value = localStorage.getItem(oldKey);
    if (value === null) return;
    if (localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, value);
    }
    localStorage.removeItem(oldKey);
  } catch {
    // ignore quota / private mode
  }
}

function migrateLegacyKeys(): void {
  for (const [from, to] of Object.entries(VD3_KEY_MAP)) {
    migrateKey(from, to);
  }
  for (const [from, to] of APP_MIGRATIONS) {
    migrateKey(from, to);
  }
}

function remapKey(key: string): string {
  return VD3_KEY_MAP[key] ?? key;
}

/**
 * Install localStorage remapping + one-time migration.
 * Safe to call multiple times; only patches once.
 */
export function installStoragePrefix(): void {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  migrateLegacyKeys();

  const storage = window.localStorage;
  const originalGetItem = storage.getItem.bind(storage);
  const originalSetItem = storage.setItem.bind(storage);
  const originalRemoveItem = storage.removeItem.bind(storage);

  storage.getItem = (key: string) => originalGetItem(remapKey(key));
  storage.setItem = (key: string, value: string) =>
    originalSetItem(remapKey(key), value);
  storage.removeItem = (key: string) => originalRemoveItem(remapKey(key));
}
