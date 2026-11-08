export const TEST_FILES = [
  '**/test/**/*.ts',
  '**/test/**/*.tsx',
  '**/__tests__/**/*.ts',
  '**/__tests__/**/*.tsx',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
];

export const TEST_LANGUAGE_OPTIONS = {
  globals: {
    describe: 'readonly',
    it: 'readonly',
    test: 'readonly',

    expect: 'readonly',

    beforeEach: 'readonly',
    afterEach: 'readonly',

    vi: 'readonly',
  },
};
