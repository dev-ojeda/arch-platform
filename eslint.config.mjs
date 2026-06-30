// eslint.config.mjs

import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

/**
 * -----------------------------------------------------------------------------
 * Paths
 * -----------------------------------------------------------------------------
 */

const IGNORES = [
  '**/dist/**',
  '**/coverage/**',
  '**/.turbo/**',
  '**/node_modules/**',
  '**/.pnpm/**',
  '**/.cache/**',
  '**/*.d.ts',
];

const TOOLING_FILES = [
  '**/vitest.config.ts',
  '**/eslint.config.mjs',
  '**/*.config.{js,cjs,mjs,ts}',
  '**/commitlint.config.cjs',
  '**/.dependency-cruiser.cjs',
];

const TEST_FILES = ['**/*.test.ts', '**/*.spec.ts', '**/test/**/*.ts', '**/__tests__/**/*.ts'];

const SOURCE_FILES = ['**/*.ts', '**/*.tsx', '**/*.js'];

/**
 * -----------------------------------------------------------------------------
 * Import Governance
 * -----------------------------------------------------------------------------
 */

const RESTRICTED_IMPORTS = {
  patterns: ['@arch/*/src/**', '@arch/*/dist/**', '@arch/**/src/**', '@arch/**/dist/**'],

  paths: [
    {
      name: 'node:path',
      importNames: ['default'],
      message: 'Use "import * as path from node:path" o imports nombrados.',
    },
    {
      name: 'node:fs/promises',
      importNames: ['default'],
      message: 'Use imports nombrados (readFile, stat, mkdir, readdir...).',
    },
    {
      name: 'node:fs',
      importNames: ['default'],
      message: 'Use imports nombrados o namespace import.',
    },
  ],
};
/**
 * -----------------------------------------------------------------------------
 * Common Rules
 * -----------------------------------------------------------------------------
 */

const COMMON_IMPORT_RULES = {
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'always',
      mjs: 'always',
      ts: 'never',
      tsx: 'never',
      json: 'always',
    },
  ],

  'import/no-self-import': 'error',

  'import/no-duplicates': 'error',

  'import/no-unresolved': [
    'error',
    {
      commonjs: false,
      amd: false,
    },
  ],

  'import/first': 'error',

  'import/newline-after-import': 'error',

  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],

      pathGroups: [
        {
          pattern: '@arch/**',
          group: 'internal',
          position: 'before',
        },
      ],

      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },

      'newlines-between': 'always',
    },
  ],

  'no-restricted-imports': ['error', RESTRICTED_IMPORTS],
};

/**
 * -----------------------------------------------------------------------------
 * Export
 * -----------------------------------------------------------------------------
 */

export default tseslint.config(
  /**
   * Global ignores
   */
  {
    ignores: IGNORES,
  },

  /**
   * ESLint base
   */
  eslint.configs.recommended,

  /**
   * TypeScript recommended
   */
  ...tseslint.configs.recommendedTypeChecked,

  /**
   * -----------------------------------------------------------------------------
   * Application source
   * -----------------------------------------------------------------------------
   */
  {
    files: SOURCE_FILES,

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      import: importPlugin,
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },

      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json'],
        },

        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },

    rules: {
      ...COMMON_IMPORT_RULES,

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      /**
       * Architecture governance
       */
      'import/no-commonjs': 'error',
    },
  },

  /**
   * -----------------------------------------------------------------------------
   * CommonJS tooling
   * -----------------------------------------------------------------------------
   */
  {
    files: [
      '**/*.cjs',
      '**/*.config.cjs',
      '**/commitlint.config.cjs',
      '**/.dependency-cruiser.cjs',
    ],

    extends: [tseslint.configs.disableTypeChecked],

    languageOptions: {
      sourceType: 'commonjs',

      globals: {
        module: 'readonly',
        require: 'readonly',

        __dirname: 'readonly',
        __filename: 'readonly',
      },

      parserOptions: {
        projectService: false,
      },
    },

    rules: {
      '@typescript-eslint/no-require-imports': 'off',

      'import/no-commonjs': 'off',
    },
  },

  /**
   * -----------------------------------------------------------------------------
   * Tests
   * -----------------------------------------------------------------------------
   */
  {
    files: TEST_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    plugins: {
      import: importPlugin,
    },

    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',

        expect: 'readonly',

        beforeEach: 'readonly',
        afterEach: 'readonly',

        vi: 'readonly',
      },
    },

    rules: {
      ...COMMON_IMPORT_RULES,

      'import/no-commonjs': 'off',
    },
  },

  /**
   * -----------------------------------------------------------------------------
   * Tooling / configuration files
   * -----------------------------------------------------------------------------
   */
  {
    files: TOOLING_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    plugins: {
      import: importPlugin,
    },

    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },

    rules: {
      ...COMMON_IMPORT_RULES,

      'import/no-commonjs': 'off',
    },
  },
);
