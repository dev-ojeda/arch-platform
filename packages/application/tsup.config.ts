// packages/application/tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.ts';

export default defineConfig({
  ...baseConfig,

  metafile: true,

  entry: ['src/index.ts'],
});
