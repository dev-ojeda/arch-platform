// tsup.base.ts

import type { Options } from 'tsup';

export const baseConfig: Options = {
  target: 'node20',

  platform: 'node',

  format: ['esm'],

  sourcemap: true,

  treeshake: true,

  minify: false,

  metafile: false,

  bundle: true,

  shims: false,

  splitting: false,

  clean: false,
};
