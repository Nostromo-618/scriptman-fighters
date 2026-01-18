/**
 * =============================================================================
 * TYPES.TS - Core Type Definitions
 * =============================================================================
 *
 * This file defines all TypeScript interfaces and enums used throughout the
 * Scriptman Fighters project. These types provide type safety and serve as
 * documentation for the data structures used in the game.
 *
 * The types are organized into categories:
 * 1. Fighter Actions - Possible states/actions a fighter can be in
 * 2. Game State - Current state of a match
 * 3. Settings - User-configurable game parameters
 * 4. Input - Player/Script control signals
 */

// =============================================================================
// FIGHTER ACTIONS
// =============================================================================

/**
 * FighterAction Enum
 *
 * Represents all possible states a fighter can be in during combat.
 * The numeric values (0-7) are important because they map to animation states.
 *
 * Custom scripts return arrays of action IDs to indicate which actions to perform.
 */
export enum FighterAction {
  IDLE = 0,        // Standing still, default state
  MOVE_LEFT = 1,   // Walking/running left
  MOVE_RIGHT = 2,  // Walking/running right
  JUMP = 3,        // Jumping (costs significant energy)
  CROUCH = 4,      // Ducking down
  PUNCH = 5,       // Quick attack, lower damage, faster
  KICK = 6,        // Strong attack, higher damage, slower
  BLOCK = 7        // Defensive stance, reduces incoming damage
}

// =============================================================================
// GAME STATE TYPES
// =============================================================================

/**
 * ArcadeStats Interface
 *
 * Tracks session performance across multiple matches.
 */
export interface ArcadeStats {
  matchesPlayed: number;  // Total matches played in current session
  p1Wins: number;         // Number of P1 (left fighter) wins
  p2Wins: number;         // Number of P2 (right fighter) wins
}

/**
 * GameState Interface
 *
 * Represents the current state of a match, displayed in the UI.
 * This is updated every frame and drives the HUD (health bars, timer, etc.)
 */
export interface GameState {
  player1Health: number;    // P1 health (0-100)
  player2Health: number;    // P2 health (0-100)
  player1Energy: number;    // P1 energy for actions (0-100)
  player2Energy: number;    // P2 energy for actions (0-100)
  timeRemaining: number;    // Seconds left in the match
  matchActive: boolean;     // Whether a match is currently in progress
  winner: 'Player 1' | 'Player 2' | null;  // Match result
  roundStatus: 'WAITING' | 'COUNTDOWN' | 'FIGHTING' | 'ROUND_END' | 'ENDED';
  arcadeStats: ArcadeStats; // Win/loss tracking
  countdownValue: number | null; // Countdown display: 3, 2, 1, 0 (FIGHT!), null (hidden)
}

// =============================================================================
// SETTINGS TYPES
// =============================================================================

/**
 * PlayerType - Who controls each fighter
 *
 * - 'HUMAN': Human player (keyboard/gamepad)
 * - 'CUSTOM_A': User-written custom Script A
 * - 'CUSTOM_B': User-written custom Script B
 */
export type PlayerType = 'HUMAN' | 'CUSTOM_A' | 'CUSTOM_B';

/**
 * GameSettings Interface
 *
 * User-configurable parameters that control gameplay.
 * These can be adjusted through the UI.
 */
export interface GameSettings {
  fps: number;                // Target frames per second (default: 60)
  simulationSpeed: number;    // Physics steps per frame (1 = normal, >1 = fast forward)
  player1Type: PlayerType;    // Who controls Player 1
  player2Type: PlayerType;    // Who controls Player 2
  isRunning: boolean;         // Is the game loop running?
}

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * InputState Interface
 *
 * Represents the control signals for a fighter at a given moment.
 * Can come from:
 * - Human player (keyboard/gamepad via InputManager)
 * - Custom script (returns object with these boolean flags)
 *
 * Note: Multiple inputs can be true simultaneously (e.g., moving + punching)
 */
export interface InputState {
  left: boolean;     // Move left (Arrow Left, A, or D-pad left)
  right: boolean;    // Move right (Arrow Right, D, or D-pad right)
  up: boolean;       // Jump (Arrow Up, W, Space, or A button)
  down: boolean;     // Crouch (Arrow Down, S, or D-pad down)
  action1: boolean;  // Punch (J, Space, X button)
  action2: boolean;  // Kick (K, B button)
  action3: boolean;  // Block (L, Shift, RB/RT)
}
