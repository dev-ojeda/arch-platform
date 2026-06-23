import type { ImportReference } from '../imports/import-types.js';

import type { DependencyGraph, GraphEdge, GraphNode } from './graph-types.js';

export function buildDependencyGraph(imports: ImportReference[]): DependencyGraph {
  const nodes = new Map<string, GraphNode>();

  const edges: GraphEdge[] = [];

  for (const item of imports) {
    nodes.set(item.filePath, {
      id: item.filePath,
    });

    edges.push({
      from: item.filePath,
      to: item.source,
    });
  }

  return {
    nodes: [...nodes.values()],
    edges,
  };
}
