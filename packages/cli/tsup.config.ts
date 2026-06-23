// packages/cli/tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,

  entry: {
    index: 'src/index.ts',
  },

  banner: {
    js: '#!/usr/bin/env node',
  },

  dts: false,

  external: [/^@arch\//],
});
