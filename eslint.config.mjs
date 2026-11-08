// eslint.config.mjs
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import {
  configs as tslintConfigs,
  parser as tslintParser,
  plugin as tslintPlugin,
} from 'typescript-eslint';

import { ESLINT_PLUGINS } from './config/eslint/base.mjs';
import { CONFIG_TS_FILES, SOURCE_FILES } from './config/eslint/constants.mjs';
import { IGNORES } from './config/eslint/global.mjs';
import { TEST_FILES, TEST_LANGUAGE_OPTIONS } from './config/eslint/presets/test.mjs';
import {
  COMMONJS_FILES,
  COMMONJS_LANGUAGE_OPTIONS,
  TOOLING_FILES,
  TOOLING_LANGUAGE_OPTIONS,
} from './config/eslint/presets/tooling.mjs';
import {
  ARCHITECTURE_RULES,
  ARCHITECTURE_RULES_NO_COMMONJS,
  NO_BARREL_STAR_EXPORT_RULE,
} from './config/eslint/rules/architecture.mjs';
import { COMMON_IMPORT_RULES, createImportSettings } from './config/eslint/rules/imports.mjs';
import {
  COMMON_TS_RULES,
  TYPESCRIPT_LANGUAGE_OPTIONS,
  TYPE_CHECKED_TS_RULES,
} from './config/eslint/rules/typescript.mjs';

const repositoryRoot = dirname(fileURLToPath(import.meta.url));

// ⚡ Optimización: Carga únicamente el tsconfig.test.json del paquete en ejecución
const localTestTsconfig = resolve(process.cwd(), 'tsconfig.test.json');
const testProjects = existsSync(localTestTsconfig)
  ? [localTestTsconfig]
  : ['./packages/*/tsconfig.test.json', './packages/generators/*/tsconfig.test.json'];

const TS_PLUGIN_DEFINITION = {
  '@typescript-eslint': tslintPlugin,
};

// 1. Extraemos dinámicamente el diccionario de todas las reglas del preset tipado oficial.
const ALL_TYPE_CHECKED_RULES = tslintConfigs.recommendedTypeChecked.reduce((acc, config) => {
  return { ...acc, ...config.rules };
}, {});

// 2. Creamos un objeto de mitigación que apaga masivamente todas las reglas que exigen un tsconfig activo.
const DISABLE_ALL_TYPE_CHECKED_RULES = Object.keys(ALL_TYPE_CHECKED_RULES).reduce((acc, rule) => {
  if (rule.startsWith('@typescript-eslint/')) {
    acc[rule] = 'off';
  }
  return acc;
}, {});

export default defineConfig(
  /**
   * 1. Global ignores
   */
  {
    ignores: IGNORES,
  },

  /**
   * 2. Global Presets, Resolvers Compartidos & Gobernanza Universal
   */
  eslint.configs.recommended,
  {
    settings: createImportSettings(),
    rules: {
      ...NO_BARREL_STAR_EXPORT_RULE,
    },
  },

  /**
   * 3. Application source
   */
  {
    files: SOURCE_FILES,
    languageOptions: TYPESCRIPT_LANGUAGE_OPTIONS,
    plugins: {
      ...ESLINT_PLUGINS,
      ...TS_PLUGIN_DEFINITION,
    },
    rules: {
      ...TYPE_CHECKED_TS_RULES,
      ...COMMON_IMPORT_RULES,
      ...COMMON_TS_RULES,
      ...ARCHITECTURE_RULES,
      // ⚡ Optimización: tsc ya valida las rutas en typecheck; en CI se mantiene activo
      'import-x/no-unresolved': process.env.CI ? 'error' : 'off',
    },
  },

  /**
   * 4. Config source
   */
  {
    files: CONFIG_TS_FILES,
    ignores: ['packages/*/src/**', 'packages/generators/*/src/**'],
    plugins: {
      ...ESLINT_PLUGINS,
      ...TS_PLUGIN_DEFINITION,
    },
    languageOptions: {
      parser: tslintParser,
      parserOptions: {
        projectService: false,
      },
    },
    rules: {
      ...DISABLE_ALL_TYPE_CHECKED_RULES,
      ...COMMON_IMPORT_RULES,
      ...COMMON_TS_RULES,
      'import-x/no-extraneous-dependencies': 'off',
    },
  },

  /**
   * 5. CommonJS tooling
   */
  {
    files: COMMONJS_FILES,
    plugins: ESLINT_PLUGINS,
    languageOptions: COMMONJS_LANGUAGE_OPTIONS,
    rules: {
      ...DISABLE_ALL_TYPE_CHECKED_RULES,
      ...COMMON_IMPORT_RULES,
      ...ARCHITECTURE_RULES_NO_COMMONJS,
    },
  },

  /**
   * 6. Tests
   */
  {
    files: TEST_FILES,
    plugins: {
      ...ESLINT_PLUGINS,
      ...TS_PLUGIN_DEFINITION,
    },
    languageOptions: {
      ...TEST_LANGUAGE_OPTIONS,
      parser: tslintParser,
      parserOptions: {
        projectService: false,
        project: testProjects,
        tsconfigRootDir: repositoryRoot,
      },
    },
    rules: {
      ...TYPE_CHECKED_TS_RULES,
      ...COMMON_IMPORT_RULES,
      ...COMMON_TS_RULES,
      ...ARCHITECTURE_RULES_NO_COMMONJS,
      'import-x/no-unresolved': process.env.CI ? 'error' : 'off',
    },
  },

  /**
   * 7. Tooling / configuration files
   */
  {
    files: TOOLING_FILES,
    ignores: ['packages/*/src/**', 'packages/generators/*/src/**'],
    plugins: {
      ...ESLINT_PLUGINS,
      ...TS_PLUGIN_DEFINITION,
    },
    languageOptions: {
      ...TOOLING_LANGUAGE_OPTIONS,
      parser: tslintParser,
      parserOptions: {
        ...TOOLING_LANGUAGE_OPTIONS.parserOptions,
        projectService: false,
      },
    },
    rules: {
      ...DISABLE_ALL_TYPE_CHECKED_RULES,
      ...COMMON_IMPORT_RULES,
      ...COMMON_TS_RULES,
      ...ARCHITECTURE_RULES_NO_COMMONJS,
      'import-x/named': 'off',
      'import-x/no-cycle': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
);
