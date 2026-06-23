// eslint.config.mjs
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

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
  '**/vitest.shared.ts',
  '**/vitest.setup.ts',
  '**/tsup.config.ts',
  '**/tsup.base.ts',
  '**/tsup.library.ts',
  '**/tsup.app.ts',
  '**/eslint.config.mjs',
  '**/*.config.{js,cjs,mjs,ts}',
];

const TEST_FILES = ['**/*.test.ts', '**/*.spec.ts', '**/test/**/*.ts', '**/__tests__/**/*.ts'];

export default tseslint.config(
  {
    ignores: IGNORES,
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.cjs'],

    extends: [tseslint.configs.disableTypeChecked],

    languageOptions: {
      sourceType: 'commonjs',

      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },

    rules: {
      'import/no-commonjs': 'off',
    },
  },
  /**
   * CommonJS configs
   */
  {
    files: [
      '**/*.cjs',
      '**/*.config.cjs',
      '**/commitlint.config.cjs',
      '**/.dependency-cruiser.cjs',
    ],

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
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],

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

      'import/no-self-import': 'error',

      'import/no-duplicates': 'error',

      'import/no-unresolved': [
        'error',
        {
          commonjs: true,
          amd: true,
        },
      ],

      'import/first': 'error',

      'import/newline-after-import': 'error',

      'import/no-commonjs': 'error',

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

      'no-restricted-imports': [
        'error',
        {
          patterns: ['@arch/*/src/*', '@arch/*/dist/*', '../../*/src/*', '../../*/dist/*'],
        },
      ],
    },
  },

  {
    files: TEST_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    rules: {
      'no-restricted-imports': 'off',
    },
  },

  {
    files: TOOLING_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },

    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
