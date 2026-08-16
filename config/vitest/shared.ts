import { defineConfig } from 'vitest/config';

import { packageSource, PLATFORM_PACKAGES } from './base.js';

export const workspaceAliases = PLATFORM_PACKAGES.flatMap((pkg) => [
  {
    find: new RegExp(`^@arch/${pkg}$`),
    replacement: packageSource(pkg),
  },
  {
    find: new RegExp(`^@arch/${pkg}/(.*)$`),
    replacement: `${packageSource(pkg)}/$1`,
  },
]);

export function createVitestConfig(name: string) {
  return defineConfig({
    resolve: {
      alias: workspaceAliases,
    },

    test: {
      name,
      environment: 'node',
      globals: true,
      isolate: true,
      pool: 'forks',
      passWithNoTests: true,

      sequence: {
        concurrent: false,
      },

      typecheck: {
        tsconfig: './tsconfig.test.json',
      },

      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],

        thresholds: {
          autoUpdate: false,
          lines: 40,
          statements: 40,
          branches: 25,
          functions: 25,
        },

        include: ['src/**/*.ts'],

        exclude: [
          '**/*.d.ts',
          '**/index.ts',
          '**/test/**',
          '**/__tests__/**',
          '**/contracts/**',
          '**/types/**',
          '**/*types.ts',
          '**/interfaces/**',
          '**/dto/**',
          '**/*input.ts',
          '**/*output.ts',
        ],
      },
    },
  });
}
