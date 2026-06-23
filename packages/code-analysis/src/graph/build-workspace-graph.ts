// packages/code-analysis/src/graph/build-workspace-graph.ts

import type { WorkspaceGraph, WorkspaceGraphNode, WorkspacePackage } from './graph-types.js';

export function buildWorkspaceGraph(packages: readonly WorkspacePackage[]): WorkspaceGraph {
  const nodes = new Map<string, WorkspaceGraphNode>();

  for (const pkg of packages) {
    nodes.set(pkg.name, {
      name: pkg.name,
      rootPath: pkg.rootPath,
    });
  }

  const edges = new Map<string, readonly string[]>();

  for (const pkg of packages) {
    edges.set(pkg.name, pkg.dependencies);
  }

  return {
    nodes,
    edges,
  };
}
