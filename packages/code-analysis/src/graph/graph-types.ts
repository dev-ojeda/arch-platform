// packages/code-analysis/src/graph/graph-types.ts
export type ProjectGraphEdgeType = 'file-import' | 'package-import' | 'external-import';

export interface ProjectGraphNode {
  readonly id: string;

  readonly filePath?: string;

  readonly packageName?: string;
}

export interface ProjectGraphEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: ProjectGraphEdgeType;
  readonly resolved: boolean;
}
export interface ProjectImportGraph {
  readonly nodes: readonly ProjectGraphNode[];

  readonly edges: readonly ProjectGraphEdge[];
}
