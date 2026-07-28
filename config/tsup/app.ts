// config/tsup/app.ts

import { defineConfig } from 'tsup';

import { createBaseConfig } from './base.js';
import type { ConfigOverrides } from './types.js';

export function createCliConfig(overrides: ConfigOverrides = {}) {
  return defineConfig({
    ...createBaseConfig(),

    entry: ['src/bin.ts'],

    dts: false,

    banner: {
      js: '#!/usr/bin/env node',
    },

    ...overrides,
  });
}
