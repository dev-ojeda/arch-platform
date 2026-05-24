// eslint.config.mjs

import tseslint from 'typescript-eslint';

import tsParser from '@typescript-eslint/parser';

import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/.turbo/**', '**/node_modules/**'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        project: [
          './tsconfig.eslint.json',

          './packages/*/tsconfig.json',

          './packages/generators/*/tsconfig.json',

          './apps/*/tsconfig.json',
        ],

        tsconfigRootDir: import.meta.dirname,

        sourceType: 'module',
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,

      import: importPlugin,
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,

          project: [
            './tsconfig.eslint.json',

            './packages/*/tsconfig.json',

            './packages/generators/*/tsconfig.json',

            './apps/*/tsconfig.json',
          ],
        },

        node: {
          extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx'],
        },
      },
    },

    rules: {
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

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'always',
          mjs: 'always',

          ts: 'never',
          tsx: 'never',
        },
      ],

      'import/no-cycle': 'error',

      'import/no-self-import': 'error',

      'import/no-duplicates': 'error',

      'import/no-unresolved': 'off',

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          'newlines-between': 'always',
        },
      ],

      'import/first': 'error',

      'import/newline-after-import': 'error',

      'no-restricted-imports': [
        'error',
        {
          patterns: ['@arch/*/src/*', '@arch/*/dist/*', '../../*/src/*', '../../*/dist/*'],
        },
      ],
    },
  },
];
