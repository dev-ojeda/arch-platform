// packages/build-core/src/runtime/execution/execution-plan-scheduler.ts

import type { BuildResult } from '../../executor/build-result.js';
import type { BuildTaskRunner } from '../../graph/build-task-runner.js';
import { logger } from '../../logging/logger.js';
import type { ExecutionNode, ExecutionPlan } from '../../planning/execution-dag.js';

import type { ExecutionContext } from './execution-context.js';

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

      if (running.size === 0) {
        break;
      }

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
      if (node.dependencies.length !== 0) {
        continue;
      }

      ctx.nodeStates.set(name, 'ready');
      ready.push(name);
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

      if (!name) {
        return;
      }

      if (!plan.nodes.has(name)) {
        throw new Error(`Missing node in ExecutionPlan: ${name}`);
      }

      const task = this.execute(name, plan, ctx, readyQueue, results);

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
    readyQueue: string[],
    results: BuildResult[],
  ): Promise<void> {
    try {
      ctx.nodeStates.set(name, 'running');

      const result = await this.runner.run(name);

      results.push(result);

      ctx.nodeStates.set(name, 'success');

      const node = plan.nodes.get(name);

      if (!node) {
        return;
      }

      this.notifyDependentsReady(node, plan, ctx, readyQueue);
    } catch (error) {
      ctx.nodeStates.set(name, 'failed');

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
        execution: {
          reason: 'failed',
        },
        cache: {
          decision: 'miss',
          action: 'none',
        },
      });

      const node = plan.nodes.get(name);

      if (!node) {
        return;
      }

      this.notifyDependentsFailed(node, plan, ctx, results);
    }
  }

  // ---------------------------
  // READY PROPAGATION
  // ---------------------------
  private notifyDependentsReady(
    node: ExecutionNode,
    plan: ExecutionPlan,
    ctx: ExecutionContext,
    readyQueue: string[],
  ): void {
    for (const dependent of node.dependents) {
      const depNode = plan.nodes.get(dependent);

      if (!depNode || !depNode.shouldRun) {
        continue;
      }

      if (ctx.nodeStates.get(dependent) !== 'pending') {
        continue;
      }

      const ready = depNode.dependencies.every(
        (dependency) => ctx.nodeStates.get(dependency) === 'success',
      );

      if (!ready) {
        continue;
      }

      ctx.nodeStates.set(dependent, 'ready');
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
      const depNode = plan.nodes.get(dependent);

      if (!depNode) {
        continue;
      }

      if (ctx.nodeStates.get(dependent) !== 'pending') {
        continue;
      }

      ctx.nodeStates.set(dependent, 'skipped');

      results.push({
        package: dependent,
        status: 'skipped',
        changeReason: 'dependency-failed',
        execution: {
          reason: 'failed',
        },
        cache: {
          decision: 'miss',
          action: 'none',
        },
      });
    }
  }
}
