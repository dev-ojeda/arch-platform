import type { ImportReference } from '../imports/import-types.js';

import type { ProjectGraphEdge, ProjectGraphNode, ProjectImportGraph } from './graph-types.js';

export function buildDependencyGraph(imports: ImportReference[]): ProjectImportGraph {
  const nodes = new Map<string, ProjectGraphNode>();

  const edges: ProjectGraphEdge[] = [];

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
