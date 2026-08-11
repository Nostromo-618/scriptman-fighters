/** App-owned localStorage keys (sfighters- prefix). */
export const STORAGE = {
  SETTINGS: "sfighters-settings-v1",
  DISCLAIMER: "sfighters-disclaimer-accepted",
  SCRIPT_PREFIX: "sfighters-script-",
} as const;

/** Export JSON type for script files. */
export const SCRIPT_EXPORT_TYPE = "sfighters-script" as const;

/** Legacy export type still accepted on import. */
export const SCRIPT_EXPORT_TYPE_LEGACY = "scriptman-fighter-script" as const;
