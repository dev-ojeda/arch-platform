// packages\contracts\tsup.config.ts
import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,

  external: [/^@arch\//],
  entry: {
    index: 'src/index.ts',
    context: 'src/context/index.ts',
    diagnostics: 'src/diagnostics/index.ts',
    engine: 'src/engine/index.ts',
    policies: 'src/policies/index.ts',
    rules: 'src/rules/index.ts',
    validate: 'src/validate/index.ts',
    workspace: 'src/workspace/index.ts',
  },
  sourcemap: false,
  splitting: false,
  treeshake: false,
  bundle: true,
  dts: false,
});
