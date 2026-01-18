# Scriptman Fighters

A fighting game where you can play as a human or write JavaScript to control AI fighters. Test your coding skills against human reflexes!

**Supports Xbox Gamepad!** Connect via Bluetooth only (the browser's Gamepad API doesn't support wired connections). Troubleshooting: ensure your gamepad is paired in system settings before launching the game.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-4FC08D?style=flat&logo=vue.js&logoColor=white)

---

## Features

- **Human vs Script**: Fight against your own AI scripts with keyboard or gamepad
- **Script vs Script**: Pit two different custom scripts against each other to test strategies
- **Custom Script Editor**: Write fighter AI in JavaScript with Monaco Editor (VS Code)
- **Sandboxed Execution**: Scripts run in isolated Web Workers for security
- **Loop Safety**: Built-in infinite loop detection prevents scripts from freezing the game
- **Real-time Combat**: Smooth 60 FPS fighting with physics-based movement

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/scriptman-fighters.git
cd scriptman-fighters

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:3000/scriptman-fighters/` in your browser.

---

## How to Play

### Player Types

| Type | Description | Color |
|------|-------------|-------|
| **Human** | Keyboard/gamepad controlled | Green |
| **Script A** | JavaScript AI (slot 1) | Purple |
| **Script B** | JavaScript AI (slot 2) | Teal |

### Controls

| Action | Keyboard | Gamepad |
|--------|----------|---------|
| Move Left | A / ← | D-Pad / Left Stick |
| Move Right | D / → | D-Pad / Left Stick |
| Jump | W / ↑ | A / X Button |
| Crouch | S / ↓ | B / Circle |
| Punch | J | X / Square |
| Kick | K | Y / Triangle |
| Block | L | LB / L1 |

---

## Custom Script API

Write your own fighter AI in JavaScript using the Script Editor! Your script runs in a sandboxed Web Worker and receives fighter state each frame.

### Input State

Your script receives `self` and `opponent` objects:

```javascript
// Both self and opponent have these properties:
{
  x: number,        // X position (0-800)
  y: number,        // Y position (0-450)
  vx: number,       // Horizontal velocity
  vy: number,       // Vertical velocity
  health: number,   // Health (0-100)
  energy: number,   // Energy (0-100)
  state: number,    // Current action state (FighterAction enum)
  direction: number, // Facing direction (-1 left, 1 right)
  cooldown: number  // Attack cooldown frames remaining
}
```

### Output Actions

Return an object with action flags:

```javascript
return {
  left: false,    // Move left
  right: true,    // Move right
  up: false,      // Jump
  down: false,    // Crouch
  action1: false, // Punch
  action2: false, // Kick
  action3: false  // Block
};
```

### Combat Mechanics

| Action | Damage | Energy Cost | Notes |
|--------|--------|-------------|-------|
| Punch | 5 | 10 | Fast, short range. Blocked by Block. |
| Kick | 10 | 20 | Slower, longer range. Dodged by Crouch. |
| Block | - | - | Counters punches (0 damage) |
| Crouch | - | - | Dodges kicks (0 damage) |
| Jump | - | 15 | Aerial mobility |
| Backstab | 3x | - | Attacks from behind deal triple damage |

### Example Script

```javascript
// Simple aggressive script
const dx = opponent.x - self.x;
const distance = Math.abs(dx);

// Chase opponent
const moveRight = dx > 0;
const moveLeft = dx < 0;

// Attack when close and off cooldown
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
};
```

---

## Project Structure

```
scriptman-fighters/
├── app.vue                    # Root Nuxt layout
├── nuxt.config.ts             # Nuxt configuration
├── app.config.ts              # Nuxt UI theme configuration
│
├── pages/
│   └── index.vue              # Main game page
│
├── components/
│   ├── AppHeader.vue          # App header with logo
│   ├── GameCanvas.vue         # Canvas rendering
│   ├── GameArena.vue          # Game arena wrapper
│   ├── GameHUD.vue            # Health/energy display
│   ├── Dashboard.vue          # Match controls
│   ├── MatchConfiguration.vue # Player selection
│   ├── ScriptEditor.vue       # Monaco code editor
│   ├── AboutModal.vue         # Help and documentation
│   └── ControlsHelper.vue     # Controls reference
│
├── services/
│   ├── GameEngine.ts          # Fighter physics and combat
│   ├── InputManager.ts        # Keyboard/gamepad input
│   ├── CustomScriptRunner.ts  # Script compilation & execution
│   ├── CustomScriptWorker.js  # Web Worker for sandboxed scripts
│   ├── MatchSetup.ts          # Fighter initialization
│   ├── PersistenceManager.ts  # localStorage persistence
│   └── Config.ts              # Game constants
│
├── composables/
│   ├── useGameState.ts        # Game state management
│   ├── useGameSettings.ts     # Settings management
│   ├── useMatchSetup.ts       # Match initialization
│   ├── useMatchUpdate.ts      # Frame updates
│   ├── useGameLoop.ts         # Game loop
│   └── useCustomScriptWorkers.ts # Script worker management
│
└── types.ts                   # TypeScript type definitions
```

---

## Technologies

- **Nuxt 4** - Vue-based framework
- **Vue 3** - Composition API with TypeScript
- **Nuxt UI** - UI components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Canvas 2D API** - Game rendering
- **Web Workers** - Sandboxed script execution
- **Monaco Editor** - VS Code-based code editor
- **Zod** - Data validation

---

## License

MIT License - feel free to use this code for learning and projects.

---

## Learn More

- [Web Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Nuxt Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
