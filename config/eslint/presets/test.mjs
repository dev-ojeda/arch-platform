export const TEST_FILES = [
  'packages/**/test/**/*.ts',
  'packages/**/__tests__/**/*.ts',
  'packages/**/*.test.ts',
  'packages/**/*.spec.ts',
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
