export const sharedCoverage = {
  provider: 'v8',

  reporter: ['text', 'html'],

  thresholds: {
    autoUpdate: false,
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
} as const;
