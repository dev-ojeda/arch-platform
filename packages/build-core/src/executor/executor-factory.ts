// packages/build-core/src/executor/executor-factory.ts

import type { BuildExecutionContext } from './build-execution-context.js';
import { BuildExecutor } from './build-executor.js';

// executor-factory.ts

export class ExecutorFactory {
  create(context: BuildExecutionContext): BuildExecutor {
    return new BuildExecutor(context);
  }
}
