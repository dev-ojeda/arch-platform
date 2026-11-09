// config/tsup/base.ts

import type { Options } from 'tsup';

export function createBaseConfig(): Options {
  return {
    clean: false,
    format: ['esm'],
    platform: 'node',
    target: 'node22',
    sourcemap: false,
    splitting: false,
    bundle: false,
    treeshake: true,
    minify: false,
    shims: false,
  };
}
