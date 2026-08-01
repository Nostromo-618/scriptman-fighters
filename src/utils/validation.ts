/**
 * =============================================================================
 * VALIDATION SCHEMAS - External Data Validation (STANDARD Rule 5)
 * =============================================================================
 *
 * Zod schemas for validating data from external sources (localStorage).
 * This ensures that corrupted or malicious data doesn't crash the application.
 *
 * =============================================================================
 */

import { z } from 'zod/v4';

// =============================================================================
// SETTINGS SCHEMAS
// =============================================================================

/**
 * Schema for game settings stored in localStorage
 */
export const GameSettingsSchema = z.object({
  fps: z.number().min(30).max(120),
  simulationSpeed: z.number().min(1).max(10),
  player1Type: z.enum(['HUMAN', 'CUSTOM_A', 'CUSTOM_B']),
  player2Type: z.enum(['CUSTOM_A', 'CUSTOM_B']),
  isRunning: z.boolean()
});

export type GameSettingsValidated = z.infer<typeof GameSettingsSchema>;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Safely parse and validate JSON data from localStorage.
 * Returns null if parsing or validation fails.
 *
 * @param key - localStorage key
 * @param schema - Zod schema to validate against
 * @returns Validated data or null
 */
export function safeLoadFromStorage<T>(
  key: string,
  schema: z.ZodType<T>
): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const result = schema.safeParse(parsed);

    if (result.success) {
      return result.data;
    }

    console.warn(`Validation failed for ${key}:`, result.error);
    return null;
  } catch (e) {
    console.warn(`Failed to load ${key} from storage:`, e);
    return null;
  }
}
