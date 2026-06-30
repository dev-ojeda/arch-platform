import { defineConfig, mergeConfig } from 'vitest/config';

import { sharedCoverage, sharedVitestConfig } from '../../config/vitest/index.js';

export default mergeConfig(
  sharedVitestConfig,
  defineConfig({
    test: {
      name: 'code-analysis',

      coverage: {
        ...sharedCoverage,

        thresholds: {
          ...sharedCoverage.thresholds,

          lines: 40,
          statements: 40,
          branches: 25,
          functions: 25,
        },
      },
    },
  }),
);
