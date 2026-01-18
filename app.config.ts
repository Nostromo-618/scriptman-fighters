export default defineAppConfig({
    ui: {
        colors: {
            primary: 'emerald',
            secondary: 'blue',
            success: 'emerald',
            info: 'blue',
            warning: 'yellow',
            error: 'red',
            neutral: 'slate'
        }
    },
    // Disable icon API fallback for strict CSP compliance
    // All icons must be bundled at build time
    icon: {
        // Disable runtime fetching from Iconify API
        fetchTimeout: 0,
        // Use local mode only - no API calls
        mode: 'svg'
    }
})
