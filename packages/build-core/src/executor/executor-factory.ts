// packages/build-core/src/executor/executor-factory.ts

import type { CommandRunner } from '../runtime/command-runner.js';

import { BuildExecutor } from './build-executor.js';

export class ExecutorFactory {
  create(options: { runner: CommandRunner }) {
    return new BuildExecutor({
      runner: options.runner,
    });
  }
}
