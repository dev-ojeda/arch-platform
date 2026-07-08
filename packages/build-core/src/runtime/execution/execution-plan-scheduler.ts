// packages/build-core/src/runtime/execution/execution-plan-scheduler.ts

import type { BuildResult } from '../../executor/build-result.js';
import type { BuildTaskRunner } from '../../graph/build-task-runner.js';
import { logger } from '../../logging/logger.js';
import type { ExecutionNode, ExecutionPlan } from '../../planning/execution-dag.js';

import { updateExecutionState, type ExecutionContext } from './execution-context.js';

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

      if (running.size > 0) {
        await Promise.race(running.values());
      }
    }

    return results;
  }

  private initializeReadyQueue(plan: ExecutionPlan, ctx: ExecutionContext): string[] {
    const ready: string[] = [];

    for (const [name, node] of plan.nodes) {
      if (node.dependencies.length > 0) {
        continue;
      }

      updateExecutionState(ctx, name, 'ready');

      ready.push(name);
    }

    return ready;
  }

  private dispatch(
    plan: ExecutionPlan,
    ctx: ExecutionContext,
    readyQueue: string[],
    running: Map<string, Promise<void>>,
    results: BuildResult[],
  ): void {
    while (running.size < this.concurrency && readyQueue.length > 0) {
      const name = readyQueue.shift();

      if (!name) {
        return;
      }

      const task = this.execute(name, plan, ctx, readyQueue, results);

      running.set(
        name,
        task.finally(() => {
          running.delete(name);
        }),
      );
    }
  }

  private async execute(
    name: string,
    plan: ExecutionPlan,
    ctx: ExecutionContext,
    readyQueue: string[],
    results: BuildResult[],
  ): Promise<void> {
    try {
      updateExecutionState(ctx, name, 'running');

      const result = await this.runner.run(name);

      const trigger = ctx.triggers.get(name);

      if (trigger) {
        result.execution.triggeredBy = trigger;
      }

      results.push(result);

      updateExecutionState(ctx, name, 'success');

      const node = plan.nodes.get(name);

      if (node) {
        this.notifyDependentsReady(node, plan, ctx, readyQueue);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      updateExecutionState(ctx, name, 'failed', message);

      logger.error('[execution-plan-scheduler] execution failed', {
        metadata: {
          package: name,
          error: message,
        },
      });

      results.push({
        package: name,
        status: 'failed',
        changeReason: 'none',
        execution: {
          reason: 'failed',
        },
      });

      const node = plan.nodes.get(name);

      if (node) {
        this.notifyDependentsFailed(node, plan, ctx, results);
      }
    }
  }

  private notifyDependentsReady(
    node: ExecutionNode,
    plan: ExecutionPlan,
    ctx: ExecutionContext,
    readyQueue: string[],
  ): void {
    for (const dependent of node.dependents) {
      const depNode = plan.nodes.get(dependent);

      if (!depNode) {
        continue;
      }

      const current = ctx.nodes.get(dependent);

      if (!current || current.state !== 'pending') {
        continue;
      }

      const ready = depNode.dependencies.every(
        (dependency) => ctx.nodes.get(dependency)?.state === 'success',
      );

      if (!ready) {
        continue;
      }

      updateExecutionState(ctx, dependent, 'ready');

      ctx.triggers.set(dependent, {
        package: node.name,
        reason: 'dependency-changed',
      });

      readyQueue.push(dependent);
    }
  }

  private notifyDependentsFailed(
    node: ExecutionNode,
    plan: ExecutionPlan,
    ctx: ExecutionContext,
    results: BuildResult[],
  ): void {
    for (const dependent of node.dependents) {
      const current = ctx.nodes.get(dependent);

      if (!current || current.state !== 'pending') {
        continue;
      }

      updateExecutionState(ctx, dependent, 'skipped', `Dependency ${node.name} failed`);

      results.push({
        package: dependent,
        status: 'skipped',
        changeReason: 'dependency-failed',
        execution: {
          reason: 'failed',
        },
      });
    }
  }
}
