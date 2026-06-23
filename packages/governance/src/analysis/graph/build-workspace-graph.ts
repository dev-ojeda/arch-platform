// packages/governance/src/analysis/graph/build-workspace-graph.ts

import type { GovernanceContext } from '../../types/governance-context.js';

export function buildWorkspaceGraph(context: GovernanceContext) {
  const nodes = new Map<
    string,
    {
      name: string;
      rootPath: string;
      dependencies: readonly string[];
    }
  >();

  for (const pkg of context.packages) {
    nodes.set(pkg.name, {
      name: pkg.name,
      rootPath: pkg.rootPath,
      dependencies: pkg.internalDependencies,
    });
  }

  const edges = new Map<string, readonly string[]>();

  for (const [name, node] of nodes) {
    edges.set(name, node.dependencies);
  }

  return {
    nodes,
    edges,
  };
}
