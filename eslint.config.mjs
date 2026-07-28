// eslint.config.mjs

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

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
} from './config/eslint/rules/architecture.mjs';
import {
  COMMON_IMPORT_RULES,
  createConfigImportSettings,
  createImportSettings,
} from './config/eslint/rules/imports.mjs';
import { COMMON_TS_RULES, TYPESCRIPT_LANGUAGE_OPTIONS } from './config/eslint/rules/typescript.mjs';

export default tseslint.config(
  /**
   * Global ignores
   */
  {
    ignores: IGNORES,
  },

  /**
   * ESLint base
   */
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  /**
   * -----------------------------------------------------------------------------
   * Config source
   * -----------------------------------------------------------------------------
   */
  {
    files: CONFIG_TS_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    plugins: ESLINT_PLUGINS,

    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },

    settings: createConfigImportSettings(),

    rules: {
      ...COMMON_IMPORT_RULES,
      ...COMMON_TS_RULES,
    },
  },
  /**
   * -----------------------------------------------------------------------------
   * Application source
   * -----------------------------------------------------------------------------
   */
  {
    files: SOURCE_FILES,
    languageOptions: TYPESCRIPT_LANGUAGE_OPTIONS,

    plugins: ESLINT_PLUGINS,

    settings: createImportSettings(),

    rules: {
      ...COMMON_IMPORT_RULES,
      ...COMMON_TS_RULES,
      ...ARCHITECTURE_RULES,
    },
  },

  /**
   * -----------------------------------------------------------------------------
   * CommonJS tooling
   * -----------------------------------------------------------------------------
   */
  {
    files: COMMONJS_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    plugins: ESLINT_PLUGINS,

    languageOptions: COMMONJS_LANGUAGE_OPTIONS,

    rules: {
      ...COMMON_IMPORT_RULES,
      ...ARCHITECTURE_RULES_NO_COMMONJS,
    },
  },

  /**
   * -----------------------------------------------------------------------------
   * Tests
   * -----------------------------------------------------------------------------
   */
  {
    files: TEST_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    plugins: ESLINT_PLUGINS,

    languageOptions: TEST_LANGUAGE_OPTIONS,

    rules: {
      ...COMMON_IMPORT_RULES,
      ...COMMON_TS_RULES,
      ...ARCHITECTURE_RULES_NO_COMMONJS,
    },
  },

  /**
   * -----------------------------------------------------------------------------
   * Tooling / configuration files
   * -----------------------------------------------------------------------------
   */
  {
    files: TOOLING_FILES,

    extends: [tseslint.configs.disableTypeChecked],

    plugins: ESLINT_PLUGINS,

    languageOptions: TOOLING_LANGUAGE_OPTIONS,

    settings: createImportSettings(),

    rules: {
      ...COMMON_IMPORT_RULES,
      ...ARCHITECTURE_RULES_NO_COMMONJS,
    },
  },
);
