// packages/build-core/src/executor/build-execution-context.ts

import type { CommandRunner } from '../public/command-runner.js';

export type BuildExecutionContext = {
  runner: CommandRunner;
};
