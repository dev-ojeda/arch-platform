import { defineConfig } from 'tsup';

import { createBaseConfig } from './base.js';
import type { ConfigOverrides } from './types.js';

export function createCliConfig(overrides: ConfigOverrides = {}) {
  return defineConfig({
    ...createBaseConfig(),

    entry: ['src/bin.ts'],

    bundle: true,

    dts: false,

    sourcemap: true,

    ...overrides,
  });
}
