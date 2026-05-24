import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.ts';

export default defineConfig({
  ...baseConfig,

  entry: ['src/index.ts'],

  format: ['esm', 'cjs'],

  dts: true,

  tsconfig: './tsconfig.build.json',

  banner: {
    js: '#!/usr/bin/env node',
  },
});
