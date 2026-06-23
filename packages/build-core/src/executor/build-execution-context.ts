// packages/build-core/src/executor/build-execution-context.ts

import type { CommandRunner } from '../runtime/command-runner.js';

import type { BuildStep } from './build-steps.js';

export interface BuildExecutionContext {
  steps: readonly BuildStep[];
  runner: CommandRunner;
}
