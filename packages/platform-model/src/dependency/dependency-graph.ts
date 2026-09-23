// packages/platform-model/src/dependency/dependency-graph.ts

import type { DependencyNode } from './dependency-node.js';

export interface DependencyGraph {
  readonly nodes: ReadonlyMap<string, DependencyNode>;
}
