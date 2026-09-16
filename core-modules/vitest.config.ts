import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@pairkit/core',
    include: ['src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
  },
});
