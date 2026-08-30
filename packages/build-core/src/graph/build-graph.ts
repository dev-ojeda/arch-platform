// packages/build-core/src/graph/build-graph.ts

import type { Graph, MutableGraph, WorkspacePackage } from '@arch/platform-model';

export function buildGraph(packages: readonly WorkspacePackage[]): Graph {
  const graph = createGraph(packages);

  linkDependents(graph);

  freezeGraph(graph);

  return graph;
}
function createGraph(packages: readonly WorkspacePackage[]): MutableGraph {
  const graph: MutableGraph = new Map();
  const workspacePackages = new Set(packages.map((pkg) => pkg.name));

  for (const pkg of packages) {
    graph.set(pkg.name, {
      name: pkg.name,
      root: pkg.root,
      dependencies: resolveWorkspaceDependencies(pkg, workspacePackages),
      dependents: [],
      outputs: [...pkg.outputs],
      artifactType: pkg.artifactType,
      build: pkg.build,
    });
  }
  function resolveWorkspaceDependencies(
    pkg: WorkspacePackage,
    workspacePackages: ReadonlySet<string>,
  ): string[] {
    return [...pkg.dependencies, ...pkg.buildDependencies].filter((dependency) =>
      workspacePackages.has(dependency),
    );
  }
  return graph;
}
function linkDependents(graph: MutableGraph): void {
  for (const node of graph.values()) {
    for (const dependency of node.dependencies) {
      const dependencyNode = graph.get(dependency);

      if (!dependencyNode) {
        throw new Error(`Graph invariant violated: dependency "${dependency}" does not exist.`);
      }

      dependencyNode.dependents.push(node.name);
    }
  }
}

function freezeGraph(graph: MutableGraph): void {
  for (const node of graph.values()) {
    Object.freeze(node.dependencies);
    Object.freeze(node.dependents);
    Object.freeze(node.outputs);

    Object.freeze(node);
  }
}
