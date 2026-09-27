// packages\compliance\test\__tests__\dependency-graph-builder.test.ts
import { describe, expect, it } from 'vitest';

import { DependencyGraphBuilder, DependencyLockfileQuery } from '@arch-platform/compliance';
import type { ArchitectureManifest } from '@arch-platform/platform-model';

import {
  dependencyLockfileFixtureCodeAnalisys,
  governanceLockfile,
} from '../fixture/create-dependency-lockfile.js';

describe('DependencyGraphBuilder', () => {
  const query = new DependencyLockfileQuery(dependencyLockfileFixtureCodeAnalisys);

  const architecture: ArchitectureManifest = {
    schemaVersion: 1,
    workspace: {
      name: 'arch-platform',
    },

    packages: [
      {
        name: '@arch-platform/governance',
        path: 'packages/governance',
      },
      {
        name: '@arch-platform/code-analysis',
        path: 'packages/code-analysis',
      },
    ],
  };

  const builder = new DependencyGraphBuilder(query, architecture);

  it('builds the dependency graph for code-analysis', () => {
    const graph = builder.build('@arch-platform/code-analysis');

    expect(graph.nodes.has('ts-morph@25.0.0')).toBe(true);
    expect(graph.nodes.has('@ts-morph/common@0.26.1')).toBe(true);
    expect(graph.nodes.has('minimatch@9.0.9')).toBe(true);
    expect(graph.nodes.has('brace-expansion@2.1.1')).toBe(true);
  });

  it('builds the transitive graph through a workspace dependency', () => {
    const query = new DependencyLockfileQuery(governanceLockfile);

    const builder = new DependencyGraphBuilder(query, architecture);

    const graph = builder.build('@arch-platform/governance');

    expect(graph.nodes.has('@arch-platform/code-analysis@link:../code-analysis')).toBe(true);

    expect(graph.nodes.has('ts-morph@25.0.0')).toBe(true);
    expect(graph.nodes.has('@ts-morph/common@0.26.1')).toBe(true);
    expect(graph.nodes.has('minimatch@9.0.9')).toBe(true);
    expect(graph.nodes.has('brace-expansion@2.1.1')).toBe(true);
  });
});
