// packages/code-analysis/src/workspace/workspace-types.ts

export interface WorkspacePackage {
  name: string;
  rootPath: string;
  dependencies: readonly string[];
}

export interface WorkspaceGraphNode {
  name: string;
  rootPath: string;
}

export interface WorkspaceGraph {
  nodes: Map<string, WorkspaceGraphNode>;
  edges: Map<string, readonly string[]>;
}
