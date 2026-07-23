// packages/build-core/src/hash/hash-graph.ts

import type { Graph, HashResult } from '@arch/platform-model';

import type { DagHasher } from './dag-hasher.js';

export class HashGraphBuilder {
  constructor(
    private readonly graph: Graph,
    private readonly hasher: DagHasher,
  ) {}

  build(): Map<string, HashResult> {
    const cache = new Map<string, HashResult>();
    const visiting = new Set<string>();

    const visit = (name: string): HashResult => {
      const cached = cache.get(name);
      if (cached) return cached;

      if (visiting.has(name)) {
        throw new Error(`Cycle detected at ${name}`);
      }

      visiting.add(name);

      const node = this.graph.get(name);
      if (!node) throw new Error(`Missing node ${name}`);

      const dependencyHashes: string[] = [];

      for (const dep of node.dependencies) {
        dependencyHashes.push(visit(dep).hash);
      }

      const result = this.hasher.hash(node, {
        dependencyHashes,
      });

      visiting.delete(name);
      cache.set(name, result);

      return result;
    };

    for (const name of this.graph.keys()) {
      visit(name);
    }

    return cache;
  }
}
