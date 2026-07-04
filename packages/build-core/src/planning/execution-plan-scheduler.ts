// packages\build-core\src\planning\execution-plan-scheduler.ts

import type { BuildResult } from '../executor/build-result.js';
import type { BuildTaskRunner } from '../graph/build-task-runner.js';
import { logger } from '../logging/logger.js';

import type { ExecutionNode, ExecutionPlan } from './execution-plan.js';

export class ExecutionPlanScheduler {
  constructor(
    private readonly runner: BuildTaskRunner,
    private readonly concurrency: number,
  ) {}

  async run(plan: ExecutionPlan): Promise<BuildResult[]> {
    const results: BuildResult[] = [];

    const running = new Map<string, Promise<void>>();
    const completed = new Set<string>();

    const readyQueue: string[] = this.initializeReadyQueue(plan);

    while (readyQueue.length > 0 || running.size > 0) {
      this.dispatch(plan, readyQueue, running, completed, results);

      if (running.size === 0 && readyQueue.length === 0) {
        break;
      }

      if (running.size > 0) {
        await Promise.race(running.values());
      }

      this.updateReadyQueue(plan, readyQueue, completed);
    }

    return results;
  }

  // ---------------------------
  // READY QUEUE INITIALIZATION
  // ---------------------------
  private initializeReadyQueue(plan: ExecutionPlan): string[] {
    const ready: string[] = [];

    for (const [name, node] of plan.nodes) {
      if (this.isReadyInitially(node)) {
        ready.push(name);
      }
    }

    return ready;
  }

  private isReadyInitially(node: ExecutionNode): boolean {
    return node.depsRemaining === 0 && node.shouldRun;
  }

  // ---------------------------
  // DISPATCH
  // ---------------------------
  private dispatch(
    plan: ExecutionPlan,
    readyQueue: string[],
    running: Map<string, Promise<void>>,
    completed: Set<string>,
    results: BuildResult[],
  ): void {
    while (running.size < this.concurrency && readyQueue.length > 0) {
      const name = readyQueue.shift();
      if (!name) return;

      const node = plan.nodes.get(name);

      if (!node) {
        throw new Error(`Missing node in ExecutionPlan: ${name}`);
      }

      if (!node.shouldRun) {
        completed.add(name);
        continue;
      }

      const task = this.execute(name, results, completed);

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
    results: BuildResult[],
    completed: Set<string>,
  ): Promise<void> {
    try {
      const result = await this.runner.run(name);

      results.push(result);

      completed.add(name);
    } catch (error) {
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

      completed.add(name);
    }
  }

  // ---------------------------
  // DYNAMIC READY UPDATE
  // ---------------------------
  private updateReadyQueue(
    plan: ExecutionPlan,
    readyQueue: string[],
    completed: Set<string>,
  ): void {
    for (const [name, node] of plan.nodes) {
      if (completed.has(name)) continue;

      if (readyQueue.includes(name)) continue;

      if (!node.shouldRun) continue;

      if (this.areDependenciesCompleted(node, completed)) {
        readyQueue.push(name);
      }
    }
  }

  private areDependenciesCompleted(node: ExecutionNode, completed: Set<string>): boolean {
    return node.dependencies.every((dep) => completed.has(dep));
  }
}
