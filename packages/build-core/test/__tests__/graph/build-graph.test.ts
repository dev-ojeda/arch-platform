import { describe, expect, it } from 'vitest';

import { buildGraph } from '../../../src/graph/build-graph.js';
import type { WorkspacePackage } from '../../../src/workspace/workspace-package.js';

describe('buildGraph', () => {
  it('should include runtime dependencies', () => {
    const packages: WorkspacePackage[] = [
      {
        name: '@arch/core',
        root: 'packages/core',
        dependencies: [],
        buildDependencies: [],
        outputs: [],
      },
      {
        name: '@arch/application',
        root: 'packages/application',
        dependencies: ['@arch/core'],
        buildDependencies: [],
        outputs: [],
      },
    ];

    const graph = buildGraph(packages);

    expect(graph.get('@arch/application')?.dependencies).toEqual(['@arch/core']);

    expect(graph.get('@arch/core')?.dependents).toEqual(['@arch/application']);
  });

  it('should include build dependencies from devDependencies', () => {
    const packages: WorkspacePackage[] = [
      {
        name: '@arch/contracts',
        root: 'packages/contracts',
        dependencies: [],
        buildDependencies: [],
        outputs: [],
      },

      {
        name: '@arch/core',
        root: 'packages/core',
        dependencies: [],
        buildDependencies: ['@arch/contracts'],
        outputs: [],
      },
    ];

    const graph = buildGraph(packages);

    expect(graph.get('@arch/core')?.dependencies).toEqual(['@arch/contracts']);

    expect(graph.get('@arch/contracts')?.dependents).toEqual(['@arch/core']);
  });
});
