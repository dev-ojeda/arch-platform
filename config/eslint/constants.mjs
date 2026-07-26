export const CONFIG_TS_FILES = ['config/**/*.ts'];
export const SOURCE_FILES = [
  'packages/**/*.ts',
  'packages/**/*.tsx',
  'apps/**/*.ts',
  'apps/**/*.tsx',
];

/**
 * -----------------------------------------------------------------------------
 * Import Governance
 * -----------------------------------------------------------------------------
 */

export const RESTRICTED_IMPORTS = {
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
