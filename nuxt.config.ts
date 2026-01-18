// https://nuxt.com/docs/api/configuration/nuxt-config

// CSP only applied in production (dev mode needs Iconify API access)
const isProduction = process.env.NODE_ENV === 'production';

const cspMeta = isProduction
  ? [{
    'http-equiv': 'Content-Security-Policy',
    content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:;"
  }]
  : [];

export default defineNuxtConfig({
  compatibilityDate: '2025-12-29',
  ssr: false,
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  // Bundle icons locally at build time - no external API calls needed
  icon: {
    // Use 'local' mode to bundle all icons into the app at build time
    serverBundle: 'local',
    clientBundle: {
      scan: true,
      sizeLimitKb: 1024,
      // Include icons used by Nuxt UI components that aren't detected by scanning
      icons: [
        'lucide:menu',
        'lucide:x',
        'lucide:check',
        'lucide:chevron-down',
        'lucide:chevron-up',
        'lucide:chevron-left',
        'lucide:chevron-right',
        'lucide:sun',
        'lucide:moon',
        'lucide:monitor',
        'lucide:circle-alert',
        'lucide:circle-check',
        'lucide:info',
        'lucide:triangle-alert',
        'lucide:loader-circle',
        'heroicons:x-mark',
        'heroicons:chevron-down',
        'heroicons:chevron-up',
        'heroicons:check'
      ]
    }
  },

  app: {
    baseURL: '/scriptman-fighters/',
    head: {
      title: 'Scriptman Fighters',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A fighting game where you write JavaScript to control AI fighters'
        },
        ...cspMeta
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/scriptman-fighters/favicon.ico' }]
    }
  },

  devServer: {
    port: 3000,
    host: 'localhost'
  },

  vite: {
    worker: {
      format: 'es'
    }
  },

  nitro: {
    experimental: {
      wasm: true
    },
    compatibilityDate: '2025-12-29'
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  colorMode: {
    preference: 'system'
  }
});
