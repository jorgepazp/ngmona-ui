import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.mjs'],
    environment: 'node',
    // The acceptance suite installs every component into two fixture projects and compiles both.
    testTimeout: 120_000,
    hookTimeout: 300_000,
  },
});
