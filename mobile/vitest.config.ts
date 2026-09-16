import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'mobile',
    environment: 'node',
    passWithNoTests: true,
    include: ['src/**/*.test.ts'],
  },
});
