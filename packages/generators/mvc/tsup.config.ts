// packages\generators\mvc\tsup.config.tsi
import { defineConfig } from 'tsup';

import { baseConfig } from '../../../tsup.base.ts';

export default defineConfig({
  ...baseConfig,

  tsconfig: './tsconfig.build.json',

  entry: ['src/index.ts'],

  format: ['esm'],

  bundle: true,

  splitting: false,

  dts: false,
});
