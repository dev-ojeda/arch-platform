// packages\application\test\test-pipeline-execution.ts
import type { GenerationContext } from '@arch/contracts/generation';

import type { RuntimeBootstrap } from '../src/runtime/runtime-bootstrap.js';

export interface TestPipelineExecution {
  context: GenerationContext;

  runtime: RuntimeBootstrap;
}
