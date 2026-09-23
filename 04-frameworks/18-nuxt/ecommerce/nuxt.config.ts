// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3333,
  },
  css: ['~/assets/main.css'],
  features: {
    inlineStyles: true,
  },
  runtimeConfig: {
    public: {
      // Public runtime config: exposed to the client bundle.
      siteName:
        process.env.NUXT_PUBLIC_SITE_NAME ?? '🍋 Lemoncode Shop × Nuxt 4',
    },
  },
});
