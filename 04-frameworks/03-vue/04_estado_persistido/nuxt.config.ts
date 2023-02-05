// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/scss/main.scss'],
  modules: ['@pinia/nuxt'],
  nitro: {
    devStorage: {
      db: {
        driver: 'fs',
        base: './.data/db',
      },
    },
  },
})
