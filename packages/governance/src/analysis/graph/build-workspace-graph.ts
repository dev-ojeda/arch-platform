// packages/governance/src/analysis/graph/build-workspace-graph.ts

import type { PackageDescriptor, WorkspaceGraph } from '@arch/platform-model';

import type { GovernanceContext } from '../../context/governance-context.js';

export function buildWorkspaceGraph(context: GovernanceContext): WorkspaceGraph {
  const nodes = new Map<string, PackageDescriptor>();
  const edges = new Map<string, readonly string[]>();

  for (const pkg of context.workspace.packages) {
    nodes.set(pkg.name, pkg);
    edges.set(pkg.name, pkg.internalDependencies);
  }

  return {
    nodes,
    edges,
  };
}
