import { describe, expect, it } from 'vitest';

import type { PackageRoot } from '../../../src/package/packages-root.js';
import { buildWorkspaceGraph } from '../../../src/workspace/build-workspace.js';

const pkg = (overrides: Partial<PackageRoot>): PackageRoot => ({
  name: '@arch/test',
  root: 'packages/test',
  dependencies: [],
  buildDependencies: [],
  outputs: [],
  ...overrides,
});

describe('buildWorkspaceGraph', () => {
  it('should create workspace nodes', () => {
    const graph = buildWorkspaceGraph([
      pkg({
        name: '@arch/core',
        root: 'packages/core',
      }),

      pkg({
        name: '@arch/application',
        root: 'packages/application',
        dependencies: ['@arch/core'],
      }),
    ]);

    expect(graph.nodes.size).toBe(2);

    expect(graph.edges.get('@arch/application')).toContain('@arch/core');
  });

  it('should create workspace graph nodes and edges', () => {
    const packages: readonly PackageRoot[] = [
      pkg({
        name: '@arch/application',
        root: 'packages/application',
        dependencies: ['@arch/domain-order'],
      }),

      pkg({
        name: '@arch/domain-order',
        root: 'packages/domain-order',
      }),
    ];

    const graph = buildWorkspaceGraph(packages);

    expect(graph.nodes.size).toBe(2);

    expect(graph.nodes.has('@arch/application')).toBe(true);

    expect(graph.nodes.has('@arch/domain-order')).toBe(true);

    expect(graph.edges.get('@arch/application')).toEqual(['@arch/domain-order']);

    expect(graph.edges.get('@arch/domain-order')).toEqual([]);
  });
});
