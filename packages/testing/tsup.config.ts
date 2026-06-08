// packages\testing\tsup.config.ts
import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

const PIPELINE_ENTRIES = {
  // reusable command runtimes
  'pipeline/pipeline-context': 'src/pipeline/create-test-pipeline-context.ts',
  'pipeline/steps': 'src/pipeline/steps/execute-step.ts',
} as const;
export default defineConfig({
  ...baseConfig,
  external: ['vitest', /^@arch\//],
  entry: {
    index: 'src/index.ts',
    contracts: 'src/contracts/index.ts',
    ...PIPELINE_ENTRIES,
    events: 'src/events/index.ts',
    generation: 'src/generation/index.ts',
    logging: 'src/logging/index.ts',
    pipeline: 'src/pipeline/index.ts',
    prompts: 'src/prompts/index.ts',
    runtime: 'src/runtime/index.ts',
    filesystem: 'src/filesystem/index.ts',
    fixtures: 'src/fixtures/index.ts',
    snapshots: 'src/snapshots/index.ts',
    utils: 'src/utils/index.ts',
  },
  sourcemap: false,

  treeshake: false,

  splitting: false,
  dts: false,
  bundle: true,
});
