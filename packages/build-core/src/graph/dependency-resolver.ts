// packages/build-core/src/graph/dependency-resolver.ts

import { LOG_EVENTS } from '../logging/log-events.js';
import { logger } from '../logging/logger.js';

import type { GraphEngine } from './graph-engine.js';
import type { RuntimeState } from './runtime-state.js';

export class DependencyResolver {
  constructor(
    private graph: GraphEngine,
    private runtime: RuntimeState,
  ) {}

  isReady(name: string, scope: Set<string>): boolean {
    const deps = this.graph.getDependencies(name);

    const ready = deps.every((dep) => !scope.has(dep) || this.runtime.isCompleted(dep));

    logger.trace(LOG_EVENTS.DEPENDENCY_RESOLVER, {
      metadata: {
        name,
        deps,
        statuses: deps.map((d) => ({
          dep: d,
          inScope: scope.has(d),
          state: this.runtime.get(d),
        })),
        ready,
      },
    });

    return ready;
  }

  toposort(scope: Set<string>): string[] {
    const indegree = new Map<string, number>();

    const edges = new Map<string, string[]>();

    for (const name of scope) {
      indegree.set(name, 0);
    }

    for (const name of scope) {
      const node = this.graph.getNode(name);

      for (const dep of node.dependencies) {
        if (!scope.has(dep)) {
          continue;
        }

        indegree.set(name, (indegree.get(name) ?? 0) + 1);

        const list = edges.get(dep) ?? [];

        list.push(name);

        edges.set(dep, list);
      }
    }

    const ready = [...indegree].filter(([_, d]) => d === 0).map(([n]) => n);

    const result: string[] = [];

    while (ready.length > 0) {
      const name = ready.shift();

      if (!name) {
        continue;
      }

      result.push(name);

      for (const next of edges.get(name) ?? []) {
        const d = (indegree.get(next) ?? 0) - 1;

        indegree.set(next, d);

        if (d === 0) {
          ready.push(next);
        }
      }
    }
    return result;
  }
}
