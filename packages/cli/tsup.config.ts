import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.ts';

export default defineConfig({
  ...baseConfig,

  entry: ['src/index.ts'],

  format: ['esm'],

  dts: {
    resolve: true,
  },

  banner: {
    js: '#!/usr/bin/env node',
  },
});
