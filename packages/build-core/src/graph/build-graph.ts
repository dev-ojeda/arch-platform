// packages/build-core/src/graph/build-graph.ts

import type { WorkspacePackage } from '../workspace/workspace-package.js';

import type { DagNode, Graph } from './dag-types.js';

export function buildGraph(packages: WorkspacePackage[]): Graph {
  const graph: Graph = new Map();

  const names = new Set(packages.map((p) => p.name));

  for (const pkg of packages) {
    const workspaceDependencies = [...pkg.dependencies, ...pkg.buildDependencies].filter((d) =>
      names.has(d),
    );

    const node: DagNode = {
      name: pkg.name,
      root: pkg.root,
      outputs: pkg.outputs,

      dependencies: workspaceDependencies,

      dependents: [],

      build: pkg.build,
    };

    graph.set(node.name, node);
  }

  for (const node of graph.values()) {
    for (const dep of node.dependencies) {
      graph.get(dep)?.dependents.push(node.name);
    }
  }

  return graph;
}
