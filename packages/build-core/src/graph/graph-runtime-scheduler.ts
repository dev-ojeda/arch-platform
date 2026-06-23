// packages/build-core/src/graph/graph-runtime-scheduler.ts

import type { BuildResult } from '../cache/cache-types.js';
import { logger } from '../logging/logger.js';

import type { BuildTaskRunner } from './build-task-runner.js';
import type { DependencyResolver } from './dependency-resolver.js';
import type { RuntimeState } from './runtime-state.js';

export class GraphRuntimeScheduler {
  constructor(
    private readonly runner: BuildTaskRunner,
    private readonly resolver: DependencyResolver,
    private readonly runtime: RuntimeState,
    private readonly concurrency: number,
  ) {}

  async run(scope: Set<string>): Promise<BuildResult[]> {
    this.runtime.reset(scope);

    const queue = this.resolver.toposort(scope);

    const running = new Map<string, Promise<void>>();

    const results: BuildResult[] = [];

    while (queue.length > 0 || running.size > 0) {
      this.dispatchReadyTasks(queue, scope, running, results);

      if (running.size === 0 && queue.length > 0) {
        throw new Error(`Deadlock detected. Remaining nodes: ${queue.join(', ')}`);
      }

      if (running.size > 0) {
        await Promise.race(running.values());
      }
    }

    return results;
  }

  private dispatchReadyTasks(
    queue: string[],
    scope: Set<string>,
    running: Map<string, Promise<void>>,
    results: BuildResult[],
  ): void {
    while (this.canSchedule(queue, running)) {
      const name = this.tryDequeueReadyNode(queue, scope);

      if (!name) {
        return;
      }
      const task = this.executeTask(name, results);

      this.trackTask(name, task, running);
    }
  }

  private async executeTask(name: string, results: BuildResult[]): Promise<void> {
    this.runtime.set(name, 'running');

    try {
      const result = await this.runner.run(name);

      results.push(result);

      if (result.status === 'failed') {
        this.runtime.set(name, 'failed');
      } else {
        this.runtime.set(name, 'done');
      }
    } catch (error) {
      this.runtime.set(name, 'failed');
      throw error;
    }
  }

  private canSchedule(queue: string[], running: Map<string, Promise<void>>): boolean {
    return queue.length > 0 && running.size < this.concurrency;
  }

  private tryDequeueReadyNode(queue: string[], scope: Set<string>): string | undefined {
    const index = queue.findIndex((name) => this.resolver.isReady(name, scope));

    logger.trace('ready check', {
      metadata: {
        queue,
        index,
      },
    });

    if (index < 0) {
      return undefined;
    }

    const [name] = queue.splice(index, 1);

    return name;
  }

  private trackTask(name: string, task: Promise<void>, running: Map<string, Promise<void>>): void {
    running.set(name, task);

    task.then(
      () => running.delete(name),
      () => running.delete(name),
    );
  }
}
