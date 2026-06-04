// packages\generators\mvc\tsup.config.tsi
import { defineConfig } from 'tsup';

import { baseConfig } from '../../../tsup.base.js';

export default defineConfig({
  ...baseConfig,

  entry: {
    index: 'src/index.ts',
    definition: 'src/definition/index.ts',
    variables: 'src/variables/index.ts',
  },

  sourcemap: false,
  splitting: false,
  treeshake: false,
  bundle: true,
  dts: false,
});
