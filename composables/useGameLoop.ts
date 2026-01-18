import { onUnmounted, type Ref } from 'vue';
import type { GameSettings, GameState } from '~/types';
import { Fighter } from '~/services/GameEngine';
import type { InputManager } from '~/services/InputManager';
import type { ScriptWorkerManager } from '~/services/CustomScriptRunner';
import { useMatchSetup } from './useMatchSetup';
import { useMatchUpdate } from './useMatchUpdate';

interface MatchContext {
  settingsRef: Ref<GameSettings>;
  gameStateRef: Ref<GameState>;
  setGameState: (updater: GameState | ((prev: GameState) => GameState)) => void;
  activeMatchRef: Ref<{ p1: Fighter; p2: Fighter } | null>;
  matchTimerRef: Ref<number>;
  inputManager: Ref<InputManager | null>;
  customScriptWorkerARef: Ref<ScriptWorkerManager | null>;
  customScriptWorkerBRef: Ref<ScriptWorkerManager | null>;
}

export const useGameLoop = (ctx: MatchContext) => {
  const { startMatch, clearWaitingTimeout, startCountdown, clearCountdownInterval } = useMatchSetup({
    settingsRef: ctx.settingsRef,
    gameStateRef: ctx.gameStateRef,
    setGameState: ctx.setGameState,
    activeMatchRef: ctx.activeMatchRef,
    matchTimerRef: ctx.matchTimerRef,
    customScriptWorkerARef: ctx.customScriptWorkerARef,
    customScriptWorkerBRef: ctx.customScriptWorkerBRef
  });

  const { update, requestRef, clearMatchRestartTimeout } = useMatchUpdate({
    settingsRef: ctx.settingsRef,
    gameStateRef: ctx.gameStateRef,
    setGameState: ctx.setGameState,
    activeMatchRef: ctx.activeMatchRef,
    matchTimerRef: ctx.matchTimerRef,
    inputManager: ctx.inputManager,
    startMatch
  });

  onUnmounted(() => {
    if (requestRef.value !== null) {
      cancelAnimationFrame(requestRef.value);
    }
    clearWaitingTimeout();
    clearMatchRestartTimeout();
    clearCountdownInterval();
  });

  return { update, startMatch, requestRef, clearWaitingTimeout, clearMatchRestartTimeout, startCountdown, clearCountdownInterval };
};
