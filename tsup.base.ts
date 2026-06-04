import type { Options } from 'tsup';

export const baseConfig: Options = {
  target: 'node20',

  platform: 'node',

  format: ['esm'],

  clean: true,

  sourcemap: true,

  treeshake: true,

  splitting: true,

  minify: false,

  metafile: false,

  bundle: true,

  shims: false,
};
