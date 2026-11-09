// config/eslint/rules/typescript.mjs

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parser } from 'typescript-eslint';

const currentDir = dirname(fileURLToPath(import.meta.url));

const repositoryRoot = resolve(currentDir, '../../../');

export const TYPESCRIPT_LANGUAGE_OPTIONS = {
  parser: parser,
  parserOptions: {
    projectService: true,
    tsconfigRootDir: repositoryRoot,
  },
};

export const COMMON_TS_RULES = {
  'no-unused-vars': 'off',
  'no-redeclare': 'off',
  'no-undef': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
};

export const TYPE_CHECKED_TS_RULES = {
  // Apagado porque ts-morph gobierna import type (solo interfaces/types, no clases)
  '@typescript-eslint/consistent-type-imports': 'off',

  // Activo para garantizar export type en interfaces/types tanto en src/ como en test/
  '@typescript-eslint/consistent-type-exports': [
    'error',
    {
      fixMixedExportsWithInlineTypeSpecifier: true,
    },
  ],
};
