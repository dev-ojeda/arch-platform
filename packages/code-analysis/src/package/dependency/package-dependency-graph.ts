// packages/code-analysis/src/package/dependency/package-dependency-graph.ts

import type { PackageDependency } from './package-dependency.js';

export interface PackageDependencyGraph {
  readonly dependencies: readonly PackageDependency[];
}
