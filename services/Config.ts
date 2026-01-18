/**
 * =============================================================================
 * CONFIG.TS - Centralized Application Configuration
 * =============================================================================
 *
 * Centralized application settings and physics constants acting as a single
 * source of truth.
 *
 * All constants are Readonly to ensure immutability.
 */

// =============================================================================
// DEBUG FLAGS
// =============================================================================
export const DEBUG_FLAGS = {
  /** Enable verbose console logging for diagnosing simulation freezes */
  VERBOSE_LOGGING: false,
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================
export const FEATURE_FLAGS = {
} as const;

// =============================================================================
// FIGHTER COLORS
// =============================================================================
export const COLORS = {
  HUMAN: '#22c55e',       // Green (Tailwind green-500)
  CUSTOM_A: '#a855f7',    // Purple (Tailwind purple-500)
  CUSTOM_B: '#14b8a6',    // Teal (Tailwind teal-500)
} as const;

// =============================================================================
// WORLD / PHYSICS CONSTANTS
// =============================================================================
export const WORLD = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 450,
  GRAVITY: 0.8,
  FRICTION: 0.85,
  GROUND_Y: 415,
} as const;

// =============================================================================
// FIGHTER ENERGY MECHANICS
// =============================================================================
export const ENERGY = {
  MAX: 100,
  REGEN_IDLE: 0.5,
  REGEN_ACTIVE: 0.2,
  COST_MOVE: 0.1,
  COST_JUMP: 15,
  COST_CROUCH: 0.5,
  COST_BLOCK: 0.5,
  COST_PUNCH: 10,
  COST_KICK: 20,
  PENALTY_HIT: 1,
} as const;

// =============================================================================
// GAME DEFAULTS
// =============================================================================
export const GAME_DEFAULTS = {
  FPS: 60,
  MATCH_DURATION: 90, // seconds
} as const;
