// vitest.shared.ts

import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

const root = resolve(__dirname);

export const sharedVitestConfig = defineConfig({
  resolve: {
    alias: [
      {
        find: /^@arch\/contracts$/,
        replacement: resolve(root, 'packages/contracts/src'),
      },

      {
        find: /^@arch\/contracts\/(.*)$/,
        replacement: resolve(root, 'packages/contracts/src/$1'),
      },

      {
        find: /^@arch\/core$/,
        replacement: resolve(root, 'packages/core/src'),
      },

      {
        find: /^@arch\/core\/(.*)$/,
        replacement: resolve(root, 'packages/core/src/$1'),
      },

      {
        find: /^@arch\/testing$/,
        replacement: resolve(root, 'packages/testing/src'),
      },

      {
        find: /^@arch\/testing\/(.*)$/,
        replacement: resolve(root, 'packages/testing/src/$1'),
      },
    ],
  },

  test: {
    environment: 'node',

    globals: true,

    pool: 'forks',

    isolate: true,

    testTimeout: 10_000,

    passWithNoTests: true,

    setupFiles: [resolve(root, 'vitest.setup.ts')],

    sequence: {
      concurrent: false,
    },
  },
});
