import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';

import { RESTRICTED_IMPORTS } from '../constants.mjs';
import { TEST_FILES } from '../presets/test.mjs';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(currentDir, '../../../');

// ⚡ Optimización: Evita cargar los 30+ tsconfig.json del monorepo en cada paquete individual
const localTsconfig = resolve(process.cwd(), 'tsconfig.json');
const localTestTsconfig = resolve(process.cwd(), 'tsconfig.test.json');
const resolverProjects = [
  resolve(repositoryRoot, 'tsconfig.json'),
  ...(existsSync(localTsconfig) ? [localTsconfig] : []),
  ...(existsSync(localTestTsconfig) ? [localTestTsconfig] : []),
];

// Fallback si se ejecuta ESLint directamente desde la raíz del repositorio
if (resolverProjects.length === 1) {
  resolverProjects.push(
    resolve(repositoryRoot, 'packages/*/tsconfig.json'),
    resolve(repositoryRoot, 'packages/*/tsconfig.test.json'),
    resolve(repositoryRoot, 'packages/generators/*/tsconfig.json'),
    resolve(repositoryRoot, 'packages/generators/*/tsconfig.test.json'),
  );
}

export const COMMON_IMPORT_RULES = {
  // Reglas rápidas basadas solo en sintaxis y resolución de ruta
  'import-x/no-unresolved': 'error',
  'import-x/no-absolute-path': 'error',
  'import-x/no-self-import': 'error',
  'import-x/no-useless-path-segments': 'error',
  'import-x/export': 'error',
  'import-x/no-mutable-exports': 'error',
  'import-x/first': 'error',
  'import-x/no-duplicates': 'error',

  // Reglas pesadas: solo en CI o desactivadas porque TypeScript ya las garantiza
  'import-x/no-cycle': process.env.CI ? 'error' : 'off',
  'import-x/named': 'off',
  'import-x/default': 'off',
  'import-x/namespace': 'off',
  'import-x/no-named-as-default': 'off',
  'import-x/no-named-as-default-member': 'off',
  'import-x/no-deprecated': 'off',

  // Acotamos la búsqueda de package.json para acelerar en monorepo pnpm
  'import-x/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: TEST_FILES,
      packageDir: [repositoryRoot, process.cwd()],
    },
  ],

  // Ordenamiento estricto (muy rápido, solo lee el AST local)
  'import-x/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
      pathGroups: [
        {
          pattern: '@arch-platform/**',
          group: 'internal',
          position: 'before',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
      distinctGroup: false,
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
      sortTypesGroup: false,
    },
  ],

  'no-restricted-imports': ['error', RESTRICTED_IMPORTS],
};

const IMPORT_PARSERS = {
  'import-x/parsers': {
    '@typescript-eslint/parser': ['.ts', '.tsx'],
  },
};

const IMPORT_SETTINGS = {
  ...IMPORT_PARSERS,
  'import-x/resolver-next': [
    createTypeScriptImportResolver({
      alwaysTryTypes: false,
      noWarnOnMultipleProjects: true,
      project: resolverProjects,
    }),
    createNodeResolver(),
  ],
};

export function createImportSettings() {
  return IMPORT_SETTINGS;
}
