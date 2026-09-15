// packages/compliance/src/dependency/dependency-node.ts

export interface DependencyNode {
  readonly id: string;
  readonly packageName: string;
  readonly version: string;
  readonly dependencies: readonly string[];
  readonly dependents: readonly string[];
}
