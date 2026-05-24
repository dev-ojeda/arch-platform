// tsup.base.ts
import type { Options } from 'tsup';

export const baseConfig: Options = {
  target: 'node20',

  platform: 'node',

  clean: true,

  sourcemap: true,

  treeshake: false,

  splitting: false,

  minify: false,

  metafile: false,

  bundle: false,

  shims: false,
};
