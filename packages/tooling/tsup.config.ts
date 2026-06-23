// packages/tooling/tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,

  entry: {
    index: 'src/index.ts',
  },

  dts: false,

  external: [/^@arch\//, 'execa'],
});
