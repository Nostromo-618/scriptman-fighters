/**
 * =============================================================================
 * USE MATCH UPDATE - Game Loop Update Composable
 * =============================================================================
 *
 * Handles the main game loop: physics, collision, match progression.
 */

import { ref, type Ref } from 'vue';
import type { GameSettings, GameState } from '~/types';
import { Fighter } from '~/services/GameEngine';
import type { InputManager } from '~/services/InputManager';
import { debugFrame, debugCritical, debugLog } from '~/utils/debug';

interface MatchUpdateContext {
  settingsRef: Ref<GameSettings>;
  gameStateRef: Ref<GameState>;
  setGameState: (updater: GameState | ((prev: GameState) => GameState)) => void;
  activeMatchRef: Ref<{ p1: Fighter; p2: Fighter } | null>;
  matchTimerRef: Ref<number>;
  inputManager: Ref<InputManager | null>;
  startMatch: () => void;
}

export function useMatchUpdate(ctx: MatchUpdateContext) {
  const requestRef = ref<number | null>(null);
  const matchRestartTimeoutRef = ref<ReturnType<typeof setTimeout> | null>(null);

  const clearMatchRestartTimeout = () => {
    if (matchRestartTimeoutRef.value) {
      clearTimeout(matchRestartTimeoutRef.value);
      matchRestartTimeoutRef.value = null;
    }
  };

  const update = () => {
    debugFrame('LOOP', `running=${ctx.settingsRef.value.isRunning}`);

    const currentSettings = ctx.settingsRef.value;
    const currentGameState = ctx.gameStateRef.value;

    // Start match if no active match exists
    if (!ctx.activeMatchRef.value) {
      debugLog('LOOP', 'No active match - attempting to start');
      debugCritical('MATCH', 'Starting new match');
      ctx.startMatch();
      requestRef.value = requestAnimationFrame(update);
      return;
    }

    if (!currentSettings.isRunning || !ctx.activeMatchRef.value) {
      debugLog('LOOP', `Paused - isRunning=${currentSettings.isRunning} hasMatch=${!!ctx.activeMatchRef.value}`);
      requestRef.value = requestAnimationFrame(update);
      return;
    }

    // Freeze BOTH players during countdown - ensures fair simultaneous start
    if (currentGameState.roundStatus === 'COUNTDOWN') {
      debugLog('LOOP', `Countdown - value=${currentGameState.countdownValue}`);
      requestRef.value = requestAnimationFrame(update);
      return;
    }

    const match = ctx.activeMatchRef.value;
    const loops = currentSettings.simulationSpeed;
    let matchEnded = false;

    const dummyInput = { left: false, right: false, up: false, down: false, action1: false, action2: false, action3: false };
    const isP1Human = !match.p1.isCustom;

    for (let i = 0; i < loops; i++) {
      if (!currentGameState.matchActive || matchEnded) break;

      // Get human input (only for human players)
      let p1Input = (isP1Human && ctx.inputManager.value)
        ? ctx.inputManager.value.getState()
        : dummyInput;

      // Freeze inputs during WAITING phase
      if (currentGameState.roundStatus === 'WAITING') {
        p1Input = dummyInput;
      }

      // Update fighters - scripts compute their own decisions via Web Worker
      match.p1.update(p1Input, match.p2);
      match.p2.update(dummyInput, match.p1);

      const p1 = match.p1;
      const p2 = match.p2;
      const verticalOverlap = (p1.y + p1.height > p2.y) && (p2.y + p2.height > p1.y);

      if (verticalOverlap) {
        if (p1.x < p2.x) {
          const overlap = (p1.x + p1.width) - p2.x;
          if (overlap > 0) { p1.x -= overlap / 2; p2.x += overlap / 2; }
        } else {
          const overlap = (p2.x + p2.width) - p1.x;
          if (overlap > 0) { p2.x -= overlap / 2; p1.x += overlap / 2; }
        }
      }

      p1.checkHit(p2);
      p2.checkHit(p1);

      if (currentGameState.roundStatus === 'FIGHTING') {
        ctx.matchTimerRef.value -= 1 / 60;
      }

      const isTimeout = ctx.matchTimerRef.value <= 0;
      const isKO = p1.health <= 0 || p2.health <= 0;

      if (isKO || isTimeout) {
        matchEnded = true;
        debugCritical('MATCH', `Match ended: isKO=${isKO} isTimeout=${isTimeout} p1Health=${p1.health} p2Health=${p2.health}`);

        // Match ended - transition to ROUND_END
        debugCritical('ARCADE', 'Match ended - transitioning to ROUND_END');
        const p1Won = p1.health > p2.health;
        ctx.setGameState(prev => ({
          ...prev,
          matchActive: false,
          roundStatus: 'ROUND_END',
          arcadeStats: {
            matchesPlayed: prev.arcadeStats.matchesPlayed + 1,
            p1Wins: prev.arcadeStats.p1Wins + (p1Won ? 1 : 0),
            p2Wins: prev.arcadeStats.p2Wins + (p1Won ? 0 : 1)
          }
        }));

        // Keep activeMatchRef populated so arena stays visible
        clearMatchRestartTimeout();
        debugLog('ARCADE', 'Scheduling match restart in 1000ms');
        matchRestartTimeoutRef.value = setTimeout(() => {
          debugCritical('ARCADE', 'Match restart timeout fired - starting new match');
          ctx.startMatch();
          matchRestartTimeoutRef.value = null;
        }, 1000);

        break;
      }
    }

    // Only update state if values changed (minimize allocations)
    const currentState = ctx.gameStateRef.value;
    const newP1H = match.p1.health;
    const newP2H = match.p2.health;
    const newP1E = match.p1.energy;
    const newP2E = match.p2.energy;
    const newTime = Math.max(0, ctx.matchTimerRef.value);

    if (
      currentState.player1Health !== newP1H ||
      currentState.player2Health !== newP2H ||
      currentState.player1Energy !== newP1E ||
      currentState.player2Energy !== newP2E ||
      currentState.timeRemaining !== newTime
    ) {
      ctx.setGameState(prev => ({
        ...prev,
        player1Health: newP1H,
        player2Health: newP2H,
        player1Energy: newP1E,
        player2Energy: newP2E,
        timeRemaining: newTime
      }));
    }

    requestRef.value = requestAnimationFrame(update);
  };

  return { update, requestRef, clearMatchRestartTimeout };
}
