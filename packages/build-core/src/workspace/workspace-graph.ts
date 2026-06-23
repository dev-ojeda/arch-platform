// packages/build-core/src/workspace/workspace-graph.ts

export interface WorkspaceGraphNode {
  readonly name: string;
  readonly rootPath: string;
}

export interface WorkspaceGraph {
  readonly nodes: Map<string, WorkspaceGraphNode>;

  /**
   * key:
   *   workspace package
   *
   * value:
   *   internal dependencies
   */
  readonly edges: Map<string, readonly string[]>;
}
