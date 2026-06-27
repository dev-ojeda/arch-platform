// vitest.shared.ts

import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

const root = resolve(import.meta.dirname);

/**
 * -----------------------------------------------------------------------------
 * Workspace aliases
 * -----------------------------------------------------------------------------
 */

const packages = [
  'contracts',
  'core',
  'testing',
  'build-core',
  'application',
  'governance',
  'infrastructure',
  'platform-model',
  'code-analysis',
  'domain-order',
];

const aliases = packages.flatMap((pkg) => [
  {
    find: new RegExp(`^@arch/${pkg}$`),

    replacement: resolve(root, `packages/${pkg}/src`),
  },

  {
    find: new RegExp(`^@arch/${pkg}/(.*)$`),

    replacement: resolve(root, `packages/${pkg}/src/$1`),
  },
]);

export const sharedVitestConfig = defineConfig({
  resolve: {
    alias: aliases,
  },

  test: {
    environment: 'node',

    globals: true,

    /**
     * Vitest workers
     */
    pool: 'forks',

    isolate: true,

    testTimeout: 10_000,

    passWithNoTests: true,

    /**
     * Common setup
     */
    setupFiles: [resolve(root, 'vitest.setup.ts')],

    /**
     * TypeScript project for tests
     */
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },

    sequence: {
      concurrent: false,
    },
  },
});
