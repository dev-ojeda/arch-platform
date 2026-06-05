import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  external: [/^@arch\//],
  entry: ['src/index.ts'],
  sourcemap: false,
  splitting: false,
  treeshake: false,
  bundle: true,
  dts: false,
});
