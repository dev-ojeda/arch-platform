// packages/application/tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.ts';

export default defineConfig({
  ...baseConfig,

  metafile: true,
  tsconfig: './tsconfig.build.json',
  entry: ['src/index.ts'],
  dts: false,
});
