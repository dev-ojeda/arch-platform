// config/paths/config.ts

import { resolve } from 'node:path';

import { CONFIG_ROOT } from './workspace.js';

export const ESLINT_ROOT = resolve(CONFIG_ROOT, 'eslint');

export const TSUP_ROOT = resolve(CONFIG_ROOT, 'tsup');

export const TSCONFIG_ROOT = resolve(CONFIG_ROOT, 'tsconfig');

export const VITEST_ROOT = resolve(CONFIG_ROOT, 'vitest');

export const VITEST_SETUP_FILE = resolve(VITEST_ROOT, 'setup.ts');

export const VITEST_SHARED_CONFIG = resolve(VITEST_ROOT, 'shared.ts');
