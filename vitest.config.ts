// vitest.config.ts

import { defineConfig } from 'vitest/config';

import { sharedVitestConfig } from './vitest.shared.js';

const projects = [
  {
    name: 'core',
    tests: 'packages/core/test/**/*.{test,spec}.ts',
  },

  {
    name: 'application',
    tests: 'packages/application/test/**/*.{test,spec}.ts',
  },

  {
    name: 'governance',
    tests: 'packages/governance/test/**/*.{test,spec}.ts',
  },

  {
    name: 'domain-order',
    tests: 'packages/domain-order/test/**/*.{test,spec}.ts',
  },

  {
    name: 'infrastructure',
    tests: 'packages/infrastructure/test/**/*.{test,spec}.ts',
  },

  {
    name: 'code-analysis',
    tests: 'packages/code-analysis/test/**/*.{test,spec}.ts',
  },
];

export default defineConfig({
  test: {
    projects: projects.map((pkg) => ({
      extends: sharedVitestConfig,

      test: {
        name: pkg.name,

        include: [pkg.tests],
      },
    })),

    coverage: {
      provider: 'v8',

      reporter: ['text', 'html'],

      // importante:
      // genera coverage pero no rompe CI/build

      thresholds: {
        autoUpdate: false,
      },

      include: ['packages/*/src/**/*.ts'],

      exclude: [
        '**/*.d.ts',

        '**/test/**',
        '**/__tests__/**',

        '**/index.ts',

        '**/types/**',
        '**/*types.ts',

        '**/interfaces/**',
        '**/contracts/**',

        '**/dto/**',

        '**/*input.ts',
        '**/*output.ts',
      ],
    },
  },
});
