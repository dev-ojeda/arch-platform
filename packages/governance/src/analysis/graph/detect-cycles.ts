// packages/governance/src/analysis/graph/detect-cycles.ts

import type { CycleDetectionResult } from '@arch/platform-model';

export function detectCycles(edges: ReadonlyMap<string, readonly string[]>): CycleDetectionResult {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const currentPath: string[] = [];

  const cycles: string[][] = [];

  function dfs(node: string): void {
    if (stack.has(node)) {
      const index = currentPath.indexOf(node);
      cycles.push([...currentPath.slice(index), node]);
      return;
    }

    if (visited.has(node)) {
      return;
    }

    visited.add(node);
    stack.add(node);
    currentPath.push(node);

    const dependencies = edges.get(node) ?? [];

    for (const dependency of dependencies) {
      if (edges.has(dependency)) {
        dfs(dependency);
      }
    }

    currentPath.pop();
    stack.delete(node);
  }

  for (const node of edges.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }
  const cycleCount = cycles.length;

  return {
    hasCycle: cycleCount > 0,
    cycleCount,
    cycles,
  };
}
