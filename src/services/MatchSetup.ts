/**
 * =============================================================================
 * MATCH SETUP - Fighter Creation Factory
 * =============================================================================
 *
 * Creates fighters based on player type configuration.
 * Handles Human players and Custom Script fighters.
 */

import { Fighter } from './GameEngine';
import { ScriptWorkerManager } from './CustomScriptRunner';
import type { PlayerType } from '../types';
import { COLORS } from './Config';

export interface ScriptWorkers {
  workerA: ScriptWorkerManager | null;
  workerB: ScriptWorkerManager | null;
}

export class MatchSetup {
  /**
   * Creates a fighter based on player type
   *
   * @param type - Player type (HUMAN, CUSTOM_A, CUSTOM_B)
   * @param x - Starting X position
   * @param workers - Script worker references for custom scripts
   * @returns Configured Fighter instance
   */
  static createFighter(
    type: PlayerType,
    x: number,
    workers: ScriptWorkers
  ): Fighter {
    // HUMAN player
    if (type === 'HUMAN') {
      return new Fighter(x, COLORS.HUMAN, false);
    }

    // CUSTOM SCRIPT A
    if (type === 'CUSTOM_A') {
      const f = new Fighter(x, COLORS.CUSTOM_A, true);
      if (workers.workerA) {
        f.scriptWorker = workers.workerA;
      }
      return f;
    }

    // CUSTOM SCRIPT B
    if (type === 'CUSTOM_B') {
      const f = new Fighter(x, COLORS.CUSTOM_B, true);
      if (workers.workerB) {
        f.scriptWorker = workers.workerB;
      }
      return f;
    }

    // Fallback (should never happen with TypeScript)
    return new Fighter(x, COLORS.HUMAN, false);
  }
}
