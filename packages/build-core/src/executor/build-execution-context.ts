// packages/build-core/src/executor/build-execution-context.ts

import type { CommandRunner } from '../runtime/command-runner.js';

export type BuildExecutionContext = {
  runner: CommandRunner;
};
