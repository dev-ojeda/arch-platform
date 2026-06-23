import { describe, expect, it } from 'vitest';

import { buildWorkspaceGraph } from '../../src/workspace/build-workspace-graph.js';
import type { WorkspacePackage } from '../../src/workspace/workspace-package.js';

describe('buildWorkspaceGraph', () => {
  it('should create workspace nodes', () => {
    const graph = buildWorkspaceGraph([
      {
        name: '@arch/core',
        root: 'packages/core',
        dependencies: [],
        outputs: [],
      },
      {
        name: '@arch/application',
        root: 'packages/application',
        dependencies: ['@arch/core'],
        outputs: [],
      },
    ]);

    expect(graph.nodes.size).toBe(2);

    expect(graph.edges.get('@arch/application')).toContain('@arch/core');
  });
  it('should create workspace graph nodes and edges', () => {
    const packages: readonly WorkspacePackage[] = [
      {
        name: '@arch/application',
        root: 'packages/application',
        dependencies: ['@arch/domain-order'],
        outputs: [],
      },
      {
        name: '@arch/domain-order',
        root: 'packages/domain-order',
        dependencies: [],
        outputs: [],
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
