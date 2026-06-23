// packages/code-analysis/src/graph/graph-types.ts

export interface ProjectGraphNode {
  id: string;
  filePath?: string;
}

export interface ProjectGraphEdge {
  from: string;
  to: string;
}

export interface ProjectImportGraph {
  nodes: readonly ProjectGraphNode[];
  edges: readonly ProjectGraphEdge[];
}
