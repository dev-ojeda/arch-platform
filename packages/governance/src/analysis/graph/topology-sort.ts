// packages/governance/src/analysis/graph/topology-sort.ts

export function topologySort(graph: { nodes: Map<string, { internalDependencies: string[] }> }) {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const result: string[] = [];

  function visit(node: string) {
    if (visited.has(node)) return;

    if (visiting.has(node)) {
      throw new Error(`Cycle detected at ${node}`);
    }

    visiting.add(node);

    const deps = graph.nodes.get(node)?.internalDependencies ?? [];

    for (const dep of deps) {
      if (graph.nodes.has(dep)) {
        visit(dep);
      }
    }

    visiting.delete(node);
    visited.add(node);

    result.push(node);
  }

  for (const node of graph.nodes.keys()) {
    visit(node);
  }

  return result;
}
