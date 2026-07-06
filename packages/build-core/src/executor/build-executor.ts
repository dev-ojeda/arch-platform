// packages/build-core/src/executor/build-executor.ts

import type { DagNode } from '../graph/dag-types.js';
import { logger } from '../logging/logger.js';
import type { BuildPlanEntry } from '../planning/plan-entry.js';

import type { BuildExecutionContext } from './build-execution-context.js';
import type { BuildResult } from './build-result.js';
import { createBuildSteps } from './build-step-factory.js';

export class BuildExecutor {
  constructor(private ctx: BuildExecutionContext) {}

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

          cache: {
            action: plan.cache.action,
            decision: plan.cache.decision,
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

      cache: {
        action: plan.cache.action,
        decision: plan.cache.decision,
      },
    };
  }
}
