import { describe, expect, it } from 'vitest';

import type { WorkspacePackage } from '@arch-platform/platform-model';

import { buildGraph } from '../../../src/graph/build-graph.js';

// test
describe('buildGraph', () => {
  it('should include runtime dependencies', () => {
    const packages: WorkspacePackage[] = [
      {
        name: '@arch-platform/core',
        root: 'packages/core',
        dependencies: [],
        buildDependencies: [],
        outputs: [],
      },
      {
        name: '@arch-platform/application',
        root: 'packages/application',
        dependencies: ['@arch-platform/core'],
        buildDependencies: [],
        outputs: [],
      },
    ];

    const graph = buildGraph(packages);

    expect(graph.get('@arch-platform/application')?.dependencies).toEqual(['@arch-platform/core']);

    expect(graph.get('@arch-platform/core')?.dependents).toEqual(['@arch-platform/application']);
  });

  it('should include build dependencies from devDependencies', () => {
    const packages: WorkspacePackage[] = [
      {
        name: '@arch-platform/contracts',
        root: 'packages/contracts',
        dependencies: [],
        buildDependencies: [],
        outputs: [],
      },

      {
        name: '@arch-platform/core',
        root: 'packages/core',
        dependencies: [],
        buildDependencies: ['@arch-platform/contracts'],
        outputs: [],
      },
    ];

    const graph = buildGraph(packages);

    expect(graph.get('@arch-platform/core')?.dependencies).toEqual(['@arch-platform/contracts']);

    expect(graph.get('@arch-platform/contracts')?.dependents).toEqual(['@arch-platform/core']);
  });
});
