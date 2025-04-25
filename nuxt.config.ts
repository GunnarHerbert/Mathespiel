// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    nitro: {
        experimental: {
            websocket: true,
            database: true,
        }
    },
    css: ['~/assets/css/global.css'],
    modules: ['nuxt-auth-utils', '@nuxtjs/tailwindcss'],
});