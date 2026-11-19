// config/vitest/shared.js
import { defineConfig, mergeConfig } from 'vitest/config';

import { packageSource, PLATFORM_PACKAGES } from './base.js';

export const workspaceAliases = PLATFORM_PACKAGES.flatMap((pkg) => [
  {
    find: new RegExp(`^@arch-platform/${pkg.name}$`),
    replacement: packageSource(pkg.path),
  },
  {
    find: new RegExp(`^@arch-platform/${pkg.name}/(.*)$`),
    replacement: `${packageSource(pkg.path)}/$1`,
  },
]);

export function createVitestConfig(name, overrides = {}) {
  return defineConfig((env) => {
    const isIntegration = env.mode === 'integration';
    const isRunningInTurbo = Boolean(process.env.TURBO_HASH);
    const maxWorkers = process.env.VITEST_MAX_WORKERS
      ? Number(process.env.VITEST_MAX_WORKERS)
      : isRunningInTurbo
        ? 1
        : 2;

    const baseConfig = {
      resolve: {
        alias: workspaceAliases,
      },

      test: {
        name,
        environment: 'node',
        globals: false,
        isolate: true,
        pool: 'threads',
        maxWorkers,
        passWithNoTests: true,
        silent: true,
        testTimeout: isIntegration ? 15000 : 5000,

        include: isIntegration ? ['**/*.integration.test.ts'] : ['**/*.{test,spec}.ts'],

        exclude: isIntegration
          ? ['**/node_modules/**', '**/dist/**']
          : ['**/node_modules/**', '**/dist/**', '**/*.integration.test.ts'],

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
    };

    const resolvedOverrides = typeof overrides === 'function' ? overrides(env) : overrides;

    return mergeConfig(baseConfig, resolvedOverrides);
  });
}
