import { defineConfig } from 'vitest/config';

import { VITEST_SETUP_FILE } from '../paths/index.js';
import { workspaceAliases } from './aliases.js';

export const sharedVitestConfig = defineConfig({
  resolve: {
    alias: workspaceAliases,
  },

  test: {
    environment: 'node',
    globals: true,
    pool: 'forks',
    isolate: true,
    testTimeout: 10_000,
    passWithNoTests: true,
    setupFiles: [VITEST_SETUP_FILE],

    typecheck: {
      tsconfig: './tsconfig.test.json',
    },

    sequence: {
      concurrent: false,
    },
  },
});
