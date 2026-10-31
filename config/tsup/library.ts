// config/tsup/library.ts

import { defineConfig } from 'tsup';

import { createBaseConfig } from './base.js';
import type { ConfigOverrides } from './types.js';

export function createLibraryConfig(overrides: ConfigOverrides = {}) {
  return defineConfig({
    ...createBaseConfig(),
    entry: ['src/bin-cli.ts'],
    noExternal: [/@arch-platform\//],
    shims: false,
    bundle: true,
    dts: false,
    minify: true,
    ...overrides,
  });
}
