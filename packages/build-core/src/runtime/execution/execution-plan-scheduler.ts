// packages/build-core/src/runtime/execution/execution-plan-scheduler.ts

import type { BuildResult } from '../../executor/build-result.js';
import type { BuildTaskRunner } from '../../graph/build-task-runner.js';
import { logger } from '../../logging/logger.js';
import type { ExecutionContext, ExecutionPlan } from '../../planning/execution-dag.js';

export class ExecutionPlanScheduler {
  constructor(
    private readonly runner: BuildTaskRunner,
    private readonly concurrency: number,
  ) {}

  async run(plan: ExecutionPlan, ctx: ExecutionContext): Promise<BuildResult[]> {
    const results: BuildResult[] = [];

    const running = new Map<string, Promise<void>>();

    const readyQueue = this.initializeReadyQueue(plan, ctx);

    while (readyQueue.length > 0 || running.size > 0) {
      this.dispatch(plan, ctx, readyQueue, running, results);

      if (running.size === 0 && readyQueue.length === 0) break;

      await Promise.race(running.values());
    }

    return results;
  }

  // ---------------------------
  // READY QUEUE INITIALIZATION
  // ---------------------------
  private initializeReadyQueue(plan: ExecutionPlan, ctx: ExecutionContext): string[] {
    const ready: string[] = [];

    for (const [name, node] of plan.nodes) {
      const deps = ctx.depsRemaining.get(name) ?? 0;

      if (deps === 0 && node.shouldRun) {
        ctx.state.set(name, 'ready');
        ready.push(name);
      }
    }

    return ready;
  }

  // ---------------------------
  // DISPATCH
  // ---------------------------
  private dispatch(
    plan: ExecutionPlan,
    ctx: ExecutionContext,
    readyQueue: string[],
    running: Map<string, Promise<void>>,
    results: BuildResult[],
  ): void {
    while (running.size < this.concurrency && readyQueue.length > 0) {
      const name = readyQueue.shift();
      if (!name) return;

      const node = plan.nodes.get(name);

      if (!node) {
        throw new Error(`Missing node in ExecutionPlan: ${name}`);
      }

      const task = this.execute(name, plan, ctx, results);

      running.set(
        name,
        task.finally(() => running.delete(name)),
      );
    }
  }

  // ---------------------------
  // EXECUTION
  // ---------------------------
  private async execute(
    name: string,
    plan: ExecutionPlan,
    ctx: ExecutionContext,
    results: BuildResult[],
  ): Promise<void> {
    try {
      ctx.state.set(name, 'running');

      const result = await this.runner.run(name);

      results.push(result);

      ctx.state.set(name, 'success');

      const node = plan.nodes.get(name);
      if (!node) return;

      for (const dep of node.dependents) {
        const current = ctx.depsRemaining.get(dep) ?? 0;
        const next = current - 1;

        ctx.depsRemaining.set(dep, next);

        const depNode = plan.nodes.get(dep);
        if (!depNode) continue;

        if (next === 0 && depNode.shouldRun) {
          ctx.state.set(dep, 'ready');
        }
      }
    } catch (error) {
      ctx.state.set(name, 'failed');

      logger.error('[execution-plan-scheduler] execution failed', {
        metadata: {
          package: name,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      results.push({
        package: name,
        status: 'failed',
        changeReason: 'none',
        execution: { reason: 'failed' },
        cache: { decision: 'miss', action: 'none' },
      });
    }
  }
}
