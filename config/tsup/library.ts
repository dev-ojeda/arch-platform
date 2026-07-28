// config/tsup/library.ts

import { defineConfig } from 'tsup';

import { createBaseConfig } from './base.js';
import type { ConfigOverrides } from './types.js';

export function createLibraryConfig(overrides: ConfigOverrides = {}) {
  return defineConfig({
    ...createBaseConfig(),

    entry: ['src/index.ts'],

    dts: false,

    splitting: false,

    clean: false,

    ...overrides,
  });
}
