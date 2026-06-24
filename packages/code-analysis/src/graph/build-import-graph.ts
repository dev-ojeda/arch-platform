// packages/code-analysis/src/graph/build-import-graph.ts

import type { ResolvedImportReference } from '../imports/import-types.js';

import type { ProjectGraphEdge, ProjectGraphNode, ProjectImportGraph } from './graph-types.js';

export function buildImportGraph(imports: readonly ResolvedImportReference[]): ProjectImportGraph {
  const nodes = new Map<string, ProjectGraphNode>();

  const edges: ProjectGraphEdge[] = [];

  for (const item of imports) {
    const target = item.targetFile ?? item.moduleSpecifier;

    nodes.set(item.sourceFile, {
      id: item.sourceFile,
    });

    nodes.set(target, {
      id: target,
    });

    edges.push({
      from: item.sourceFile,
      to: target,
      kind: item.targetFile ? 'file-import' : 'package-import',

      resolved: item.resolved,
    });
  }

  return {
    nodes: [...nodes.values()],
    edges,
  };
}
