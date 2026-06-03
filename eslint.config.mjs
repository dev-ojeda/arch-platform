// eslint.config.mjs

import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

const IGNORE_PATTERNS = ['**/dist/**', '**/coverage/**', '**/.turbo/**', '**/node_modules/**'];
const TOOLING_FILES = [
  '**/vitest.config.ts',
  '**/tsup.config.ts',
  'vitest.shared.ts',
  'vitest.workspace.ts',
  'tsup.base.ts',
  'eslint.config.mjs',
];
export default tseslint.config(
  {
    ignores: IGNORE_PATTERNS,
  },

  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ['**/*.ts'],

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
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      // ----------------------------------------------------
      // TypeScript
      // ----------------------------------------------------

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

      // ----------------------------------------------------
      // Imports
      // ----------------------------------------------------

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'always',
          mjs: 'always',
          ts: 'never',
        },
      ],

      'import/no-self-import': 'error',

      'import/no-duplicates': 'error',

      'import/no-unresolved': 'off',

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

      // ----------------------------------------------------
      // Architecture
      // ----------------------------------------------------

      'no-restricted-imports': [
        'error',
        {
          patterns: ['@arch/*/src/*', '@arch/*/dist/*', '../../*/src/*', '../../*/dist/*'],
        },
      ],
    },
  },
  {
    files: ['**/test/**/*.ts', '**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],

    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: TOOLING_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        projectService: false,
      },
    },

    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
