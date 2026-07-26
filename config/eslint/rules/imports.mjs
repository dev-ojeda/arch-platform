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
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],

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
    },
  ],
  'no-restricted-imports': ['error', RESTRICTED_IMPORTS],
};

const IMPORT_PARSERS = {
  'import/parsers': {
    '@typescript-eslint/parser': ['.ts'],
  },
};

const IMPORT_SETTINGS = {
  IMPORT_PARSERS,

  'import/resolver': {
    typescript: {
      project: ['./tsconfig.json'],
    },

    node: {
      extensions: ['.js', '.ts'],
    },
  },
};

const IMPORT_SETTINGS_NO_NODE = {
  IMPORT_PARSERS,

  'import/resolver': {
    typescript: {
      project: ['./config/tsconfig.json'],
    },
  },
};

export function createImportSettings(project = '') {
  switch (project) {
    case './tsconfig.json':
      return IMPORT_SETTINGS;
    case './config/tsconfig.json':
      return IMPORT_SETTINGS_NO_NODE;
    default:
      break;
  }
}
