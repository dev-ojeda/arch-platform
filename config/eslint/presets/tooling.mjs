export const TOOLING_FILES = [
  '**/*.config.{js,mjs,ts}',
  '**/eslint/**/*.mjs',
  '**/config/**/*.mjs',
];

export const COMMONJS_FILES = [
  '**/*.cjs',
  '**/commitlint.config.cjs',
  '**/.dependency-cruiser.cjs',
];
export const TOOLING_LANGUAGE_OPTIONS = {
  parserOptions: {
    projectService: false,
  },
};
export const COMMONJS_LANGUAGE_OPTIONS = {
  ...TOOLING_LANGUAGE_OPTIONS,

  sourceType: 'commonjs',

  globals: {
    ...(TOOLING_LANGUAGE_OPTIONS.globals ?? {}),
    console: 'readonly',
    process: 'readonly',
    module: 'readonly',
    require: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
  },
};
