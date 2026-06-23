// packages\infrastructure\tsup.config.ts
import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  external: ['vitest', /^@arch\//],
  entry: {
    index: 'src/index.ts',
  },
  dts: false,
  clean: false,
});
