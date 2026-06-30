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

    isolate: true,

    pool: 'forks',

    passWithNoTests: true,

    setupFiles: [VITEST_SETUP_FILE],

    sequence: {
      concurrent: false,
    },

    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
});
