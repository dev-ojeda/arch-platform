// packages/build-core/src/executor/executor-factory.ts

import type { CommandRunner } from '../public/command-runner.js';

import type { BuildExecutor } from './build-executor.js';
import { DefaultBuildExecutor } from './default-build-executor.js';

/**
 * Factory responsible for creating the build executor.
 *
 * Encapsulates the construction of the executor implementation and
 * provides the required runtime dependencies.
 *
 * This factory should only handle object creation.
 * Build execution logic belongs to BuildExecutor.
 */
export class ExecutorFactory {
  /**
   * Creates a configured BuildExecutor instance.
   *
   * @param options Runtime dependencies required by the executor.
   *
   * @returns A build executor ready to execute package build steps.
   */
  create(options: { runner: CommandRunner }): BuildExecutor {
    return new DefaultBuildExecutor({
      runner: options.runner,
    });
  }
}
