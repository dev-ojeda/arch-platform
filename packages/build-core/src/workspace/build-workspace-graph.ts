// packages/build-core/src/workspace/build-workspace-graph.ts

import type { WorkspaceGraph, WorkspaceGraphNode } from './workspace-graph.js';
import type { WorkspacePackage } from './workspace-package.js';

export function buildWorkspaceGraph(packages: readonly WorkspacePackage[]): WorkspaceGraph {
  const nodes = new Map<string, WorkspaceGraphNode>();

  for (const pkg of packages) {
    nodes.set(pkg.name, {
      name: pkg.name,
      rootPath: pkg.root,
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
