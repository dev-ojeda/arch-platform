// packages/governance/src/analysis/graph/detect-cycles.ts

import type { CycleDetectionResult } from '../../types/cycle-detection-result.js';

export function detectCycles(
  graph: Map<
    string,
    {
      dependencies: readonly string[];
    }
  >,
): CycleDetectionResult {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const path: string[] = [];

  const cycles: string[][] = [];

  function dfs(node: string) {
    if (stack.has(node)) {
      const index = path.indexOf(node);
      cycles.push([...path.slice(index), node]);
      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    stack.add(node);
    path.push(node);

    const deps = graph.get(node)?.dependencies ?? [];
    for (const dep of deps) {
      if (graph.has(dep)) {
        dfs(dep);
      }
    }

    path.pop();
    stack.delete(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) dfs(node);
  }

  return {
    cycles,
    hasCycle: cycles.length > 0,
  };
}
