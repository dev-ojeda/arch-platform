import { RESTRICTED_IMPORTS } from '../constants.mjs';

export const COMMON_IMPORT_RULES = {
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

      pathGroupsExcludedImportTypes: ['builtin'],

      distinctGroup: false,

      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },

      'newlines-between': 'always',

      sortTypesGroup: false,
    },
  ],

  'no-restricted-imports': ['error', RESTRICTED_IMPORTS],
};

const IMPORT_PARSERS = {
  'import/parsers': {
    '@typescript-eslint/parser': ['.ts', '.tsx'],
  },
};

const IMPORT_SETTINGS = {
  ...IMPORT_PARSERS,

  'import/resolver': {
    typescript: {
      project: ['./config/tsconfig/eslint.json'],
    },

    node: {
      extensions: ['.js', '.ts'],
    },
  },
};

const CONFIG_IMPORT_SETTINGS = {
  ...IMPORT_PARSERS,

  'import/resolver': {
    typescript: {
      project: ['./config/tsconfig/eslint.json'],
    },

    node: {
      extensions: ['.js', '.ts'],
    },
  },
};

export function createImportSettings() {
  return IMPORT_SETTINGS;
}
export function createConfigImportSettings() {
  return CONFIG_IMPORT_SETTINGS;
}
