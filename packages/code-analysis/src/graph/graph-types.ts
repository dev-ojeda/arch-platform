// packages/code-analysis/src/graph/graph-types.ts

export interface GraphNode {
  id: string;
}

export interface GraphEdge {
  from: string;

  to: string;
}

export interface DependencyGraph {
  nodes: GraphNode[];

  edges: GraphEdge[];
}
export interface WorkspacePackage {
  readonly name: string;
  readonly rootPath: string;
  readonly dependencies: readonly string[];
}

export interface WorkspaceGraphNode {
  readonly name: string;
  readonly rootPath: string;
}

export interface WorkspaceGraph {
  readonly nodes: ReadonlyMap<string, WorkspaceGraphNode>;
  readonly edges: ReadonlyMap<string, readonly string[]>;
}
