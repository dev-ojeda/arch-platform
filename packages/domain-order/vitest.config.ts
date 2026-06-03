import { defineConfig, mergeConfig } from 'vitest/config';

import { sharedVitestConfig } from '../../vitest.shared.js';

export default mergeConfig(
  sharedVitestConfig,

  defineConfig({
    test: {
      name: 'domain-order',

      setupFiles: ['../../vitest.setup.ts'],

      include: [
        'src/**/*.test.ts',

        'src/**/*.spec.ts',

        'testing/**/*.test.ts',

        'testing/**/*.spec.ts',
      ],

      coverage: {
        include: ['src/**/*.ts'],

        thresholds: {
          lines: 40,

          functions: 25,

          statements: 40,

          branches: 25,
        },
      },
    },
  }),
);
