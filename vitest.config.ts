import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  // Mirrors the "@/*" -> "./*" path mapping in tsconfig.json, so tests can import
  // modules that use the alias (app/sitemap.ts does).
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts'],
  },
})
