<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from "vue";
import { VdModal, VdButton, VdTabs, VdAccordion, VdIcon } from "@vanduo-oss/vd3";
import { useChangelog } from "@/composables/useChangelog";

const props = withDefaults(
  defineProps<{
    showTrigger?: boolean;
  }>(),
  { showTrigger: true },
);

const open = defineModel<boolean>("open", { default: false });

const version = "2.0.1";
const activeTab = ref("overview");

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "engine", label: "Game Engine" },
  { id: "scriptEditor", label: "Script Editor" },
  { id: "controls", label: "Controls" },
  { id: "privacy", label: "Privacy" },
  { id: "tips", label: "Tips" },
  { id: "changelog", label: "Changelog" },
];

const { changelog } = useChangelog();

const tabsContainerRef = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

function updateScrollState(): void {
  const container = tabsContainerRef.value;
  if (!container) return;
  const { scrollLeft, scrollWidth, clientWidth } = container;
  canScrollLeft.value = scrollLeft > 1;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
}

function scrollTabsLeft(): void {
  tabsContainerRef.value?.scrollBy({ left: -200, behavior: "smooth" });
}

function scrollTabsRight(): void {
  tabsContainerRef.value?.scrollBy({ left: 200, behavior: "smooth" });
}

let scrollCleanup: (() => void) | null = null;

function initScrollListeners(): void {
  scrollCleanup?.();
  scrollCleanup = null;

  nextTick(() => {
    const listEl = document.querySelector(
      ".about-tabs-wrap .vd-tab-list",
    ) as HTMLElement | null;
    if (!listEl) return;

    tabsContainerRef.value = listEl;
    updateScrollState();
    listEl.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(listEl);

    scrollCleanup = () => {
      listEl.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  });
}

watch(open, (isOpen) => {
  if (isOpen) initScrollListeners();
  else {
    scrollCleanup?.();
    scrollCleanup = null;
    tabsContainerRef.value = null;
    canScrollLeft.value = false;
    canScrollRight.value = false;
  }
});

onUnmounted(() => scrollCleanup?.());

const scriptEditorFeatures = [
  {
    id: "editor",
    title: "Code Editor",
    content:
      "Built-in JavaScript code editor with syntax highlighting, validation, and error detection.",
  },
  {
    id: "sandbox",
    title: "Sandboxed Execution",
    content:
      "Scripts run in isolated Web Workers for security. No access to DOM, network, or local storage.",
  },
  {
    id: "loops",
    title: "Loop Safety",
    content:
      "Built-in infinite loop detection prevents scripts from freezing the game.",
  },
  {
    id: "api",
    title: "Fighter API",
    content:
      "Access fighter state and opponent info to make decisions each frame.",
  },
];

const combatMechanics = [
  {
    id: "rps",
    title: "Rock-Paper-Scissors Combat",
    content:
      "Block counters Punch. Crouch dodges Kick. Backstabs deal 3x damage from behind.",
  },
  {
    id: "energy",
    title: "Energy System",
    content:
      "All actions cost energy. Idle regenerates faster than moving.",
  },
  {
    id: "physics",
    title: "Physics",
    content:
      "Gravity, friction, and knockback create dynamic fights.",
  },
];

const accordionOpen = ref<string[]>([]);

const controlsInfo = [
  { key: "A / ←", action: "Move Left" },
  { key: "D / →", action: "Move Right" },
  { key: "W / ↑", action: "Jump" },
  { key: "S / ↓", action: "Crouch" },
  { key: "J", action: "Punch" },
  { key: "K", action: "Kick" },
  { key: "L", action: "Block" },
];

const gamepadInfo = [
  { key: "Left Stick / D-Pad", action: "Movement" },
  { key: "A / X", action: "Jump" },
  { key: "B / Circle", action: "Crouch" },
  { key: "X / Square", action: "Punch" },
  { key: "Y / Triangle", action: "Kick" },
  { key: "LB / L1", action: "Block" },
];
</script>

<template>
  <VdButton
    v-if="props.showTrigger"
    variant="ghost"
    size="sm"
    aria-label="About Scriptman Fighters"
    @click="open = true"
  >
    <VdIcon name="info" />
  </VdButton>

  <VdModal v-model:open="open" size="xl">
    <template #header>
      <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
        <div class="about-header-icon-wrap">
          <VdIcon name="info" size="lg" />
        </div>
        <div>
          <h2 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Scriptman Fighters</h2>
          <p style="margin: 0; font-size: 0.875rem; color: var(--vd-text-secondary);">
            v{{ version }} - Script-controlled fighting game
          </p>
        </div>
      </div>
    </template>

    <div class="about-tabs-wrap sf-modal-scope sf-modal-scope--about">
      <VdButton
        v-if="canScrollLeft"
        variant="ghost"
        size="sm"
        class="about-tab-scroll-btn about-tab-scroll-btn--left"
        aria-label="Scroll tabs left"
        @click="scrollTabsLeft"
      >
        <VdIcon name="caret-left" />
      </VdButton>

      <div v-if="canScrollLeft" class="about-tab-fade about-tab-fade--left" />

      <VdButton
        v-if="canScrollRight"
        variant="ghost"
        size="sm"
        class="about-tab-scroll-btn about-tab-scroll-btn--right"
        aria-label="Scroll tabs right"
        @click="scrollTabsRight"
      >
        <VdIcon name="caret-right" />
      </VdButton>

      <div v-if="canScrollRight" class="about-tab-fade about-tab-fade--right" />

      <VdTabs v-model="activeTab" :tabs="tabs">
        <div v-show="activeTab === 'overview'" class="about-panel">
          <p style="font-size: 0.875rem; color: var(--vd-text-secondary);">
            <strong>Scriptman Fighters</strong> is a fighting game where you can play as a human
            or write JavaScript scripts to control AI fighters. Test your coding skills against
            human reflexes!
          </p>

          <div class="about-grid-3" style="margin-top: 1rem;">
            <div class="about-feature-card about-feature-card--green">
              <h4 style="font-weight: 700; color: #15803d; margin-bottom: 0.5rem;">Human Player</h4>
              <p style="font-size: 0.75rem; color: #16a34a;">
                Use keyboard or gamepad to control your fighter in real-time.
              </p>
            </div>
            <div class="about-feature-card about-feature-card--purple">
              <h4 style="font-weight: 700; color: #7e22ce; margin-bottom: 0.5rem;">Script A</h4>
              <p style="font-size: 0.75rem; color: #9333ea;">
                Write JavaScript to control a purple fighter. Executes in sandboxed Web Worker.
              </p>
            </div>
            <div class="about-feature-card about-feature-card--teal">
              <h4 style="font-weight: 700; color: #0f766e; margin-bottom: 0.5rem;">Script B</h4>
              <p style="font-size: 0.75rem; color: #0d9488;">
                A second script slot for testing different strategies against each other.
              </p>
            </div>
          </div>

          <div class="about-tip" style="margin-top: 1rem;">
            <strong>Tip:</strong> Start with Human vs Script A, then graduate to Script A vs Script B
            to compare AI strategies!
          </div>
        </div>

        <div v-show="activeTab === 'engine'" class="about-panel">
          <h3 style="font-weight: 700; font-size: 0.875rem;">Combat Mechanics</h3>
          <VdAccordion v-model="accordionOpen" :items="combatMechanics" />

          <h3 style="font-weight: 700; font-size: 0.875rem; margin-top: 1.5rem;">Fighter Actions</h3>
          <div class="about-grid-2" style="margin-top: 0.5rem;">
            <div class="about-kbd-row"><strong>PUNCH</strong> - Fast, short range. Costs 10 energy.</div>
            <div class="about-kbd-row"><strong>KICK</strong> - Slower, longer range, more damage. Costs 20 energy.</div>
            <div class="about-kbd-row"><strong>BLOCK</strong> - Reduces damage, counters punch.</div>
            <div class="about-kbd-row"><strong>CROUCH</strong> - Ducks high attacks, counters kick.</div>
            <div class="about-kbd-row"><strong>JUMP</strong> - Aerial mobility. Costs 15 energy.</div>
            <div class="about-kbd-row"><strong>MOVE</strong> - Left/right movement. Low energy cost.</div>
          </div>
        </div>

        <div v-show="activeTab === 'scriptEditor'" class="about-panel">
          <p style="font-size: 0.875rem; color: var(--vd-text-secondary);">
            Write JavaScript to control your fighter. Your script receives fighter state and
            returns action decisions each frame.
          </p>

          <VdAccordion v-model="accordionOpen" :items="scriptEditorFeatures" style="margin-top: 1rem;" />

          <h3 style="font-weight: 700; font-size: 0.875rem; margin-top: 1rem;">Script API</h3>
          <pre class="about-code"><code>// Your script receives:
// - self: { x, y, vx, vy, health, energy, state, direction, cooldown }
// - opponent: same structure as self

// Return an action object:
return {
  left: false,
  right: true,
  up: false,
  down: false,
  action1: false,
  action2: false,
  action3: false
};</code></pre>
        </div>

        <div v-show="activeTab === 'controls'" class="about-panel">
          <h3 style="font-weight: 700; font-size: 0.875rem;">Keyboard Controls</h3>
          <div class="about-grid-2" style="margin-top: 0.5rem;">
            <div v-for="ctrl in controlsInfo" :key="ctrl.key" class="about-kbd-row">
              <kbd class="about-kbd">{{ ctrl.key }}</kbd>
              <span>{{ ctrl.action }}</span>
            </div>
          </div>

          <h3 style="font-weight: 700; font-size: 0.875rem; margin-top: 1rem;">Gamepad Controls (Xbox)</h3>
          <div class="about-grid-2" style="margin-top: 0.5rem;">
            <div v-for="ctrl in gamepadInfo" :key="ctrl.key" class="about-kbd-row">
              <span style="font-family: ui-monospace, monospace; font-size: 0.75rem;">{{ ctrl.key }}</span>
              <span>{{ ctrl.action }}</span>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'privacy'" class="about-panel">
          <div class="about-feature-card about-feature-card--green" style="margin-bottom: 1rem;">
            <h4 style="font-weight: 700; color: #15803d;">100% Client-Side</h4>
            <p style="font-size: 0.875rem; color: #16a34a;">
              All game logic and script execution happens in your browser.
            </p>
          </div>
          <div class="about-feature-card about-feature-card--purple" style="margin-bottom: 1rem;">
            <h4 style="font-weight: 700; color: #7e22ce;">Local Storage Only</h4>
            <p style="font-size: 0.875rem; color: #9333ea;">
              Your scripts and settings are saved to browser localStorage.
            </p>
          </div>
          <div class="about-feature-card about-feature-card--teal">
            <h4 style="font-weight: 700; color: #0f766e;">Sandboxed Scripts</h4>
            <p style="font-size: 0.875rem; color: #0d9488;">
              Custom scripts run in isolated Web Workers with no DOM or network access.
            </p>
          </div>
        </div>

        <div v-show="activeTab === 'tips'" class="about-panel">
          <div v-for="(tip, i) in [
            'Manage Energy: Don\'t spam attacks.',
            'Use Counters: Block beats Punch, Crouch beats Kick.',
            'Watch Cooldowns: Check self.cooldown in scripts.',
            'Backstab: Attack from behind for 3x damage.',
            'Test Scripts: Compare Script A vs Script B.',
          ]" :key="i" class="about-tip" :style="{ marginBottom: i < 4 ? '0.75rem' : '0' }">
            {{ tip }}
          </div>
        </div>

        <div v-show="activeTab === 'changelog'" class="about-panel">
          <div
            v-for="entry in changelog"
            :key="entry.version"
            style="border-bottom: 1px solid var(--vd-border-subtle); padding-bottom: 1rem; margin-bottom: 1rem;"
          >
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="font-family: ui-monospace, monospace; font-weight: 700; color: var(--vd-color-primary);">
                v{{ entry.version }}
              </span>
              <span style="font-size: 0.75rem; color: var(--vd-text-secondary);">{{ entry.date }}</span>
            </div>

            <div v-if="entry.changes.added?.length" style="margin-bottom: 0.5rem;">
              <span class="changelog-tag changelog-tag--added">Added</span>
              <ul style="font-size: 0.75rem; color: var(--vd-text-secondary); margin: 0.25rem 0 0; padding-left: 1.25rem;">
                <li v-for="item in entry.changes.added" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div v-if="entry.changes.changed?.length" style="margin-bottom: 0.5rem;">
              <span class="changelog-tag changelog-tag--changed">Changed</span>
              <ul style="font-size: 0.75rem; color: var(--vd-text-secondary); margin: 0.25rem 0 0; padding-left: 1.25rem;">
                <li v-for="item in entry.changes.changed" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div v-if="entry.changes.fixed?.length" style="margin-bottom: 0.5rem;">
              <span class="changelog-tag changelog-tag--fixed">Fixed</span>
              <ul style="font-size: 0.75rem; color: var(--vd-text-secondary); margin: 0.25rem 0 0; padding-left: 1.25rem;">
                <li v-for="item in entry.changes.fixed" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div v-if="entry.changes.removed?.length">
              <span class="changelog-tag changelog-tag--removed">Removed</span>
              <ul style="font-size: 0.75rem; color: var(--vd-text-secondary); margin: 0.25rem 0 0; padding-left: 1.25rem;">
                <li v-for="item in entry.changes.removed" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </VdTabs>
    </div>
  </VdModal>
</template>

<style scoped>
.about-header-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: color-mix(in srgb, var(--vd-color-primary) 12%, transparent);
  color: var(--vd-color-primary);
  line-height: 1;
}

.changelog-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

.changelog-tag--added { background: rgba(34, 197, 94, 0.15); color: #15803d; }
.changelog-tag--changed { background: rgba(245, 158, 11, 0.15); color: #b45309; }
.changelog-tag--fixed { background: rgba(59, 130, 246, 0.15); color: #1d4ed8; }
.changelog-tag--removed { background: rgba(239, 68, 68, 0.15); color: #b91c1c; }
</style>
