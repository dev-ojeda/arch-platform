// packages\infrastructure\tsup.config.ts
import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
  },
  bundle: true,
  dts: false,
  sourcemap: false,
  splitting: false,
  treeshake: false,
});
