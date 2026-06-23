// packages/code-analysis/test/__tests__/workspace-graph.test.ts

import { describe, expect, it } from 'vitest';

import { buildWorkspaceGraph } from '../../src/graph/build-workspace-graph.js';
import type { WorkspacePackage } from '../../src/workspace/workspace-types.js';

describe('buildWorkspaceGraph', () => {
  it('should create workspace graph nodes and edges', () => {
    const packages: readonly WorkspacePackage[] = [
      {
        name: '@arch/application',
        rootPath: 'packages/application',
        dependencies: ['@arch/domain-order'],
      },
      {
        name: '@arch/domain-order',
        rootPath: 'packages/domain-order',
        dependencies: [],
      },
    ];

    const graph = buildWorkspaceGraph(packages);

    expect(graph.nodes.size).toBe(2);

    expect(graph.nodes.has('@arch/application')).toBe(true);

    expect(graph.nodes.has('@arch/domain-order')).toBe(true);

    expect(graph.edges.get('@arch/application')).toEqual(['@arch/domain-order']);

    expect(graph.edges.get('@arch/domain-order')).toEqual([]);
  });
});
