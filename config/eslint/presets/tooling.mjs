// config/eslint/presets/tooling.mjs

export const TOOLING_FILES = [
  '*.config.{js,mjs,ts}',
  'packages/*/*.config.{js,mjs,ts}',
  'packages/generators/*/*.config.{js,mjs,ts}',
  'config/**/*.{js,mjs,ts}',
  'scripts/**/*.{js,mjs,ts}',
];

export const COMMONJS_FILES = [
  '**/*.cjs',
  '**/commitlint.config.cjs',
  '**/.dependency-cruiser.cjs',
];

// OPTIMIZACIÓN ABSOLUTA: Al asignar 'projectService: false', el linter de TypeScript
// analiza la sintaxis nativa de tus configuraciones e infraestructura al instante
// SIN intentar compilarlas ni exigir que pertenezcan a un tsconfig.json.
export const TOOLING_LANGUAGE_OPTIONS = {
  globals: {
    console: 'readonly',
    process: 'readonly',
    URL: 'readonly',
  },
  parserOptions: {
    projectService: false,
  },
};

export const COMMONJS_LANGUAGE_OPTIONS = {
  ...TOOLING_LANGUAGE_OPTIONS,
  sourceType: 'commonjs',
  globals: {
    ...(TOOLING_LANGUAGE_OPTIONS.globals ?? {}),
    module: 'readonly',
    require: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
  },
};
