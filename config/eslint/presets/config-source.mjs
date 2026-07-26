import tseslint from 'typescript-eslint';

import { IMPORT_PLUGIN } from '../base.mjs';
import { COMMON_IMPORT_RULES } from '../rules/imports.mjs';
import { COMMON_TS_RULES } from '../rules/typescript.mjs';

export default {
  files: ['config/**/*.ts'],

  languageOptions: {
    parser: tseslint.parser,

    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },

  plugins: {
    import: IMPORT_PLUGIN,
  },

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },

    'import/resolver': {
      typescript: {
        project: ['./config/tsconfig.json'],
      },
    },
  },

  rules: {
    ...COMMON_IMPORT_RULES,
    ...COMMON_TS_RULES,
  },
};
