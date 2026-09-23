// packages\compliance\test\fixture\create-dependency-graph.ts
import type { DependencyGraph, DependencyNode } from '@arch-platform/platform-model';

export const dependencyGraphFixture: DependencyGraph = {
  nodes: new Map<string, DependencyNode>([
    [
      '@arch-platform/code-analysis',
      {
        id: '@arch-platform/code-analysis',
        packageName: '@arch-platform/code-analysis',
        version: '0.1.0',
        dependencies: ['ts-morph@25.0.0', 'typescript@5.9.2'],
        dependents: [],
      },
    ],
    [
      'ts-morph@25.0.0',
      {
        id: 'ts-morph@25.0.0',
        packageName: 'ts-morph',
        version: '25.0.0',
        dependencies: ['@ts-morph/common@0.26.1'],
        dependents: ['@arch-platform/code-analysis'],
      },
    ],
    [
      '@ts-morph/common@0.26.1',
      {
        id: '@ts-morph/common@0.26.1',
        packageName: '@ts-morph/common',
        version: '0.26.1',
        dependencies: ['minimatch@9.0.9'],
        dependents: ['ts-morph@25.0.0'],
      },
    ],
    [
      'minimatch@9.0.9',
      {
        id: 'minimatch@9.0.9',
        packageName: 'minimatch',
        version: '9.0.9',
        dependencies: ['brace-expansion@2.1.1'],
        dependents: ['@ts-morph/common@0.26.1'],
      },
    ],
    [
      'brace-expansion@2.1.1',
      {
        id: 'brace-expansion@2.1.1',
        packageName: 'brace-expansion',
        version: '2.1.1',
        dependencies: [],
        dependents: ['minimatch@9.0.9'],
      },
    ],
    [
      'typescript@5.9.2',
      {
        id: 'typescript@5.9.2',
        packageName: 'typescript',
        version: '5.9.2',
        dependencies: [],
        dependents: ['@arch-platform/code-analysis'],
      },
    ],
  ]),
};
