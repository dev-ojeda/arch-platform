import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  entry: {
    conventions: 'src/conventions/index.ts',
    domain: 'src/domain/index.ts',
    errors: 'src/errors/index.ts',
    events: 'src/events/index.ts',
    filesystem: 'src/filesystem/index.ts',
    generation: 'src/generation/index.ts',
    logging: 'src/logging/index.ts',
    registry: 'src/registry/index.ts',
    templates: 'src/templates/index.ts',
  },
  bundle: true,
  dts: false,
  sourcemap: false,
  splitting: false,
  treeshake: false,
});
