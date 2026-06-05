// packages\platform-model\tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
  sourcemap: false,
  splitting: false,
  treeshake: false,
  bundle: true,
  dts: false,
});
