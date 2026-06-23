// packages/governance/src/analysis/graph/topology-level.ts

export function topoLevels(
  graph: Map<
    string,
    {
      dependencies: readonly string[];
    }
  >,
) {
  const indegree = new Map<string, number>();

  // 1. init
  for (const node of graph.keys()) {
    indegree.set(node, 0);
  }

  // 2. build indegree
  for (const [, value] of graph) {
    for (const dep of value.dependencies) {
      if (!graph.has(dep)) continue;

      indegree.set(dep, (indegree.get(dep) ?? 0) + 1);
    }
  }

  const levels: string[][] = [];

  let currentLevel = Array.from(indegree.entries())
    .filter(([, deg]) => deg === 0)
    .map(([node]) => node);

  const visited = new Set<string>();

  while (currentLevel.length > 0) {
    const level: string[] = [];
    const nextLevelCandidates = new Set<string>();

    for (const node of currentLevel) {
      if (visited.has(node)) continue;

      visited.add(node);
      level.push(node);

      const deps = graph.get(node)?.dependencies ?? [];

      for (const dep of deps) {
        if (!graph.has(dep)) continue;

        const newDeg = (indegree.get(dep) ?? 0) - 1;
        indegree.set(dep, newDeg);

        if (newDeg === 0) {
          nextLevelCandidates.add(dep);
        }
      }
    }

    levels.push(level);
    currentLevel = Array.from(nextLevelCandidates);
  }

  return levels;
}
