import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  // any custom vitest config you require
  test: {
    globals: true,
    environment: 'happy-dom',
  }
})
