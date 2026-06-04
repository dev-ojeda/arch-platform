// packages/application/tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  external: [/^@arch\//],

  entry: {
    index: 'src/index.ts',

    generation: 'src/generation/index.ts',

    runtime: 'src/runtime/index.ts',

    useCases: 'src/use-cases/generate-project/index.ts',
    testing: 'src/testing/index.ts',
  },

  bundle: false,
  dts: false,
});
