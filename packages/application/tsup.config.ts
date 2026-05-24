// packages/application/tsup.config.ts
import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.ts';

export default defineConfig({
  ...baseConfig,

  entry: ['src/index.ts'],

  format: ['esm'],

  dts: true,

  metafile: true,

  tsconfig: './tsconfig.build.json',
});
