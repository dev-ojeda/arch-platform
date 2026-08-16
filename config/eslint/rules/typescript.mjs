import tseslint from 'typescript-eslint';

export const COMMON_TS_RULES = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
};

export const TYPESCRIPT_LANGUAGE_OPTIONS = {
  parser: tseslint.parser,

  parserOptions: {
    projectService: true,
    tsconfigRootDir: import.meta.dirname,
  },
};
