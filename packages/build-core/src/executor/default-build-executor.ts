// packages/build-core/src/executor/default-build-executor.ts

import type { DagNode } from '@arch/platform-model';

import { logger } from '../logging/logger.js';
import type { BuildPlanEntry } from '../planning/plan-entry.js';

import type { BuildExecutionContext } from './build-execution-context.js';
import type { BuildExecutor } from './build-executor.js';
import type { BuildResult } from './build-result.js';
import { createBuildSteps } from './build-step-factory.js';

/**
 * Executes the build steps associated with a package.
 *
 * Responsible for translating build configuration into executable steps,
 * running commands through the provided command runner, and producing
 * a normalized BuildResult.
 *
 * This component does not decide:
 * - Which packages should be built.
 * - Whether a package requires rebuilding.
 * - How execution order is determined.
 *
 * Those decisions belong to planning and scheduling components.
 */
export class DefaultBuildExecutor implements BuildExecutor {
  constructor(private ctx: BuildExecutionContext) {}
  /**
   * Executes all build steps for a package.
   *
   * Execution stops immediately when a step fails.
   *
   * @param node Package node containing build metadata and workspace location.
   * @param plan Build plan entry containing execution context and change reason.
   *
   * @returns The result of the package build execution.
   */
  async execute(node: DagNode, plan: BuildPlanEntry): Promise<BuildResult> {
    const steps = createBuildSteps(node.build);

    for (const step of steps) {
      const res = await this.ctx.runner(step.command, step.args, {
        cwd: node.root,
      });

      if (res.exitCode !== 0) {
        logger.error('step failed', {
          metadata: {
            package: node.name,
            step: step.name,
            exitCode: res.exitCode,
            stdout: res.stdout,
            stderr: res.stderr,
          },
        });

        return {
          package: node.name,

          status: 'failed',

          changeReason: plan.changeReason,

          execution: {
            reason: 'failed',
          },
        };
      }
    }

    return {
      package: node.name,
      status: 'success',

      changeReason: plan.changeReason,

      execution: {
        reason: 'executed',
      },
    };
  }
}
