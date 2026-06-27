// packages/build-core/src/graph/graph-engine.ts

import type { DagNode, Graph } from './dag-types.js';

export class GraphEngine {
  private impactCache = new Map<string, Set<string>>();

  constructor(private graph: Graph) {}

  getNode(name: string): DagNode {
    const node = this.graph.get(name);

    if (!node) {
      throw new Error(`Missing node ${name}`);
    }

    return node;
  }

  nodes(): IterableIterator<[string, DagNode]> {
    return this.graph.entries();
  }

  getImpactGraph(changed: Set<string>): Set<string> {
    const key = [...changed].sort().join('|');

    const cached = this.impactCache.get(key);

    if (cached) {
      return cached;
    }

    const result = new Set<string>();

    const queue = [...changed];

    while (queue.length) {
      const name = queue.pop();

      if (!name) {
        continue;
      }

      if (result.has(name)) {
        continue;
      }

      result.add(name);

      const node = this.getNode(name);

      for (const dependent of node.dependents) {
        queue.push(dependent);
      }
    }

    this.impactCache.set(key, result);

    return result;
  }

  getDependencySubgraph(target: string): Set<string> {
    const result = new Set<string>();

    const visit = (name: string) => {
      if (result.has(name)) {
        return;
      }

      result.add(name);

      const node = this.getNode(name);

      for (const dep of node.dependencies) {
        visit(dep);
      }
    };

    visit(target);

    return result;
  }
  getDependencies(name: string): readonly string[] {
    return this.getNode(name).dependencies;
  }
}
