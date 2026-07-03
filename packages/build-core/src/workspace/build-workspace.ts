// packages/build-core/src/workspace/build-workspace.ts

import type { PackageRoot } from '../package/packages-root.js';

import type { WorkspaceGraphNode } from './workspace-graph-node.js';
import type { WorkspaceGraph } from './workspace-graph.js';

export function buildWorkspaceGraph(packages: readonly PackageRoot[]): WorkspaceGraph {
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
