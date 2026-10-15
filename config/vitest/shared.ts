import { defineConfig } from 'vitest/config';

import { packageSource, PLATFORM_PACKAGES } from './base.js';

export const workspaceAliases = PLATFORM_PACKAGES.flatMap((pkg) => [
  {
    find: new RegExp(`^@arch-platform/${pkg}$`),
    replacement: packageSource(pkg),
  },
  {
    find: new RegExp(`^@arch-platform/${pkg}/(.*)$`),
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
      // Desactivamos globals para forzar importaciones explícitas y evitar fallos del compilador/linter
      globals: false,
      isolate: true,
      pool: 'forks',
      passWithNoTests: true,
      silent: true,
      testTimeout: 5000, // Limite por defecto estándar

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
