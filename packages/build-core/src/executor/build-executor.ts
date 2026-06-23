// packages/build-core/src/executor/build-executor.ts

import type { BuildResult } from '../cache/cache-types.js';
import type { DagNode } from '../graph/dag-types.js';
import { logger } from '../logging/logger.js';
import type { BuildPlanEntry } from '../planning/plan-entry.js';

import type { BuildExecutionContext } from './build-execution-context.js';

export class BuildExecutor {
  constructor(private ctx: BuildExecutionContext) {}

  async execute(node: DagNode, plan: BuildPlanEntry): Promise<BuildResult> {
    const start = Date.now();

    for (const step of this.ctx.steps) {
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

          executionReason: plan.executionReason,

          cacheDecision: plan.cacheDecision,

          meta: {
            exitCode: res.exitCode,
            durationMs: Date.now() - start,
            step: step.name,
          },
        };
      }
    }

    return {
      package: node.name,

      status: 'success',

      changeReason: plan.changeReason,

      executionReason: plan.executionReason,

      cacheDecision: plan.cacheDecision,

      meta: {
        exitCode: 0,
        durationMs: Date.now() - start,
      },
    };
  }
}
