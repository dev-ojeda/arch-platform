// packages/code-analysis/src/graph/graph-types.ts

export type ProjectGraphEdgeType = 'relative' | 'package' | 'unknown';

export interface ProjectGraphNode {
  readonly id: string;

  readonly filePath?: string;

  readonly packageName?: string;
}

export interface ProjectGraphEdge {
  from: string;
  to: string;
  kind: 'file-import' | 'package-import';
  resolved: boolean;
}
export interface ProjectImportGraph {
  readonly nodes: readonly ProjectGraphNode[];

  readonly edges: readonly ProjectGraphEdge[];
}
