// packages/code-analysis/src/symbol-dependencies/package-dependency-graph.ts

import type { PackageDependency } from './package-dependency.js';

export interface PackageDependencyGraph {
  readonly dependencies: readonly PackageDependency[];
}
