// tsup.library.ts

import { baseConfig } from './tsup.base.js';

export const libraryConfig = {
  ...baseConfig,

  clean: false,

  dts: false,

  external: ['vitest', /^@arch\//],
};
