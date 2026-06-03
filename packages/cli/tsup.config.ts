import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
  bundle: false,
  dts: false,

  banner: {
    js: '#!/usr/bin/env node',
  },
});
