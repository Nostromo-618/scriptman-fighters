/**
 * =============================================================================
 * USE MATCH SETUP - Match Initialization Composable
 * =============================================================================
 *
 * Handles setting up new matches (spawning fighters, initializing game state).
 * Supports Human players and Custom Script fighters.
 */

import { ref, type Ref } from 'vue';
import type { GameSettings, GameState } from '~/types';
import { Fighter } from '~/services/GameEngine';
import { MatchSetup, type ScriptWorkers } from '~/services/MatchSetup';
import type { ScriptWorkerManager } from '~/services/CustomScriptRunner';
import { debugLog, debugCritical, debugReset } from '~/utils/debug';

interface MatchSetupContext {
  settingsRef: Ref<GameSettings>;
  gameStateRef: Ref<GameState>;
  setGameState: (updater: GameState | ((prev: GameState) => GameState)) => void;
  activeMatchRef: Ref<{ p1: Fighter; p2: Fighter } | null>;
  matchTimerRef: Ref<number>;
  customScriptWorkerARef: Ref<ScriptWorkerManager | null>;
  customScriptWorkerBRef: Ref<ScriptWorkerManager | null>;
}

export function useMatchSetup(ctx: MatchSetupContext) {
  const waitingTimeoutRef = ref<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = ref<ReturnType<typeof setInterval> | null>(null);

  const clearWaitingTimeout = () => {
    if (waitingTimeoutRef.value) {
      clearTimeout(waitingTimeoutRef.value);
      waitingTimeoutRef.value = null;
    }
  };

  const clearCountdownInterval = () => {
    if (countdownIntervalRef.value) {
      clearInterval(countdownIntervalRef.value);
      countdownIntervalRef.value = null;
    }
  };

  const startMatch = () => {
    debugCritical('SETUP', `startMatch called - p1Type=${ctx.settingsRef.value.player1Type} p2Type=${ctx.settingsRef.value.player2Type}`);
    debugReset();  // Reset frame counters for new match

    clearWaitingTimeout();
    clearCountdownInterval();
    ctx.matchTimerRef.value = 90;

    const workers: ScriptWorkers = {
      workerA: ctx.customScriptWorkerARef.value,
      workerB: ctx.customScriptWorkerBRef.value
    };

    const spawnOffset = Math.random() * 60 - 30;

    const p1Type = ctx.settingsRef.value.player1Type;
    const p2Type = ctx.settingsRef.value.player2Type;

    const f1 = MatchSetup.createFighter(p1Type, 280 + spawnOffset, workers);
    const f2 = MatchSetup.createFighter(p2Type, 470 - spawnOffset, workers);
    f2.direction = -1;

    ctx.activeMatchRef.value = { p1: f1, p2: f2 };

    const shouldStartCountdown = ctx.settingsRef.value.isRunning;
    const isSubsequentRound = ctx.gameStateRef.value.arcadeStats.matchesPlayed > 0;

    ctx.setGameState(prev => ({
      ...prev,
      matchActive: true,
      timeRemaining: 90,
      winner: null,
      roundStatus: 'WAITING',
      countdownValue: null
    }));

    // If already running, start countdown immediately
    if (shouldStartCountdown) {
      startCountdown(isSubsequentRound);
    }
  };

  /**
   * Start the countdown sequence before a match.
   * Called when isRunning becomes true and match is in WAITING status.
   * @param fast - If true, uses 3x faster timing (for subsequent rounds)
   */
  const startCountdown = (fast: boolean = false) => {
    debugLog('COUNTDOWN', `startCountdown called - fast=${fast}`);

    clearCountdownInterval();
    let count = 3;

    // First round: 700ms per step (~2.8s total)
    // Subsequent rounds: 233ms per step (~0.9s total) - keeps user in flow
    const interval = fast ? 233 : 700;
    debugLog('COUNTDOWN', `Starting countdown with interval=${interval}ms`);

    ctx.setGameState(prev => ({
      ...prev,
      roundStatus: 'COUNTDOWN',
      countdownValue: 3
    }));

    countdownIntervalRef.value = setInterval(() => {
      count--;
      debugLog('COUNTDOWN', `Tick: count=${count}`);

      if (count > 0) {
        ctx.setGameState(prev => ({ ...prev, countdownValue: count }));
      } else if (count === 0) {
        ctx.setGameState(prev => ({ ...prev, countdownValue: 0 }));
      } else {
        debugCritical('COUNTDOWN', 'Countdown complete - starting FIGHTING');
        clearCountdownInterval();
        ctx.setGameState(prev => ({
          ...prev,
          roundStatus: 'FIGHTING',
          countdownValue: null
        }));
      }
    }, interval);
  };

  return { startMatch, clearWaitingTimeout, startCountdown, clearCountdownInterval };
}
