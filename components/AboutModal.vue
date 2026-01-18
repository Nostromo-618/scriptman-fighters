<script setup lang="ts">
import { useChangelog } from '~/composables/useChangelog'
// Props for external control
const props = withDefaults(defineProps<{
  showTrigger?: boolean
}>(), {
  showTrigger: true
})

const open = defineModel<boolean>('open', { default: false })

const version = '1.0.0'

const tabs = [
  { label: 'Overview', icon: 'i-lucide-info', slot: 'overview' as const },
  { label: 'Game Engine', icon: 'i-lucide-cog', slot: 'engine' as const },
  { label: 'Script Editor', icon: 'i-lucide-code', slot: 'scriptEditor' as const },
  { label: 'Controls', icon: 'i-lucide-gamepad-2', slot: 'controls' as const },
  { label: 'Privacy', icon: 'i-lucide-eye-off', slot: 'privacy' as const },
  { label: 'Tips', icon: 'i-lucide-lightbulb', slot: 'tips' as const },
  { label: 'Changelog', icon: 'i-lucide-history', slot: 'changelog' as const }
]

const { changelog } = useChangelog()

// ========================================
// Scrollable Tabs Navigation
// ========================================
const tabsContainerRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateScrollState(): void {
  const container = tabsContainerRef.value
  if (!container) return

  const { scrollLeft, scrollWidth, clientWidth } = container
  canScrollLeft.value = scrollLeft > 1
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
}

function scrollTabsLeft(): void {
  const container = tabsContainerRef.value
  if (!container) return
  container.scrollBy({ left: -200, behavior: 'smooth' })
}

function scrollTabsRight(): void {
  const container = tabsContainerRef.value
  if (!container) return
  container.scrollBy({ left: 200, behavior: 'smooth' })
}

let scrollCleanup: (() => void) | null = null

function initScrollListeners(): void {
  scrollCleanup?.()
  scrollCleanup = null

  nextTick(() => {
    const wrapper = document.querySelector('[data-tabs-scroll-container]')
    if (!wrapper) return

    const listEl = wrapper.querySelector('[role="tablist"]') as HTMLElement | null
    if (!listEl) return

    tabsContainerRef.value = listEl
    updateScrollState()

    listEl.addEventListener('scroll', updateScrollState, { passive: true })

    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(listEl)

    scrollCleanup = () => {
      listEl.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  })
}

watch(open, (isOpen) => {
  if (isOpen) {
    initScrollListeners()
  } else {
    scrollCleanup?.()
    scrollCleanup = null
    tabsContainerRef.value = null
    canScrollLeft.value = false
    canScrollRight.value = false
  }
})

onUnmounted(() => {
  scrollCleanup?.()
})

const scriptEditorFeatures = [
  {
    label: 'Monaco Editor',
    content: 'Industry-standard code editor (same as VS Code) with JavaScript syntax highlighting, auto-completion, and error detection.'
  },
  {
    label: 'Sandboxed Execution',
    content: 'Scripts run in isolated Web Workers for security. No access to DOM, network, or local storage.'
  },
  {
    label: 'Loop Safety',
    content: 'Built-in infinite loop detection prevents scripts from freezing the game. Loops are automatically instrumented with iteration limits.'
  },
  {
    label: 'Fighter API',
    content: 'Access fighter state (position, health, energy) and opponent info to make decisions. Return action flags to control movement and attacks.'
  }
]

const combatMechanics = [
  {
    label: 'Rock-Paper-Scissors Combat',
    content: 'Block counters Punch (0 damage). Crouch dodges Kick (0 damage). Backstabs deal 3x damage when hitting from behind.'
  },
  {
    label: 'Energy System',
    content: 'All actions cost energy. Idle regenerates faster than moving. Strategic energy management is key to victory.'
  },
  {
    label: 'Physics',
    content: 'Gravity, friction, and knockback create dynamic fights. Jumping costs energy but enables aerial positioning.'
  }
]

const controlsInfo = [
  { key: 'A / ←', action: 'Move Left' },
  { key: 'D / →', action: 'Move Right' },
  { key: 'W / ↑', action: 'Jump' },
  { key: 'S / ↓', action: 'Crouch' },
  { key: 'J', action: 'Punch' },
  { key: 'K', action: 'Kick' },
  { key: 'L', action: 'Block' }
]

const gamepadInfo = [
  { key: 'Left Stick / D-Pad', action: 'Movement' },
  { key: 'A / X', action: 'Jump' },
  { key: 'B / Circle', action: 'Crouch' },
  { key: 'X / Square', action: 'Punch' },
  { key: 'Y / Triangle', action: 'Kick' },
  { key: 'LB / L1', action: 'Block' }
]
</script>

<template>
  <UModal
    v-model:open="open"
    title="Scriptman Fighters"
    description="Script-controlled fighting game"
    :ui="{
      content: 'max-w-full h-[100dvh] sm:max-w-[80vw] sm:h-[90vh]',
      body: 'flex-1 overflow-y-auto'
    }"
  >
    <!-- Trigger Button -->
    <UButton
      v-if="props.showTrigger"
      icon="i-lucide-info"
      aria-label="About Scriptman Fighters"
      color="neutral"
      variant="ghost"
      size="sm"
    />

    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <UIcon
              name="i-lucide-info"
              class="size-6 text-primary"
            />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-highlighted">
              Scriptman Fighters
            </h2>
            <p class="text-sm text-muted">
              v{{ version }} - Script-controlled fighting game
            </p>
          </div>
        </div>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Close modal"
          class="shrink-0"
          @click="open = false"
        />
      </div>
    </template>

    <template #body>
      <!-- Tabs with Arrow Navigation -->
      <div class="relative" data-tabs-scroll-container>
        <!-- Left arrow button -->
        <UButton
          v-if="canScrollLeft"
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="ghost"
          size="xs"
          class="absolute left-0 top-3.5 z-20"
          aria-label="Scroll tabs left"
          @click="scrollTabsLeft"
        />

        <!-- Left fade gradient -->
        <div
          v-if="canScrollLeft"
          class="absolute left-0 top-0 h-10 w-8 bg-gradient-to-r from-[var(--ui-bg)] to-transparent z-10 pointer-events-none"
        />

        <!-- Right arrow button -->
        <UButton
          v-if="canScrollRight"
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="ghost"
          size="xs"
          class="absolute right-0 top-3.5 z-20"
          aria-label="Scroll tabs right"
          @click="scrollTabsRight"
        />

        <!-- Right fade gradient -->
        <div
          v-if="canScrollRight"
          class="absolute right-0 top-0 h-10 w-8 bg-gradient-to-l from-[var(--ui-bg)] to-transparent z-10 pointer-events-none"
        />

        <UTabs
          :items="tabs"
          variant="link"
          color="primary"
          :ui="{
            list: 'overflow-x-auto scrollbar-hide px-8',
            trigger: 'flex-shrink-0 whitespace-nowrap'
          }"
          class="w-full"
        >
          <!-- Overview Tab -->
          <template #overview>
            <div class="space-y-4 p-4">
              <p class="text-sm text-gray-600 dark:text-slate-300">
                <strong>Scriptman Fighters</strong> is a fighting game where you can play as a human
                or write JavaScript scripts to control AI fighters. Test your coding skills against
                human reflexes!
              </p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 class="font-bold text-green-700 dark:text-green-400 mb-2">Human Player</h4>
                  <p class="text-xs text-green-600 dark:text-green-300">Use keyboard or gamepad to control your fighter in real-time.</p>
                </div>
                <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 class="font-bold text-purple-700 dark:text-purple-400 mb-2">Script A</h4>
                  <p class="text-xs text-purple-600 dark:text-purple-300">Write JavaScript to control a purple fighter. Executes in sandboxed Web Worker.</p>
                </div>
                <div class="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h4 class="font-bold text-teal-700 dark:text-teal-400 mb-2">Script B</h4>
                  <p class="text-xs text-teal-600 dark:text-teal-300">A second script slot for testing different strategies against each other.</p>
                </div>
              </div>

              <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p class="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Tip:</strong> Start with Human vs Script A, then graduate to Script A vs Script B
                  to compare AI strategies!
                </p>
              </div>
            </div>
          </template>

          <!-- Game Engine Tab -->
          <template #engine>
            <div class="space-y-4 p-4">
              <h3 class="font-bold text-sm">Combat Mechanics</h3>
              <UAccordion :items="combatMechanics" />

              <h3 class="font-bold text-sm mt-6">Fighter Actions</h3>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2 bg-gray-100 dark:bg-slate-800 rounded">
                  <strong>PUNCH</strong> - Fast, short range. Costs 10 energy.
                </div>
                <div class="p-2 bg-gray-100 dark:bg-slate-800 rounded">
                  <strong>KICK</strong> - Slower, longer range, more damage. Costs 20 energy.
                </div>
                <div class="p-2 bg-gray-100 dark:bg-slate-800 rounded">
                  <strong>BLOCK</strong> - Reduces damage, counters punch.
                </div>
                <div class="p-2 bg-gray-100 dark:bg-slate-800 rounded">
                  <strong>CROUCH</strong> - Ducks high attacks, counters kick.
                </div>
                <div class="p-2 bg-gray-100 dark:bg-slate-800 rounded">
                  <strong>JUMP</strong> - Aerial mobility. Costs 15 energy.
                </div>
                <div class="p-2 bg-gray-100 dark:bg-slate-800 rounded">
                  <strong>MOVE</strong> - Left/right movement. Low energy cost.
                </div>
              </div>
            </div>
          </template>

          <!-- Script Editor Tab -->
          <template #scriptEditor>
            <div class="space-y-4 p-4">
              <p class="text-sm text-gray-600 dark:text-slate-300">
                Write JavaScript to control your fighter. Your script receives fighter state and
                returns action decisions each frame.
              </p>

              <UAccordion :items="scriptEditorFeatures" />

              <h3 class="font-bold text-sm mt-4">Script API</h3>
              <pre class="text-xs bg-gray-100 dark:bg-slate-800 p-3 rounded overflow-x-auto"><code>// Your script receives:
// - self: { x, y, vx, vy, health, energy, state, direction, cooldown }
// - opponent: same structure as self

// Return an action object:
return {
  left: false,    // Move left
  right: true,    // Move right
  up: false,      // Jump
  down: false,    // Crouch
  action1: false, // Punch
  action2: false, // Kick
  action3: false  // Block
};</code></pre>

              <h3 class="font-bold text-sm mt-4">Example Script</h3>
              <pre class="text-xs bg-gray-100 dark:bg-slate-800 p-3 rounded overflow-x-auto"><code>// Simple aggressive script
const dx = opponent.x - self.x;
const distance = Math.abs(dx);

// Chase opponent
const moveRight = dx > 0;
const moveLeft = dx < 0;

// Attack when close
const punch = distance < 60 && self.cooldown === 0;
const kick = distance < 80 && distance >= 60 && self.cooldown === 0;

return {
  left: moveLeft,
  right: moveRight,
  up: false,
  down: false,
  action1: punch,
  action2: kick,
  action3: false
};</code></pre>
            </div>
          </template>

          <!-- Controls Tab -->
          <template #controls>
            <div class="space-y-4 p-4">
              <h3 class="font-bold text-sm">Keyboard Controls</h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="ctrl in controlsInfo"
                  :key="ctrl.key"
                  class="flex justify-between items-center p-2 bg-gray-100 dark:bg-slate-800 rounded text-xs"
                >
                  <kbd class="px-2 py-1 bg-white dark:bg-slate-700 rounded border text-xs font-mono">{{ ctrl.key }}</kbd>
                  <span>{{ ctrl.action }}</span>
                </div>
              </div>

              <h3 class="font-bold text-sm mt-4">Gamepad Controls (Xbox)</h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="ctrl in gamepadInfo"
                  :key="ctrl.key"
                  class="flex justify-between items-center p-2 bg-gray-100 dark:bg-slate-800 rounded text-xs"
                >
                  <span class="font-mono text-xs">{{ ctrl.key }}</span>
                  <span>{{ ctrl.action }}</span>
                </div>
              </div>

              <p class="text-xs text-gray-500 dark:text-slate-400 mt-4">
                Connect a Bluetooth Xbox controller for gamepad support. Other controllers may work
                with varying button mappings.
              </p>
            </div>
          </template>

          <!-- Privacy Tab -->
          <template #privacy>
            <div class="space-y-4 p-4">
              <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 class="font-bold text-green-700 dark:text-green-400 mb-2">100% Client-Side</h4>
                <p class="text-sm text-green-600 dark:text-green-300">
                  All game logic and script execution happens in your browser. No data is sent to any server.
                </p>
              </div>

              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-2">Local Storage Only</h4>
                <p class="text-sm text-blue-600 dark:text-blue-300">
                  Your scripts and settings are saved to browser localStorage. They never leave your device.
                </p>
              </div>

              <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 class="font-bold text-purple-700 dark:text-purple-400 mb-2">Sandboxed Scripts</h4>
                <p class="text-sm text-purple-600 dark:text-purple-300">
                  Custom scripts run in isolated Web Workers with no access to DOM, network, or system APIs.
                </p>
              </div>
            </div>
          </template>

          <!-- Tips Tab -->
          <template #tips>
            <div class="space-y-3 p-4">
              <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p class="text-sm"><strong>Manage Energy:</strong> Don't spam attacks. Wait for energy to regenerate between combos.</p>
              </div>
              <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p class="text-sm"><strong>Use Counters:</strong> Block beats Punch, Crouch beats Kick. Learn opponent patterns.</p>
              </div>
              <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p class="text-sm"><strong>Watch Cooldowns:</strong> Attacks have cooldown frames. Your script can check <code>self.cooldown</code>.</p>
              </div>
              <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p class="text-sm"><strong>Backstab:</strong> Attack from behind for 3x damage. Position matters!</p>
              </div>
              <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p class="text-sm"><strong>Test Scripts:</strong> Use Script A vs Script B to compare strategies without human input.</p>
              </div>
            </div>
          </template>

          <!-- Changelog Tab -->
          <template #changelog>
            <div class="space-y-4 p-4">
              <div
                v-for="entry in changelog"
                :key="entry.version"
                class="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0"
              >
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-mono font-bold text-primary">v{{ entry.version }}</span>
                  <span class="text-xs text-muted">{{ entry.date }}</span>
                </div>

                <div v-if="entry.changes.added?.length" class="mb-2">
                  <span class="inline-block text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded mb-1">Added</span>
                  <ul class="text-xs text-gray-600 dark:text-slate-300 list-disc list-inside">
                    <li v-for="item in entry.changes.added" :key="item">{{ item }}</li>
                  </ul>
                </div>

                <div v-if="entry.changes.changed?.length" class="mb-2">
                  <span class="inline-block text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded mb-1">Changed</span>
                  <ul class="text-xs text-gray-600 dark:text-slate-300 list-disc list-inside">
                    <li v-for="item in entry.changes.changed" :key="item">{{ item }}</li>
                  </ul>
                </div>

                <div v-if="entry.changes.fixed?.length" class="mb-2">
                  <span class="inline-block text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded mb-1">Fixed</span>
                  <ul class="text-xs text-gray-600 dark:text-slate-300 list-disc list-inside">
                    <li v-for="item in entry.changes.fixed" :key="item">{{ item }}</li>
                  </ul>
                </div>

                <div v-if="entry.changes.removed?.length">
                  <span class="inline-block text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2 py-0.5 rounded mb-1">Removed</span>
                  <ul class="text-xs text-gray-600 dark:text-slate-300 list-disc list-inside">
                    <li v-for="item in entry.changes.removed" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </template>
  </UModal>
</template>
