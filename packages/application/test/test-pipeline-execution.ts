// packages\application\test\test-pipeline-execution.ts
import type { GenerationContext } from '@arch-platform/contracts';

import type { RuntimeBootstrap } from '../src/runtime/runtime-bootstrap.js';

export interface TestPipelineExecution {
  context: GenerationContext;

  runtime: RuntimeBootstrap;
}
