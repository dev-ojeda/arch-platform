// vitest.shared.ts

import { defineConfig }
  from 'vitest/config'

export const sharedVitestConfig =
  defineConfig({

    test: {

      environment:
        'node',

      globals: true,

      pool:
        'forks',

      testTimeout:
        10000,

      coverage: {

        provider:
          'v8',

        reporter: [

          'text',

          'html'
        ],

        exclude: [

          '**/*.test.ts',

          '**/__tests__/**',

          '**/dist/**',

          '**/node_modules/**'
        ]
      }
    }
  })