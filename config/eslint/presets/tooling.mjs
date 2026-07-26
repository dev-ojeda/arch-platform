export const TOOLING_FILES = [
  '**/vitest.config.ts',
  '**/eslint.config.mjs',
  '**/*.config.{js,cjs,mjs,ts}',
  '**/commitlint.config.cjs',
  '**/.dependency-cruiser.cjs',
];

export const COMMONJS_FILES = [
  '**/*.cjs',
  '**/*.config.cjs',
  '**/commitlint.config.cjs',
  '**/.dependency-cruiser.cjs',
];
export const TOOLING_LANGUAGE_OPTIONS = {
  parserOptions: {
    projectService: false,
  },
};
export const COMMONJS_LANGUAGE_OPTIONS = {
  sourceType: 'commonjs',

  globals: {
    module: 'readonly',
    require: 'readonly',

    __dirname: 'readonly',
    __filename: 'readonly',
  },

  TOOLING_LANGUAGE_OPTIONS,
};
