export interface ChangelogEntry {
    version: string
    date: string
    changes: {
        added?: string[]
        fixed?: string[]
        changed?: string[]
        removed?: string[]
    }
}

export const changelogData: ChangelogEntry[] = [
    {
        version: '2.0.1',
        date: '2026-08-11',
        changes: {
            added: [
                'Inline Start/Reset VdFab controls beside player pickers',
                'vd3 and vd3-cbun attribution links in the match panel',
                'sfighters- localStorage key prefix with migration from legacy keys'
            ],
            changed: [
                'Switched UI icons to vd3 VdIcon outline style',
                'Touch controls CSS (no Tailwind utilities); larger block button',
                'Vitest 4 and TypeScript 7 toolchains'
            ],
            fixed: [
                'Match FAB buttons contained inside the dashboard card on desktop'
            ]
        }
    },
    {
        version: '2.0.0',
        date: '2026-08-01',
        changes: {
            changed: [
                'Migrated from Nuxt 4 + Nuxt UI to Vue 3 + Vite + @vanduo-oss/vd3',
                'Replaced Monaco Editor with @vanduo-oss/vd3-cbun VdCodeEditor',
                'Replaced Tailwind / Iconify chrome with vd3 components, tokens, and Phosphor icons'
            ],
            removed: [
                'Nuxt, Nuxt UI, Monaco Editor, and Tailwind CSS dependencies'
            ],
            added: [
                'Vite SPA packaging with GitHub Pages base path /scriptman-fighters/',
                'VdThemeSwitcher theme control via vd3 theme preference layer'
            ]
        }
    },
    {
        version: '1.0.0',
        date: '2026-01-18',
        changes: {
            added: [
                'Initial public release on GitHub Pages',
                'Human vs Script and Script vs Script game modes',
                'Monaco-based Script Editor with JavaScript syntax highlighting',
                'Sandboxed Web Worker execution for secure script isolation',
                'Built-in infinite loop detection for script safety',
                '60 FPS physics-based combat engine',
                'Rock-Paper-Scissors combat system: Block counters Punch, Crouch dodges Kick',
                'Energy management and cooldown systems',
                'Backstab mechanics (3x damage from behind)',
                'Keyboard and Xbox Gamepad support (Bluetooth)',
                'Dark and Light theme modes',
                'Local storage persistence for scripts and settings'
            ]
        }
    }
]

export function useChangelog() {
    return {
        changelog: changelogData,
        getLatestVersion: () => changelogData[0]?.version || '2.0.1',
        getVersionEntry: (version: string) => {
            return changelogData.find(entry => entry.version === version)
        }
    }
}

