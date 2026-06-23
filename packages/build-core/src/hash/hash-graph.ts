// packages/build-core/src/hash/hash-graph.ts

import type { Graph } from '../graph/dag-types.js';

import type { DagHasher } from './dag-hasher.js';
import type { HashResult } from './hash-result.js';

export class HashGraphBuilder {
  constructor(
    private graph: Graph,
    private hasher: DagHasher,
  ) {}

  build(): Map<string, HashResult> {
    const hashes = new Map<string, HashResult>();

    const visit = (name: string): HashResult => {
      const cached = hashes.get(name);

      if (cached) {
        return cached;
      }

      const node = this.graph.get(name);

      if (!node) {
        throw new Error(`Missing node ${name}`);
      }

      const dependencyHashes = node.dependencies.map((dep) => visit(dep).hash);

      const result = this.hasher.hash(node, {
        dependencyHashes,
      });

      hashes.set(name, result);

      return result;
    };

    for (const name of this.graph.keys()) {
      visit(name);
    }

    return hashes;
  }
}
