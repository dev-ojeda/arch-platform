// packages\contracts\tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

export default defineConfig({
  ...baseConfig,
  external: [/^@arch\//],
  entry: {
    index: 'src/index.ts',
    filesystem: 'src/filesystem/index.ts',
    generators: 'src/generators/index.ts',
    generation: 'src/generation/index.ts',
    hooks: 'src/hooks/index.ts',
    diagnostics: 'src/diagnostics/index.ts',
    events: 'src/events/index.ts',
    stacks: 'src/stacks/index.ts',
    variables: 'src/variables/index.ts',
    'get-string-variable': 'src/variables/get-string-variable.ts',
    logging: 'src/logging/index.ts',
    runtime: 'src/runtime/index.ts',
    templates: 'src/templates/index.ts',
    languages: 'src/languages/index.ts',
    prompts: 'src/prompts/index.ts',
    telemetry: 'src/telemetry/index.ts',
    exporters: 'src/exporters/index.ts',
    reports: 'src/reports/index.ts',
    pipeline: 'src/pipeline/index.ts',
  },
  sourcemap: false,
  splitting: false,
  treeshake: false,
  bundle: true,
  dts: false,
});
