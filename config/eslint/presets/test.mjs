export const TEST_FILES = [
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/test/**/*.ts',
  '**/__tests__/**/*.ts',
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
