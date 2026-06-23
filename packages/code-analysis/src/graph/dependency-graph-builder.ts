import type { ImportReference } from '../imports/import-types.js';

import type { DependencyGraph, GraphEdge, GraphNode } from './graph-types.js';

export function buildDependencyGraph(imports: ImportReference[]): DependencyGraph {
  const nodes = new Map<string, GraphNode>();

  const edges: GraphEdge[] = [];

  for (const item of imports) {
    nodes.set(item.sourceFile, {
      id: item.sourceFile,
    });

    nodes.set(item.moduleSpecifier, {
      id: item.moduleSpecifier,
    });

    edges.push({
      from: item.sourceFile,
      to: item.moduleSpecifier,
    });
  }

  return {
    nodes: [...nodes.values()],
    edges,
  };
}
